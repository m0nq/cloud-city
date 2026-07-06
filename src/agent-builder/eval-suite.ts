import fs from 'fs';
import path from 'path';
import { ZodError, z } from 'zod';

import type { AgentSpec } from './schema';
import {
    getEventReadinessFixtureRequirements,
    validateEventReadinessFixtureFile,
    validateVenueCandidateFixtureFile,
    type EventReadinessFixture,
    type VenueCandidateFixture
} from './fixtures';
import { loadYamlFile, validateAgentSpecFile } from './validation';

const nonEmptyString = z.string().trim().min(1);
const stringArray = z.array(nonEmptyString).default([]);

export type EvalOutcome = 'PASS' | 'PARTIAL' | 'FAIL';

export const evalSuiteCaseSchema = z
    .object({
        id: nonEmptyString,
        fixture_path: nonEmptyString,
        expected_readiness_label: nonEmptyString.optional(),
        required_core_fields: stringArray,
        required_domain_check_sections: stringArray,
        canonical_source_labels: stringArray,
        required_source_labels: stringArray,
        required_source_material_labels: stringArray,
        required_seeded_issues: stringArray,
        required_output_fields: stringArray,
        required_venue_fit_criteria: stringArray,
        required_approval_gates: stringArray,
        required_evaluation_tests: stringArray,
        required_prohibited_output_behavior: stringArray
    })
    .passthrough();

export const evalSuiteSchema = z
    .object({
        eval_suite: z
            .object({
                id: nonEmptyString,
                name: nonEmptyString,
                version: nonEmptyString,
                fixture_type: nonEmptyString.optional(),
                spec_path: nonEmptyString.optional(),
                cases: z.array(evalSuiteCaseSchema).min(1)
            })
            .passthrough()
    })
    .passthrough();

export type EvalSuite = z.infer<typeof evalSuiteSchema>;
export type EvalSuiteCase = z.infer<typeof evalSuiteCaseSchema>;

export type EvalSuiteValidationCheck = {
    id: string;
    label: string;
    passed: boolean;
    details: string;
};

export type EvalSuiteValidationReport = {
    suitePath: string;
    schemaPassed: boolean;
    suite?: EvalSuite;
    checks: EvalSuiteValidationCheck[];
    errors: string[];
};

export type EvalChecklistItem = {
    label: string;
    passed: boolean;
    details: string;
};

export type EvalCaseResult = {
    caseId: string;
    fixturePath: string;
    candidateName?: string;
    boundedReviewClassification?: string;
    outcome: EvalOutcome;
    checks: EvalChecklistItem[];
};

export type EvalRunReport = {
    suitePath: string;
    suiteId: string;
    suiteName: string;
    specPath: string;
    outcome: EvalOutcome;
    cases: EvalCaseResult[];
};

const eventReadinessAuthoritativeSpecPath = 'agent_specs/event_readiness.v0.1.yaml';

const normalize = (value: string) => value.trim().toLowerCase();

const normalizeSentence = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const unique = (values: string[]) => Array.from(new Set(values.map(value => value.trim()).filter(Boolean)));

const missingValues = (actualValues: string[], requiredValues: string[]) => {
    const actual = new Set(actualValues.map(normalize));
    return requiredValues.filter(value => !actual.has(normalize(value)));
};

const makeValidationCheck = (
    id: string,
    label: string,
    passed: boolean,
    details: string
): EvalSuiteValidationCheck => ({
    id,
    label,
    passed,
    details
});

const makeExactValuesValidationCheck = (
    id: string,
    label: string,
    actualValues: string[],
    expectedValues: string[]
): EvalSuiteValidationCheck => {
    const missing = missingValues(actualValues, expectedValues);
    const unexpected = unexpectedValues(actualValues, expectedValues);
    const passed = missing.length === 0 && unexpected.length === 0;
    const details = passed
        ? 'PASS'
        : [missing.length > 0 ? `missing: ${missing.join(', ')}` : '', unexpected.length > 0 ? `unexpected: ${unexpected.join(', ')}` : '']
              .filter(Boolean)
              .join('; ');

    return makeValidationCheck(id, label, passed, details);
};

