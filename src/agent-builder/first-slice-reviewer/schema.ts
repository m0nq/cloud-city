import { z } from 'zod';

export const FIRST_SLICE_CLASSIFICATIONS = [
    'later bounded L2 candidate',
    'first implicated CLO-52 lane dependency card',
    'hold / clarify'
] as const;

export const FIRST_SLICE_NON_APPROVAL_REMINDER =
    'Planning classification only; no implementation, release, operational approval, external action, or authority to act.';

export const FIRST_SLICE_FIXTURE_ID_PATTERN = /^SFR-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

const boundedText = (label: string, maximum: number) =>
    z
        .string({ error: `${label} must be text.` })
        .trim()
        .min(1, { error: `${label} is required.` })
        .max(maximum, { error: `${label} must be ${maximum} characters or fewer.` });

export const firstSliceClassificationSchema = z.enum(FIRST_SLICE_CLASSIFICATIONS, {
    error: 'Select one governed planning classification.'
});

const permittedDecisionsSchema = z
    .array(firstSliceClassificationSchema, {
        error: 'Permitted decisions must be the governed planning classifications.'
    })
    .length(FIRST_SLICE_CLASSIFICATIONS.length, {
        error: 'Permitted decisions must contain all three governed planning classifications.'
    })
    .superRefine((decisions, context) => {
        const decisionsSet = new Set(decisions);
        const isExactSet =
            decisionsSet.size === FIRST_SLICE_CLASSIFICATIONS.length &&
            FIRST_SLICE_CLASSIFICATIONS.every(classification => decisionsSet.has(classification));

        if (!isExactSet) {
            context.addIssue({
                code: 'custom',
                message: 'Permitted decisions must contain each governed planning classification exactly once.'
            });
        }
    });

export const firstSliceReviewerFixtureSchema = z
    .object({
        fixture_id: z
            .string({ error: 'Fixture ID must be text.' })
            .regex(FIRST_SLICE_FIXTURE_ID_PATTERN, {
                error: 'Fixture ID must use the approved SFR identifier format.'
            }),
        planning_reference: boundedText('Planning reference', 120),
        workflow_title: boundedText('Workflow title', 120),
        context_category: z.literal('synthetic', {
            error: 'Context category must be synthetic.'
        }),
        planning_purpose: boundedText('Planning purpose', 500),
        reviewer_role: z.literal('human reviewer', {
            error: 'Reviewer role must be human reviewer.'
        }),
        allowed_references: z
            .array(boundedText('Allowed reference', 120), {
                error: 'Allowed references must be a list of labels.'
            })
            .min(1, { error: 'At least one allowed reference is required.' })
            .max(12, { error: 'No more than twelve allowed references are permitted.' }),
        forbidden_uses: z
            .array(boundedText('Forbidden use', 160), {
                error: 'Forbidden uses must be a list of labels.'
            })
            .min(1, { error: 'At least one forbidden use is required.' })
            .max(12, { error: 'No more than twelve forbidden uses are permitted.' }),
        permitted_decisions: permittedDecisionsSchema,
        evidence_guidance: z.literal('repo-first human placement', {
            error: 'Evidence guidance must remain repo-first human placement.'
        }),
        stop_condition: boundedText('Stop condition', 500),
        non_approval_reminder: z.literal(FIRST_SLICE_NON_APPROVAL_REMINDER, {
            error: 'The exact planning-only non-approval reminder is required.'
        })
    })
    .strict();

export const firstSliceReviewerInputSchema = z
    .object({
        classification: firstSliceClassificationSchema,
        reason: boundedText('Reason', 1000),
        boundaryAcknowledged: z.literal(true, {
            error: 'Acknowledge the planning-only boundary.'
        })
    })
    .strict();

export type FirstSliceClassification = z.infer<typeof firstSliceClassificationSchema>;
export type FirstSliceReviewerFixture = z.infer<typeof firstSliceReviewerFixtureSchema>;
export type FirstSliceReviewerInput = z.infer<typeof firstSliceReviewerInputSchema>;
