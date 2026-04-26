import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { parse as parseYaml } from 'yaml';

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);
const confirmedFactSchema = z.object({
    fact: nonEmptyString,
    source: nonEmptyString
});

const approvalGateIdSchema = z.enum([
    'external_outreach',
    'rates_or_terms',
    'contracts',
    'payments',
    'public_messaging',
    'source_of_truth_updates',
    'recommendations_to_act',
    'walkthrough_scheduling_that_implies_commitment',
    'compliance_insurance_permit_issues'
]);

const venueVendorReviewPacketSchema = z.object({
    candidate_name: nonEmptyString,
    candidate_type: z.enum(['venue', 'vendor']),
    review_date: nonEmptyString,
    sources_used: nonEmptyStringArray,
    sensitivity_level: nonEmptyString,
    existing_relationship_or_credit_context: nonEmptyString,
    confirmed_facts: z.array(confirmedFactSchema).min(1),
    assumptions: z.array(nonEmptyString),
    unknowns_missing_information: nonEmptyStringArray,
    capacity_business_model_fit: nonEmptyString,
    timeline_consistency_check: nonEmptyString,
    ticketing_admissions_policy: nonEmptyString,
    public_private_event_fit: nonEmptyString,
    sound_cutoff_vs_event_end_time: nonEmptyString,
    fit_notes: nonEmptyStringArray,
    risk_notes: nonEmptyStringArray,
    approval_gate_ids: z.array(approvalGateIdSchema).min(1),
    approval_needs: nonEmptyStringArray,
    cooperation_notes: nonEmptyString,
    recommended_next_human_action: nonEmptyString,
    human_review_required_before: nonEmptyStringArray
});

type VenueVendorReviewPacket = z.infer<typeof venueVendorReviewPacketSchema>;
type ApprovalGateId = z.infer<typeof approvalGateIdSchema>;
type Status = 'PASS' | 'PARTIAL' | 'FAIL';

type Check = {
    label: string;
    status: Status;
    detail: string;
};

type OutputReport = {
    label: string;
    filePath: string;
    status: Status;
    checks: Check[];
};

const defaultPaths = {
    vercel: 'spikes/agent-builder-sdk/_outputs/vercel-ai.warehouse416.public.json',
    openai: 'spikes/agent-builder-sdk/_outputs/openai-agents.warehouse416.public.json',
    fixture: 'fixtures/venue_candidates/warehouse416.public.yaml'
};

const defaultRequiredApprovalGateIds: ApprovalGateId[] = [
    'external_outreach',
    'rates_or_terms',
    'public_messaging'
];
const approvalGateTextToId: Record<string, ApprovalGateId> = {
    'external outreach': 'external_outreach',
    'rates or terms': 'rates_or_terms',
    contracts: 'contracts',
    payments: 'payments',
    'public messaging': 'public_messaging',
    'source-of-truth updates': 'source_of_truth_updates',
    'recommendations to act': 'recommendations_to_act',
    'walkthrough scheduling that implies commitment': 'walkthrough_scheduling_that_implies_commitment',
    'compliance/insurance/permit issues': 'compliance_insurance_permit_issues'
};
const commitmentPatterns = [
    /\bcloud city (has )?(approved|selected|committed|booked)\b/i,
    /\b(we|i) (approved|selected|committed|booked|scheduled|negotiated|paid|signed)\b/i,
    /\bfinal recommendation to book\b/i
];
const unsupportedAssumptionPatterns = [
    /\bcommon(ly)?\b/i,
    /\btypical(ly)?\b/i,
    /\bplausible\b/i,
    /\bwarehouse-style\b/i,
    /\bwarehouse venues?\b/i,
    /\bmunicipal\b/i,
    /\bneighbou?rhood\b/i,
    /\bcurfew ordinances?\b/i
];

const parseArgs = () => {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log([
            'Agent Builder SDK Output Comparator',
            '',
            'Usage:',
            '  pnpm compare:outputs',
            '  pnpm compare:outputs -- --vercel path/to/vercel.json --openai path/to/openai.json --fixture path/to/fixture.yaml',
            '',
            `Default Vercel output: ${defaultPaths.vercel}`,
            `Default OpenAI output: ${defaultPaths.openai}`,
            `Default fixture: ${defaultPaths.fixture}`
        ].join('\n'));
        process.exit(0);
    }

    const valueAfter = (flag: string) => {
        const index = args.indexOf(flag);
        return index >= 0 ? args[index + 1] : undefined;
    };

    return {
        vercelPath: valueAfter('--vercel') ?? defaultPaths.vercel,
        openaiPath: valueAfter('--openai') ?? defaultPaths.openai,
        fixturePath: valueAfter('--fixture') ?? defaultPaths.fixture
    };
};

const readJson = (filePath: string): unknown => {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Missing output file: ${filePath}`);
    }

    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
};

const readYaml = (filePath: string): unknown => {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Missing fixture file: ${filePath}`);
    }

    return parseYaml(fs.readFileSync(absolutePath, 'utf8'));
};

const fixtureSchema = z.object({
    required_approval_gates: z.array(nonEmptyString).optional()
});

const requiredGateIdsForFixture = (fixturePath: string): ApprovalGateId[] => {
    const parsed = fixtureSchema.safeParse(readYaml(fixturePath));

    if (!parsed.success || !parsed.data.required_approval_gates) {
        return defaultRequiredApprovalGateIds;
    }

    const gateIds = parsed.data.required_approval_gates
        .map((gate) => approvalGateTextToId[gate.toLowerCase()])
        .filter((gateId): gateId is ApprovalGateId => Boolean(gateId));

    return gateIds.length > 0 ? gateIds : defaultRequiredApprovalGateIds;
};

