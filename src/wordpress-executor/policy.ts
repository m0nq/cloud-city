import {
    FIXED_TAXONOMY,
    REQUIRED_IDENTITY_CAPABILITIES,
    REQUIRED_ACF_FIELDS,
    type AcfValues,
    type CanonicalPost,
    type CreateMarketingDraftInput,
    type ExpectedIdentityPolicy,
    type MarketingDraftPatch,
    type OperationKind,
    type RemoteUser,
    type TrashMarketingDraftInput,
    type UpdateMarketingDraftInput
} from './types';

export class PolicyViolation extends Error {
    constructor() {
        super('WordPress executor policy rejected the request.');
        this.name = 'PolicyViolation';
    }
}

export class CanonicalReadbackViolation extends Error {
    constructor() {
        super('Canonical WordPress readback was incomplete or unsafe to use.');
        this.name = 'CanonicalReadbackViolation';
    }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function requirePlainObject(value: unknown): asserts value is Record<string, unknown> {
    if (!isPlainObject(value)) {
        throw new PolicyViolation();
    }
}

function requireAllowedKeys(value: Record<string, unknown>, allowed: readonly string[]): void {
    const allowedSet = new Set(allowed);
    if (Object.keys(value).some(key => !allowedSet.has(key))) {
        throw new PolicyViolation();
    }
}

function requireNonEmptyString(value: unknown): asserts value is string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new PolicyViolation();
    }
}

function requirePostId(value: unknown): asserts value is number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
        throw new PolicyViolation();
    }
}

function requireOperationId(value: unknown): asserts value is string {
    if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value)) {
        throw new PolicyViolation();
    }
}

function requireEventDateTime(value: unknown): asserts value is string {
    requireNonEmptyString(value);
    const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value);
    if (!match) {
        throw new PolicyViolation();
    }
    const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const hour = Number(hourText);
    const minute = Number(minuteText);
    const second = Number(secondText);
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (
        year < 1 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > daysInMonth[month - 1] ||
        hour > 23 ||
        minute > 59 ||
        second > 59
    ) {
        throw new PolicyViolation();
    }
}

function requireHttpsUrl(value: unknown): asserts value is string {
    requireNonEmptyString(value);
    try {
        if (new URL(value).protocol !== 'https:') {
            throw new PolicyViolation();
        }
    } catch {
        throw new PolicyViolation();
    }
}

export function validateCreateInput(input: unknown): CreateMarketingDraftInput {
    requirePlainObject(input);
    requireAllowedKeys(input, ['operationId', 'title', 'content', ...REQUIRED_ACF_FIELDS]);
    requireOperationId(input.operationId);
    requireNonEmptyString(input.title);
    requireNonEmptyString(input.content);
    requireEventDateTime(input.event_datetime);
    requireNonEmptyString(input.address);
    requireHttpsUrl(input.ticket_link);

    return {
        operationId: input.operationId,
        title: input.title,
        content: input.content,
        event_datetime: input.event_datetime,
        address: input.address,
        ticket_link: input.ticket_link
    };
}

export function validateUpdateInput(input: unknown): UpdateMarketingDraftInput {
    requirePlainObject(input);
    requireAllowedKeys(input, ['operationId', 'postId', 'expectedModifiedGmt', 'patch']);
    requireOperationId(input.operationId);
    requirePostId(input.postId);
    requireNonEmptyString(input.expectedModifiedGmt);
    requirePlainObject(input.patch);
    requireAllowedKeys(input.patch, ['title', 'content', ...REQUIRED_ACF_FIELDS]);

    const patch: MarketingDraftPatch = {};
    if ('title' in input.patch) {
        requireNonEmptyString(input.patch.title);
        patch.title = input.patch.title;
    }
    if ('content' in input.patch) {
        requireNonEmptyString(input.patch.content);
        patch.content = input.patch.content;
    }
    if ('event_datetime' in input.patch) {
        requireEventDateTime(input.patch.event_datetime);
        patch.event_datetime = input.patch.event_datetime;
    }
    if ('address' in input.patch) {
        requireNonEmptyString(input.patch.address);
        patch.address = input.patch.address;
    }
    if ('ticket_link' in input.patch) {
        requireHttpsUrl(input.patch.ticket_link);
        patch.ticket_link = input.patch.ticket_link;
    }
    if (Object.keys(patch).length === 0) {
        throw new PolicyViolation();
    }

    return {
        operationId: input.operationId,
        postId: input.postId,
        expectedModifiedGmt: input.expectedModifiedGmt,
        patch
    };
}

export function validateTrashInput(input: unknown): TrashMarketingDraftInput {
    requirePlainObject(input);
    requireAllowedKeys(input, ['operationId', 'postId', 'expectedModifiedGmt']);
    requireOperationId(input.operationId);
    requirePostId(input.postId);
    requireNonEmptyString(input.expectedModifiedGmt);

    return {
        operationId: input.operationId,
        postId: input.postId,
        expectedModifiedGmt: input.expectedModifiedGmt
    };
}