const makeSubsetValuesValidationCheck = (
    id: string,
    label: string,
    actualValues: string[],
    allowedValues: string[]
): EvalSuiteValidationCheck => {
    const unexpected = unexpectedValues(actualValues, allowedValues);
    return makeValidationCheck(
        id,
        label,
        unexpected.length === 0,
        unexpected.length === 0 ? 'PASS' : `unexpected: ${unexpected.join(', ')}`
    );
};

const makeChecklistItem = (label: string, actualValues: string[], requiredValues: string[]): EvalChecklistItem => {
    const missing = missingValues(actualValues, requiredValues);

    return {
        label,
        passed: missing.length === 0,
        details: missing.length === 0 ? 'PASS' : `missing: ${missing.join(', ')}`
    };
};

const unexpectedValues = (actualValues: string[], allowedValues: string[]) => {
    const allowed = new Set(allowedValues.map(normalize));
    return actualValues.filter(value => !allowed.has(normalize(value)));
};

const makeAllowedValuesCheck = (label: string, actualValues: string[], allowedValues: string[]): EvalChecklistItem => {
    const unexpected = unexpectedValues(actualValues, allowedValues);

    return {
        label,
        passed: unexpected.length === 0,
        details: unexpected.length === 0 ? 'PASS' : `unexpected: ${unexpected.join(', ')}`
    };
};

const caseOutcome = (checks: EvalChecklistItem[]): EvalOutcome => (checks.every(check => check.passed) ? 'PASS' : 'FAIL');

const suiteOutcome = (cases: EvalCaseResult[]): EvalOutcome => {
    const passedCount = cases.filter(evalCase => evalCase.outcome === 'PASS').length;

    if (passedCount === cases.length) {
        return 'PASS';
    }

    if (passedCount === 0) {
        return 'FAIL';
    }

    return 'PARTIAL';
};

const combineRequirements = (fixtureValues: string[], caseValues: string[]) => unique([...fixtureValues, ...caseValues]);

const getSuiteFixtureType = (suite: EvalSuite['eval_suite']) => suite.fixture_type || 'venue_candidate';

const isEventReadinessSuite = (suite: EvalSuite['eval_suite']) => getSuiteFixtureType(suite) === 'event_readiness';

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
    typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;

const readString = (record: Record<string, unknown> | undefined, key: string) => {
    const value = record?.[key];
    return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
};

const readBoolean = (record: Record<string, unknown> | undefined, key: string) => {
    const value = record?.[key];
    return typeof value === 'boolean' ? value : undefined;
};

const readStringArray = (record: Record<string, unknown> | undefined, key: string) => {
    const value = record?.[key];
    return Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim().length > 0)
        ? (value as string[])
        : undefined;
};

type EventReadinessSpecAuthority = {
    agentSlug: string;
    implementationStage?: string;
    draftOnly?: boolean;
    humanReviewed?: boolean;
    approvalGated?: boolean;
    externalExecutionAllowed?: boolean;
    autonomousToolUseAllowed?: boolean;
    productionIntegrationAllowed?: boolean;
    canonicalSourceLabels: string[];
    approvalGateIds: string[];
    allowedReadinessLabels: string[];
    requiredCoreFields: string[];
    requiredDomainCheckSections: string[];
    evaluationTestIds: string[];
    allowedProhibitedOutputBehavior: string[];
};

