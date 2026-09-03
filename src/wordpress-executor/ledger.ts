import type { AuditRecord, AuditSink, OperationLedger, OperationLedgerRecord } from './types';

/**
 * Mock-only ledger used by this pre-secret slice. Durable operation/lifecycle persistence is required before
 * production mutation capability can be enabled; this adapter does not survive process restart.
 */
export class MemoryOperationLedger implements OperationLedger {
    private readonly records = new Map<string, OperationLedgerRecord>();

    get(operationId: string): OperationLedgerRecord | undefined {
        return this.records.get(operationId);
    }

    getManagedPost(postId: number, machineUserId: number): OperationLedgerRecord | undefined {
        const record = [...this.records.values()]
            .reverse()
            .find(
                candidate =>
                    candidate.operation === 'createMarketingDraft' &&
                    candidate.machineUserId === machineUserId &&
                    candidate.phase === 'completed' &&
                    candidate.status === 'verified_success' &&
                    candidate.targetPostId === postId &&
                    candidate.managedLifecycle !== undefined
            );
        return record ? { ...record, changedFields: [...record.changedFields] } : undefined;
    }

    setManagedPostLifecycle(
        postId: number,
        machineUserId: number,
        lifecycle: NonNullable<OperationLedgerRecord['managedLifecycle']>
    ): void {
        const record = [...this.records.values()]
            .reverse()
            .find(
                candidate =>
                    candidate.operation === 'createMarketingDraft' &&
                    candidate.machineUserId === machineUserId &&
                    candidate.phase === 'completed' &&
                    candidate.status === 'verified_success' &&
                    candidate.targetPostId === postId
            );
        if (!record) {
            throw new Error('Verified executor-managed post lineage is unavailable.');
        }
        this.records.set(record.operationId, { ...record, managedLifecycle: lifecycle });
    }

    put(record: OperationLedgerRecord): void {
        this.records.set(record.operationId, { ...record });
    }
}

/** Mock-only audit sink; records intentionally contain no response bodies or credentials. */
export class MemoryAuditSink implements AuditSink {
    readonly records: AuditRecord[] = [];

    record(record: AuditRecord): void {
        this.records.push({ ...record, changedFields: [...record.changedFields] });
    }
}