export function assertEligibleOwnedDraft(post: CanonicalPost, machineUserId: number, _operation: OperationKind): void {
    if (
        post.authorId !== machineUserId ||
        post.status !== 'draft' ||
        JSON.stringify(post.categories) !== JSON.stringify([FIXED_TAXONOMY.categoryId]) ||
        JSON.stringify(post.tags) !== JSON.stringify([FIXED_TAXONOMY.tagId])
    ) {
        throw new PolicyViolation();
    }
}

export function assertApprovedRemoteUser(user: RemoteUser, policy: ExpectedIdentityPolicy): void {
    if (
        !isPlainObject(user) ||
        !Number.isInteger(user.id) ||
        user.id <= 0 ||
        !Array.isArray(user.roles) ||
        user.roles.some(role => typeof role !== 'string') ||
        !isPlainObject(user.capabilities) ||
        Object.values(user.capabilities).some(value => typeof value !== 'boolean') ||
        !isPlainObject(user.extraCapabilities) ||
        Object.values(user.extraCapabilities).some(value => typeof value !== 'boolean')
    ) {
        throw new CanonicalReadbackViolation();
    }

    if (
        (policy.expectedUserId !== undefined && user.id !== policy.expectedUserId) ||
        user.roles.length !== 1 ||
        user.roles[0] !== policy.approvedRole ||
        REQUIRED_IDENTITY_CAPABILITIES.some(capability => user.capabilities[capability] !== true)
    ) {
        throw new PolicyViolation();
    }

    const prohibited = new Set(policy.prohibitedCapabilities);
    if (
        Object.entries(user.capabilities).some(([capability, enabled]) => enabled && prohibited.has(capability)) ||
        Object.entries(user.extraCapabilities).some(([capability, enabled]) => enabled && prohibited.has(capability))
    ) {
        throw new PolicyViolation();
    }
}

export function assertCompleteAcf(acf: AcfValues): void {
    if (!isPlainObject(acf)) {
        throw new CanonicalReadbackViolation();
    }
    for (const field of REQUIRED_ACF_FIELDS) {
        if (typeof acf[field] !== 'string' || acf[field].trim() === '') {
            throw new CanonicalReadbackViolation();
        }
    }
}

export function assertCompleteCanonicalPost(post: CanonicalPost, expectedPostId?: number): void {
    const validStatuses = new Set(['draft', 'pending', 'publish', 'future', 'private', 'trash']);
    if (
        !isPlainObject(post) ||
        !Number.isInteger(post.id) ||
        (expectedPostId !== undefined && post.id !== expectedPostId) ||
        typeof post.slug !== 'string' ||
        post.slug.trim() === '' ||
        !validStatuses.has(post.status) ||
        !Number.isInteger(post.authorId) ||
        typeof post.modifiedGmt !== 'string' ||
        post.modifiedGmt.trim() === '' ||
        typeof post.title !== 'string' ||
        typeof post.content !== 'string' ||
        !Array.isArray(post.categories) ||
        !Array.isArray(post.tags) ||
        post.categories.some(categoryId => !Number.isInteger(categoryId)) ||
        post.tags.some(tagId => !Number.isInteger(tagId))
    ) {
        throw new CanonicalReadbackViolation();
    }
    assertCompleteAcf(post.acf);
}

export function acfValuesFromCreateInput(input: CreateMarketingDraftInput): AcfValues {
    return {
        event_datetime: input.event_datetime,
        address: input.address,
        ticket_link: input.ticket_link
    };
}

export function patchMatchesPost(post: CanonicalPost, patch: MarketingDraftPatch): boolean {
    if ('title' in patch && post.title !== patch.title) return false;
    if ('content' in patch && post.content !== patch.content) return false;
    if ('event_datetime' in patch && post.acf.event_datetime !== patch.event_datetime) {
        return false;
    }
    if ('address' in patch && post.acf.address !== patch.address) return false;
    if ('ticket_link' in patch && post.acf.ticket_link !== patch.ticket_link) {
        return false;
    }
    return true;
}

export function nonPatchedStateMatches(
    before: CanonicalPost,
    after: CanonicalPost,
    patch: MarketingDraftPatch
): boolean {
    if (before.id !== after.id || before.slug !== after.slug) return false;
    if (before.status !== after.status || before.authorId !== after.authorId) return false;
    if (!('title' in patch) && before.title !== after.title) return false;
    if (!('content' in patch) && before.content !== after.content) return false;
    if (!('event_datetime' in patch) && before.acf.event_datetime !== after.acf.event_datetime) {
        return false;
    }
    if (!('address' in patch) && before.acf.address !== after.acf.address) return false;
    if (!('ticket_link' in patch) && before.acf.ticket_link !== after.acf.ticket_link) {
        return false;
    }
    if (JSON.stringify(before.categories) !== JSON.stringify(after.categories)) return false;
    if (JSON.stringify(before.tags) !== JSON.stringify(after.tags)) return false;
    return true;
}
