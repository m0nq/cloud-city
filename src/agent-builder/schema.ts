import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

export const evaluationTestSchema = z
    .object({
        id: nonEmptyString,
        pass_standard: nonEmptyString
    })
    .passthrough();

export const agentSpecSchema = z
    .object({
        agent: z
            .object({
                name: nonEmptyString,
                slug: nonEmptyString,
                version: nonEmptyString,
                status: nonEmptyString,
                business_domain: nonEmptyString,
                owner_hat: nonEmptyString,
                accountable_human_owner: nonEmptyString,
                automation_class: nonEmptyString,
                evaluation_status: nonEmptyString
            })
            .passthrough(),
        purpose: z
            .object({
                summary: nonEmptyString,
                non_goal: nonEmptyString
            })
            .passthrough(),
        operating_mode: z
            .object({
                default_posture: nonEmptyString,
                external_execution_allowed: z.boolean(),
                autonomous_tool_use_allowed: z.boolean(),
                production_integration_allowed: z.boolean()
            })
            .passthrough(),
        scope: z
            .object({
                in_scope: nonEmptyStringArray,
                out_of_scope: nonEmptyStringArray
            })
            .passthrough(),
        source_hierarchy: z
            .object({
                preferred_sources: nonEmptyStringArray
            })
            .passthrough(),
        data_sensitivity: z
            .object({
                default: nonEmptyString,
                restricted_data_allowed: z.boolean()
            })
            .passthrough(),
        allowed_actions: nonEmptyStringArray,
        prohibited_actions: nonEmptyStringArray,
        approval_gates: nonEmptyStringArray,
        required_output_fields: nonEmptyStringArray,
        venue_fit_criteria: nonEmptyStringArray.optional(),
        vendor_fit_criteria: nonEmptyStringArray.optional(),
        ethical_review: z.record(z.string(), z.unknown()).refine(value => Object.keys(value).length > 0, {
            message: 'ethical_review must include at least one review rule'
        }),
        cooperation_review: z.record(z.string(), z.unknown()).refine(value => Object.keys(value).length > 0, {
            message: 'cooperation_review must include at least one review rule'
        }),
        evaluation_tests: z.array(evaluationTestSchema).min(1),
        next_action: nonEmptyString
    })
    .passthrough();

export type AgentSpec = z.infer<typeof agentSpecSchema>;
export type EvaluationTest = z.infer<typeof evaluationTestSchema>;
