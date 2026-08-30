export { WordPressDraftCrudExecutor } from './executor';
export { WordPressReadExecutor } from './read-executor';
export { REQUIRED_IDENTITY_CAPABILITIES } from './types';
export type { WordPressExecutorDependencies } from './executor';
export type {
    AuditRecord,
    AuditSink,
    CanonicalPost,
    CreateMarketingDraftInput,
    ExpectedIdentityPolicy,
    ExecutorResult,
    ManagedPostLifecycle,
    MarketingDraftPatch,
    OperationLedger,
    RemotePostSchema,
    RemoteUser,
    ReadMarketingPostInput,
    TrashMarketingDraftInput,
    UpdateMarketingDraftInput
} from './types';
export type { CredentialProvider, WordPressTransport } from './transport';