const buildEventReadinessProhibitedOutputBehavior = ({
    prohibitedActions,
    conflictRules,
    onTrackRule
}: {
    prohibitedActions: string[];
    conflictRules: string[];
    onTrackRule?: string;
}) => {
    const actionSet = new Set(prohibitedActions.map(normalizeSentence));
    const conflictRuleSet = new Set(conflictRules.map(normalizeSentence));
    const normalizedOnTrackRule = onTrackRule ? normalizeSentence(onTrackRule) : '';
    const behavior: string[] = [];

    if (Array.from(actionSet).some(action => action.includes('declare an event ready'))) {
        behavior.push('Do not declare the event ready.');
    }
    if (Array.from(actionSet).some(action => action.includes('declare an event approved'))) {
        behavior.push('Do not declare the event approved.');
    }
    if (Array.from(actionSet).some(action => action.includes('declare an event cleared'))) {
        behavior.push('Do not declare the event cleared.');
    }
    if (Array.from(actionSet).some(action => action.includes('declare an event compliant'))) {
        behavior.push('Do not declare the event compliant.');
    }
    if (Array.from(actionSet).some(action => action.includes('declare an event safe'))) {
        behavior.push('Do not declare the event safe.');
    }
    if (normalizedOnTrackRule.includes('launch')) {
        behavior.push('Do not declare the event launched.');
    }
    if (normalizedOnTrackRule.includes('safe to execute')) {
        behavior.push('Do not declare the event safe to execute.');
    }
    if (Array.from(actionSet).some(action => action.includes('declare an event good to proceed'))) {
        behavior.push('Do not declare the event good to proceed.');
    }
    if (Array.from(actionSet).some(action => action.includes('assign tasks'))) {
        behavior.push('Do not assign tasks.');
    }
    if (Array.from(actionSet).some(action => action.includes('update source of truth records'))) {
        behavior.push('Do not update source-of-truth records.');
    }
    if (
        Array.from(actionSet).some(action => action.includes('draft external outreach text')) ||
        Array.from(actionSet).some(action => action.includes('send outreach'))
    ) {
        behavior.push('Do not draft or send external outreach.');
    }
    if (
        Array.from(actionSet).some(
            action =>
                action.includes('imply that cloud city has approved') &&
                action.includes('committed') &&
                action.includes('paid') &&
                action.includes('updated') &&
                action.includes('proceeded')
        )
    ) {
        behavior.push('Do not claim: I scheduled, I sent, I updated, I paid, or I committed.');
        behavior.push('Do not claim equivalent autonomous execution language.');
    }
    if (
        Array.from(actionSet).some(
            action =>
                action.includes('compliance') &&
                action.includes('accessibility') &&
                action.includes('safety') &&
                action.includes('budget') &&
                action.includes('decisions')
        )
    ) {
        behavior.push('Do not make compliance, accessibility, safety, or budget decisions.');
    }
    if (Array.from(conflictRuleSet).some(rule => rule.includes('do not decide which source wins'))) {
        behavior.push('Do not decide which source wins.');
    }

    return behavior;
};

const buildEventReadinessSpecAuthority = (
    input: unknown
): { authority?: EventReadinessSpecAuthority; errors: string[] } => {
    const spec = asRecord(input);
    const agent = asRecord(spec?.agent);
    const operatingMode = asRecord(spec?.operating_mode);
    const sourceHierarchy = asRecord(spec?.source_hierarchy);
    const readinessLabelPolicy = asRecord(spec?.readiness_label_policy);
    const outputContract = asRecord(spec?.output_contract);
    const onTrackFixtureRule = asRecord(spec?.on_track_with_review_needed_fixture_rule);
    const evaluationTests = Array.isArray(spec?.evaluation_tests) ? spec.evaluation_tests : undefined;

    const canonicalSourceLabels = readStringArray(sourceHierarchy, 'canonical_source_labels');
    const approvalGateIds = readStringArray(spec, 'approval_gate_ids');
    const allowedReadinessLabels = readStringArray(readinessLabelPolicy, 'allowed_labels');
    const requiredCoreFields = readStringArray(outputContract, 'core_required_fields');
    const requiredDomainCheckSections = readStringArray(outputContract, 'required_domain_check_sections');
    const prohibitedActions = readStringArray(spec, 'prohibited_actions');
    const conflictRules = readStringArray(sourceHierarchy, 'conflict_rules') || [];
    const evaluationTestIds =
        evaluationTests && evaluationTests.every(test => readString(asRecord(test), 'id'))
            ? evaluationTests.map(test => readString(asRecord(test), 'id') as string)
            : undefined;

    const errors = [
        !readString(agent, 'slug') ? 'spec.agent.slug missing' : '',
        !canonicalSourceLabels ? 'spec.source_hierarchy.canonical_source_labels missing' : '',
        !approvalGateIds ? 'spec.approval_gate_ids missing' : '',
        !allowedReadinessLabels ? 'spec.readiness_label_policy.allowed_labels missing' : '',
        !requiredCoreFields ? 'spec.output_contract.core_required_fields missing' : '',
        !requiredDomainCheckSections ? 'spec.output_contract.required_domain_check_sections missing' : '',
        !prohibitedActions ? 'spec.prohibited_actions missing' : '',
        !evaluationTestIds ? 'spec.evaluation_tests ids missing' : ''
    ].filter(Boolean);

    if (errors.length > 0) {
        return { errors };
    }

    return {
        authority: {
            agentSlug: readString(agent, 'slug') as string,
            implementationStage: readString(agent, 'implementation_stage'),
            draftOnly: readBoolean(operatingMode, 'draft_only'),
            humanReviewed: readBoolean(operatingMode, 'human_reviewed'),
            approvalGated: readBoolean(operatingMode, 'approval_gated'),
            externalExecutionAllowed: readBoolean(operatingMode, 'external_execution_allowed'),
            autonomousToolUseAllowed: readBoolean(operatingMode, 'autonomous_tool_use_allowed'),
            productionIntegrationAllowed: readBoolean(operatingMode, 'production_integration_allowed'),
            canonicalSourceLabels: canonicalSourceLabels as string[],
            approvalGateIds: approvalGateIds as string[],
            allowedReadinessLabels: allowedReadinessLabels as string[],
            requiredCoreFields: requiredCoreFields as string[],
            requiredDomainCheckSections: requiredDomainCheckSections as string[],
            evaluationTestIds: evaluationTestIds as string[],
            allowedProhibitedOutputBehavior: buildEventReadinessProhibitedOutputBehavior({
                prohibitedActions: prohibitedActions as string[],
                conflictRules,
                onTrackRule: readString(onTrackFixtureRule, 'rule')
            })
        },
        errors: []
    };
};