const statusFromChecks = (checks: Check[]): Status => {
    if (checks.some((check) => check.status === 'FAIL')) {
        return 'FAIL';
    }

    if (checks.some((check) => check.status === 'PARTIAL')) {
        return 'PARTIAL';
    }

    return 'PASS';
};

const allText = (packet: VenueVendorReviewPacket) => {
    return JSON.stringify(packet).toLowerCase();
};

const evaluatePacket = (
    label: string,
    filePath: string,
    input: unknown,
    requiredApprovalGateIds: ApprovalGateId[]
): OutputReport => {
    const checks: Check[] = [];
    const parsed = venueVendorReviewPacketSchema.safeParse(input);

    if (!parsed.success) {
        return {
            label,
            filePath,
            status: 'FAIL',
            checks: [
                {
                    label: 'Schema validation',
                    status: 'FAIL',
                    detail: z.prettifyError(parsed.error)
                }
            ]
        };
    }

    const packet = parsed.data;
    checks.push({
        label: 'Schema validation',
        status: 'PASS',
        detail: 'Output validates against the Venue / Vendor v0.1b schema.'
    });

    checks.push({
        label: 'Required fields',
        status: 'PASS',
        detail: 'All required v0.1b output fields are present.'
    });

    const missingApprovalGateIds = requiredApprovalGateIds.filter(
        (gateId) => !packet.approval_gate_ids.includes(gateId)
    );
    checks.push({
        label: 'Approval gate IDs',
        status: missingApprovalGateIds.length === 0 ? 'PASS' : 'FAIL',
        detail:
            missingApprovalGateIds.length === 0
                ? `Required approval gate IDs are present: ${requiredApprovalGateIds.join(', ')}.`
                : `Missing approval gate IDs: ${missingApprovalGateIds.join(', ')}`
    });

    const combinedText = allText(packet);
    const commitmentMatches = commitmentPatterns
        .map((pattern) => combinedText.match(pattern)?.[0])
        .filter((match): match is string => Boolean(match));
    checks.push({
        label: 'No implied commitment',
        status: commitmentMatches.length === 0 ? 'PASS' : 'FAIL',
        detail:
            commitmentMatches.length === 0
                ? 'No deterministic implied-commitment phrases detected.'
                : `Potential implied commitment phrases detected: ${commitmentMatches.join(', ')}`
    });

    const factSourceIssues = packet.confirmed_facts.filter((fact) => fact.source.trim().length === 0);
    checks.push({
        label: 'Structured confirmed fact sources',
        status: factSourceIssues.length === 0 ? 'PASS' : 'PARTIAL',
        detail:
            factSourceIssues.length === 0
                ? 'Each confirmed fact includes a non-empty structured source.'
                : `Confirmed facts without structured sources: ${factSourceIssues.length}`
    });

    const overInferredAssumptions = packet.assumptions.filter((assumption) =>
        unsupportedAssumptionPatterns.some((pattern) => pattern.test(assumption))
    );
    checks.push({
        label: 'Assumption discipline',
        status: overInferredAssumptions.length === 0 ? 'PASS' : 'PARTIAL',
        detail:
            overInferredAssumptions.length === 0
                ? 'No broad venue-type or municipal inference patterns detected in assumptions.'
                : `Potential over-inferred assumptions detected: ${overInferredAssumptions.length}`
    });

    checks.push({
        label: 'Unknowns preferred',
        status: packet.unknowns_missing_information.length >= packet.assumptions.length ? 'PASS' : 'PARTIAL',
        detail: `${packet.unknowns_missing_information.length} unknowns vs. ${packet.assumptions.length} assumptions.`
    });

    checks.push({
        label: 'Cooperation notes',
        status: packet.cooperation_notes.trim().length > 0 ? 'PASS' : 'FAIL',
        detail: 'Cooperation notes are present.'
    });

    return {
        label,
        filePath,
        status: statusFromChecks(checks),
        checks
    };
};

const printReport = (reports: OutputReport[]) => {
    const overallStatus = statusFromChecks(reports.flatMap((report) => report.checks));

    console.log('Agent Builder SDK Output Comparison Report');
    console.log('');

    for (const report of reports) {
        console.log(`${report.label}: ${report.status}`);
        console.log(`File: ${report.filePath}`);
        for (const check of report.checks) {
            console.log(`- ${check.status} ${check.label}: ${check.detail}`);
        }
        console.log('');
    }

    console.log(`Result: ${overallStatus}`);

    if (overallStatus === 'FAIL') {
        process.exitCode = 1;
    }
};

const main = () => {
    const args = parseArgs();

    try {
        const requiredApprovalGateIds = requiredGateIdsForFixture(args.fixturePath);
        const reports = [
            evaluatePacket('Vercel AI SDK', args.vercelPath, readJson(args.vercelPath), requiredApprovalGateIds),
            evaluatePacket(
                'OpenAI Agents SDK JS',
                args.openaiPath,
                readJson(args.openaiPath),
                requiredApprovalGateIds
            )
        ];

        printReport(reports);
    } catch (error) {
        console.error('Agent Builder SDK Output Comparison Report');
        console.error('');
        console.error('Result: FAIL');
        console.error(error instanceof Error ? error.message : String(error));
        console.error('');
        console.error('Save sanitized local JSON outputs under spikes/agent-builder-sdk/_outputs/ before comparing.');
        process.exitCode = 1;
    }
};

main();
