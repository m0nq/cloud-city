import type { FirstSliceReviewerFixture, FirstSliceReviewerInput } from './schema';

export const deriveFirstSliceReviewerEvidencePath = (fixtureId: string) =>
    `docs/agent-builder/review-evidence/${fixtureId}.md`;

export const formatFirstSliceReviewerEvidence = (
    fixture: FirstSliceReviewerFixture,
    input: FirstSliceReviewerInput
) => {
    const reasonLabel = input.classification === 'hold / clarify' ? 'Hold reason' : 'Rationale';

    return [
        `Fixture ID: ${fixture.fixture_id}`,
        `Synthetic planning reference: ${fixture.planning_reference}`,
        `Planning classification: ${input.classification}`,
        `${reasonLabel}: ${input.reason}`,
        'Boundary acknowledgement: acknowledged — planning classification only',
        `Derived repo path: ${deriveFirstSliceReviewerEvidencePath(fixture.fixture_id)}`,
        `Non-approval reminder: ${fixture.non_approval_reminder}`
    ].join('\n');
};