const seededIssueIds = (fixture: EventReadinessFixture) => fixture.seeded_issues.map(issue => issue.id);

const sourceMaterialLabels = (fixture: EventReadinessFixture) => Object.keys(fixture.source_materials);

const eventReadinessCanonicalSourceLabels = (
    evalCase: EvalSuiteCase,
    fixtureRequirements: ReturnType<typeof getEventReadinessFixtureRequirements>
) => (evalCase.canonical_source_labels.length > 0 ? evalCase.canonical_source_labels : fixtureRequirements.canonicalSourceLabels);

const eventReadinessRequiredSourceMaterialLabels = (evalCase: EvalSuiteCase) =>
    evalCase.required_source_material_labels.length > 0
        ? evalCase.required_source_material_labels
        : evalCase.required_source_labels;

const makeExactValueCheck = (label: string, actualValue: string, expectedValue?: string): EvalChecklistItem => {
    const passed = !expectedValue || normalize(actualValue) === normalize(expectedValue);

    return {
        label,
        passed,
        details: passed ? 'PASS' : `expected: ${expectedValue}; actual: ${actualValue}`
    };
};

const loadValidSpec = (specPath: string): AgentSpec => {
    const specReport = validateAgentSpecFile(specPath);

    if (!specReport.spec || !specReport.schemaPassed || !specReport.policyReport?.passed) {
        throw new Error(`Spec must pass validation before eval: ${specReport.errors.join('; ')}`);
    }

    return specReport.spec;
};

const loadValidFixture = (fixturePath: string): VenueCandidateFixture => {
    const fixtureReport = validateVenueCandidateFixtureFile(fixturePath);

    if (!fixtureReport.fixture || !fixtureReport.schemaPassed) {
        throw new Error(`Fixture must pass validation before eval: ${fixtureReport.errors.join('; ')}`);
    }

    return fixtureReport.fixture;
};

const loadValidEventReadinessFixture = (fixturePath: string): EventReadinessFixture => {
    const fixtureReport = validateEventReadinessFixtureFile(fixturePath);

    if (fixtureReport.fixtureType === 'venue_candidate') {
        throw new Error(`Fixture must be event_readiness for this eval suite: ${fixturePath}`);
    }

    if (!fixtureReport.fixture || !fixtureReport.schemaPassed) {
        throw new Error(`Fixture must pass validation before eval: ${fixtureReport.errors.join('; ')}`);
    }

    return fixtureReport.fixture;
};

