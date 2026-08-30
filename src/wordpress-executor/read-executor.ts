import { WordPressDraftCrudExecutor, type WordPressExecutorDependencies } from './executor';
import type { CanonicalPost, ExecutorResult, RemotePostSchema, RemoteUser } from './types';

/**
 * Credentialed read-only surface. Mutation methods are intentionally absent from
 * this class; authentication does not construct or upgrade it into a writer.
 */
export class WordPressReadExecutor {
    #delegate: WordPressDraftCrudExecutor;

    constructor(dependencies: WordPressExecutorDependencies) {
        this.#delegate = new WordPressDraftCrudExecutor(dependencies);
    }

    readMarketingPost(input: unknown): Promise<ExecutorResult<CanonicalPost>> {
        return this.#delegate.readMarketingPost(input);
    }

    readIdentity(input: unknown): Promise<ExecutorResult<RemoteUser>> {
        return this.#delegate.readIdentity(input);
    }

    readPostSchema(input: unknown): Promise<ExecutorResult<RemotePostSchema>> {
        return this.#delegate.readPostSchema(input);
    }
}