export const validateEvalSuite = (input: unknown, suitePath = 'in-memory'): EvalSuiteValidationReport => {
    try {
        const suite = evalSuiteSchema.parse(input);
        const checks: EvalSuiteValidationCheck[] = [];
        const fixtureType = getSuiteFixtureType(suite.eval_suite);
        const isEventReadiness = isEventReadinessSuite(suite.eval_suite);
        const specPath = suite.eval_suite.spec_path;
        const hasSpecPath = Boolean(specPath);
        checks.push(
            makeValidationCheck(
                'spec_path_present',
                'Spec path present',
                hasSpecPath,
                hasSpecPath ? specPath || '<unknown>' : 'missing spec_path'
            )
        );

        let specValid = false;
        let eventReadinessSpecAuthority: EventReadinessSpecAuthority | undefined;

        if (isEventReadiness && specPath) {
            checks.push(
                makeValidationCheck(
                    'event_readiness_spec_path_bound',
                    'Event Readiness suite is bound to the authoritative spec path',
                    specPath === eventReadinessAuthoritativeSpecPath,
                    specPath === eventReadinessAuthoritativeSpecPath
                        ? specPath
                        : `expected: ${eventReadinessAuthoritativeSpecPath}; actual: ${specPath}`
                )
            );
        }

        if (specPath) {
            const specExists = fs.existsSync(path.resolve(process.cwd(), specPath));

            checks.push(
                makeValidationCheck('spec_exists', 'Spec file exists', specExists, specExists ? specPath : `missing file: ${specPath}`)
            );

            if (specExists) {
                const specReport = validateAgentSpecFile(specPath);
                specValid = specReport.schemaPassed && Boolean(specReport.policyReport?.passed);

                checks.push(
                    makeValidationCheck(
                        'spec_validates',
                        'Spec validates',
                        specValid,
                        specValid ? 'schema and policy pass' : specReport.errors.join('; ')
                    )
                );

                if (isEventReadiness && specValid) {
                    const authorityReport = buildEventReadinessSpecAuthority(loadYamlFile(specPath));
                    eventReadinessSpecAuthority = authorityReport.authority;

                    checks.push(
                        makeValidationCheck(
                            'event_readiness_spec_contract_fields_present',
                            'Event Readiness spec exposes required contract fields for eval binding',
                            authorityReport.errors.length === 0,
                            authorityReport.errors.length === 0 ? 'PASS' : authorityReport.errors.join('; ')
                        )
                    );

                    if (eventReadinessSpecAuthority) {
                        checks.push(
                            makeValidationCheck(
                                'event_readiness_spec_identity',
                                'Event Readiness suite references the Event Readiness spec',
                                eventReadinessSpecAuthority.agentSlug === 'event_readiness',
                                eventReadinessSpecAuthority.agentSlug === 'event_readiness'
                                    ? 'agent.slug: event_readiness'
                                    : `agent.slug: ${eventReadinessSpecAuthority.agentSlug}`
                            )
                        );
                        checks.push(
                            makeValidationCheck(
                                'event_readiness_posture_preserved',
                                'Event Readiness spec preserves draft-only, human-review, approval-gated, non-operational posture',
                                eventReadinessSpecAuthority.implementationStage === 'draft_only_manual_mvp' &&
                                    eventReadinessSpecAuthority.draftOnly === true &&
                                    eventReadinessSpecAuthority.humanReviewed === true &&
                                    eventReadinessSpecAuthority.approvalGated === true &&
                                    eventReadinessSpecAuthority.externalExecutionAllowed === false &&
                                    eventReadinessSpecAuthority.autonomousToolUseAllowed === false &&
                                    eventReadinessSpecAuthority.productionIntegrationAllowed === false,
                                [
                                    `implementation_stage: ${eventReadinessSpecAuthority.implementationStage || '<missing>'}`,
                                    `draft_only: ${String(eventReadinessSpecAuthority.draftOnly)}`,
                                    `human_reviewed: ${String(eventReadinessSpecAuthority.humanReviewed)}`,
                                    `approval_gated: ${String(eventReadinessSpecAuthority.approvalGated)}`,
                                    `external_execution_allowed: ${String(eventReadinessSpecAuthority.externalExecutionAllowed)}`,
                                    `autonomous_tool_use_allowed: ${String(eventReadinessSpecAuthority.autonomousToolUseAllowed)}`,
                                    `production_integration_allowed: ${String(eventReadinessSpecAuthority.productionIntegrationAllowed)}`
                                ].join('; ')
                            )
                        );
                    }
                }
            }
        }

        if (fixtureType !== 'venue_candidate' && fixtureType !== 'event_readiness') {
            checks.push(
                makeValidationCheck(
                    'fixture_type_supported',
                    'Fixture type supported',
                    false,
                    `unknown fixture_type: ${fixtureType}`
                )
            );
        }

        for (const evalCase of suite.eval_suite.cases) {
            const fixtureExists = fs.existsSync(path.resolve(process.cwd(), evalCase.fixture_path));

            checks.push(
                makeValidationCheck(
                    `${evalCase.id}.fixture_exists`,
                    'Fixture file exists',
                    fixtureExists,
                    fixtureExists ? evalCase.fixture_path : `missing file: ${evalCase.fixture_path}`
                )
            );

            if (!fixtureExists) {
                continue;
            }

            if (isEventReadiness) {
                const fixtureReport = validateEventReadinessFixtureFile(evalCase.fixture_path);
                const fixtureTypeMatches = fixtureReport.fixtureType === 'event_readiness';

                checks.push(
                    makeValidationCheck(
                        `${evalCase.id}.fixture_validates`,
                        'Fixture validates',
                        fixtureReport.schemaPassed && fixtureTypeMatches,
                        fixtureReport.schemaPassed ? 'schema passes' : fixtureReport.errors.join('; ')
                    )
                );

                if (fixtureReport.schemaPassed || fixtureReport.fixtureType === 'venue_candidate') {
                    checks.push(
                        makeValidationCheck(
                            `${evalCase.id}.fixture_type_matches`,
                            'Fixture type matches suite',
                            fixtureTypeMatches,
                            fixtureTypeMatches ? 'event_readiness' : `actual: ${fixtureReport.fixtureType || 'unknown'}`
                        )
                    );

                    if (fixtureReport.schemaPassed && fixtureTypeMatches && eventReadinessSpecAuthority && fixtureReport.fixture) {
                        const fixture = fixtureReport.fixture;
                        const expectedDomainSections = fixture.dry_bar_out_of_scope
                            ? eventReadinessSpecAuthority.requiredDomainCheckSections.filter(
                                  section => normalize(section) !== normalize('dry_bar_readiness_notes')
                              )
                            : eventReadinessSpecAuthority.requiredDomainCheckSections;

                        checks.push(
                            makeExactValuesValidationCheck(
                                `${evalCase.id}.spec_core_fields_align`,
                                'Required core fields align with Event Readiness spec',
                                evalCase.required_core_fields,
                                eventReadinessSpecAuthority.requiredCoreFields
                            )
                        );
                        checks.push(
                            makeExactValuesValidationCheck(
                                `${evalCase.id}.spec_domain_sections_align`,
                                'Required domain-check sections align with Event Readiness spec',
                                evalCase.required_domain_check_sections,
                                expectedDomainSections
                            )
                        );
                        checks.push(
                            makeExactValuesValidationCheck(
                                `${evalCase.id}.spec_source_labels_align`,
                                'Canonical source labels align with Event Readiness spec',
                                evalCase.canonical_source_labels,
                                eventReadinessSpecAuthority.canonicalSourceLabels
                            )
                        );
                        checks.push(
                            makeExactValuesValidationCheck(
                                `${evalCase.id}.spec_approval_gates_align`,
                                'Required approval gates align with Event Readiness spec',
                                evalCase.required_approval_gates,
                                eventReadinessSpecAuthority.approvalGateIds
                            )
                        );
                        checks.push(
                            makeValidationCheck(
                                `${evalCase.id}.spec_expected_readiness_label_allowed`,
                                'Expected readiness label is allowed by Event Readiness spec',
                                Boolean(evalCase.expected_readiness_label) &&
                                    eventReadinessSpecAuthority.allowedReadinessLabels.some(
                                        label => normalize(label) === normalize(evalCase.expected_readiness_label as string)
                                    ),
                                evalCase.expected_readiness_label
                                    ? `expected_readiness_label: ${evalCase.expected_readiness_label}`
                                    : 'missing expected_readiness_label'
                            )
                        );
                        checks.push(
                            makeSubsetValuesValidationCheck(
                                `${evalCase.id}.spec_evaluation_tests_declared`,
                                'Required evaluation tests are declared by Event Readiness spec',
                                evalCase.required_evaluation_tests,
                                eventReadinessSpecAuthority.evaluationTestIds
                            )
                        );
                        checks.push(
                            makeSubsetValuesValidationCheck(
                                `${evalCase.id}.spec_prohibited_output_behavior_allowed`,
                                'Required prohibited output behavior is backed by Event Readiness spec authority',
                                evalCase.required_prohibited_output_behavior,
                                eventReadinessSpecAuthority.allowedProhibitedOutputBehavior
                            )
                        );
                    }
                }

                continue;
            }

            const fixtureReport = validateVenueCandidateFixtureFile(evalCase.fixture_path);

            checks.push(
                makeValidationCheck(
                    `${evalCase.id}.fixture_validates`,
                    'Fixture validates',
                    fixtureReport.schemaPassed,
                    fixtureReport.schemaPassed ? 'schema passes' : fixtureReport.errors.join('; ')
                )
            );
        }

        return {
            suitePath,
            schemaPassed: true,
            suite,
            checks,
            errors: checks.filter(check => !check.passed).map(check => `${check.id}: ${check.label}: ${check.details}`)
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                suitePath,
                schemaPassed: false,
                checks: [],
                errors: error.issues.map(issue => `${issue.path.join('.') || 'eval_suite'}: ${issue.message}`)
            };
        }

        return {
            suitePath,
            schemaPassed: false,
            checks: [],
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
};

export const validateEvalSuiteFile = (suitePath: string) => {
    return validateEvalSuite(loadYamlFile(suitePath), suitePath);
};

export const runEvalSuite = (input: unknown, suitePath = 'in-memory'): EvalRunReport => {
    const validation = validateEvalSuite(input, suitePath);

    if (!validation.suite || !validation.schemaPassed || validation.checks.some(check => !check.passed)) {
        throw new Error(`Eval suite must pass validation before run: ${validation.errors.join('; ')}`);
    }

    const suite = validation.suite.eval_suite;
    const isEventReadiness = isEventReadinessSuite(suite);

    if (isEventReadiness) {
        const cases = suite.cases.map(evalCase => {
            const fixture = loadValidEventReadinessFixture(evalCase.fixture_path);
            const fixtureRequirements = getEventReadinessFixtureRequirements(
                fixture.dry_bar_out_of_scope,
                fixture.fixture_scenario
            );
            const canonicalSourceLabels = eventReadinessCanonicalSourceLabels(evalCase, fixtureRequirements);
            const requiredSourceMaterialLabels = eventReadinessRequiredSourceMaterialLabels(evalCase);
            const checks = [
                makeExactValueCheck(
                    'Expected readiness label',
                    fixture.expected_readiness_label,
                    evalCase.expected_readiness_label
                ),
                makeChecklistItem(
                    'Required core fields',
                    fixture.required_core_fields,
                    evalCase.required_core_fields
                ),
                makeChecklistItem(
                    'Required domain-check sections',
                    fixture.required_domain_check_sections,
                    evalCase.required_domain_check_sections
                ),
                makeChecklistItem(
                    'Canonical source labels',
                    fixture.canonical_source_labels,
                    canonicalSourceLabels
                ),
                makeAllowedValuesCheck(
                    'Canonical source labels valid',
                    fixture.canonical_source_labels,
                    canonicalSourceLabels
                ),
                makeChecklistItem(
                    'Source materials',
                    sourceMaterialLabels(fixture),
                    requiredSourceMaterialLabels
                ),
                makeAllowedValuesCheck(
                    'Source material labels valid',
                    sourceMaterialLabels(fixture),
                    canonicalSourceLabels
                ),
                makeChecklistItem('Seeded issues', seededIssueIds(fixture), evalCase.required_seeded_issues),
                makeChecklistItem(
                    'Approval gates',
                    fixture.required_approval_gates,
                    evalCase.required_approval_gates
                ),
                makeChecklistItem(
                    'Evaluation tests',
                    fixture.required_evaluation_tests,
                    evalCase.required_evaluation_tests
                ),
                makeChecklistItem(
                    'Prohibited output behavior',
                    fixture.prohibited_output_behavior,
                    evalCase.required_prohibited_output_behavior
                )
            ];

            return {
                caseId: evalCase.id,
                fixturePath: evalCase.fixture_path,
                candidateName: fixture.event_name,
                boundedReviewClassification: fixture.expected_readiness_label,
                outcome: caseOutcome(checks),
                checks
            };
        });

        return {
            suitePath,
            suiteId: suite.id,
            suiteName: suite.name,
            specPath: suite.spec_path || '<unknown>',
            outcome: suiteOutcome(cases),
            cases
        };
    }

    if (!suite.spec_path) {
        throw new Error('Spec path is required for venue/vendor eval suites.');
    }

    const spec = loadValidSpec(suite.spec_path);
    const specEvalTests = spec.evaluation_tests.map(test => test.id);

    const cases = suite.cases.map(evalCase => {
        const fixture = loadValidFixture(evalCase.fixture_path);
        const checks = [
            makeChecklistItem(
                'Required output fields',
                spec.required_output_fields,
                combineRequirements(fixture.required_output_fields, evalCase.required_output_fields)
            ),
            makeChecklistItem(
                'Venue fit criteria',
                spec.venue_fit_criteria || [],
                combineRequirements(fixture.required_venue_fit_criteria, evalCase.required_venue_fit_criteria)
            ),
            makeChecklistItem(
                'Approval gates',
                spec.approval_gates,
                combineRequirements(fixture.required_approval_gates, evalCase.required_approval_gates)
            ),
            makeChecklistItem(
                'Evaluation tests',
                specEvalTests,
                combineRequirements(fixture.required_evaluation_tests, evalCase.required_evaluation_tests)
            )
        ];

        return {
            caseId: evalCase.id,
            fixturePath: evalCase.fixture_path,
            candidateName: fixture.candidate_name,
            outcome: caseOutcome(checks),
            checks
        };
    });

    return {
        suitePath,
        suiteId: suite.id,
        suiteName: suite.name,
        specPath: suite.spec_path,
        outcome: suiteOutcome(cases),
        cases
    };
};

export const runEvalSuiteFile = (suitePath: string) => {
    return runEvalSuite(loadYamlFile(suitePath), suitePath);
};

export const formatEvalSuiteValidationReport = (report: EvalSuiteValidationReport) => {
    const checksPassed = report.checks.every(check => check.passed);
    const resultPassed = report.schemaPassed && checksPassed;
    const suite = report.suite?.eval_suite;
    const lines = [
        'Agent Builder Eval Suite Validation Report',
        '',
        `Suite: ${suite ? `${suite.name} v${suite.version}` : report.suitePath}`,
        `Spec: ${suite?.spec_path || '<unknown>'}`,
        `Cases: ${suite?.cases.length ?? 0}`,
        `Schema validation: ${report.schemaPassed ? 'PASS' : 'FAIL'}`,
        `Suite checks: ${checksPassed ? 'PASS' : 'FAIL'}`
    ];

    if (report.checks.length > 0) {
        lines.push('', 'Checks:');
        for (const check of report.checks) {
            lines.push(`- ${check.passed ? 'PASS' : 'FAIL'} ${check.id}: ${check.label} (${check.details})`);
        }
    }

    if (report.errors.length > 0) {
        lines.push('', 'Failures:');
        for (const error of report.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', `Result: ${resultPassed ? 'PASS' : 'FAIL'}`);

    return lines.join('\n');
};

export const formatEvalRunReport = (report: EvalRunReport) => {
    const lines = [
        'Agent Builder Eval Run Report',
        '',
        `Suite: ${report.suiteName}`,
        `Spec: ${report.specPath}`,
        '',
        'Cases:'
    ];

    for (const evalCase of report.cases) {
        lines.push(
            `- Contract conformance: ${evalCase.outcome} ${evalCase.caseId}: ${evalCase.candidateName || evalCase.fixturePath}`
        );
        if (evalCase.boundedReviewClassification) {
            lines.push(`  - Bounded review classification: ${evalCase.boundedReviewClassification}`);
        }
        for (const check of evalCase.checks) {
            lines.push(`  - ${check.passed ? 'PASS' : 'FAIL'} ${check.label}: ${check.details}`);
        }
    }

    lines.push('', `Suite contract conformance: ${report.outcome}`);

    return lines.join('\n');
};
