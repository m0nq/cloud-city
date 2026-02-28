// scripts/import-luma.ts
import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { Readable } from "stream";

import type { EmailMarketingProvider } from "./email-platform";
import {
    loadEmailPlatformEnvFiles,
    resolveEmailPlatformEnv,
    syncSubscribersSequentially,
    type SubscriberRecord,
} from "./email-platform";
import { createMailerLiteProvider } from "./providers/mailerlite";

export type { SubscriberRecord } from "./email-platform";

export type DryRunSummary = {
    detectedHeaders: string[];
    totalRecords: number;
    optInSubscribers: SubscriberRecord[];
    headerMap: {
        email: string;
        optIn: string;
        name?: string;
    };
};

export type ExecuteImportLumaOptions = {
    argv?: string[];
    env?: NodeJS.ProcessEnv;
    parseFile?: (csvFilePath: string) => Promise<DryRunSummary>;
    createProvider?: (args: { providerName: string; apiKey: string }) => EmailMarketingProvider;
    wait?: (ms: number) => Promise<void>;
    progressWriter?: (chunk: string) => void | boolean;
};

const TRUTHY_VALUES = new Set(["true", "yes", "y", "1"]);
export const IMPORT_LUMA_USAGE =
    "❌ Usage: pnpm ts-node scripts/import-luma.ts <path-to-luma-export.csv>";

const normalizeHeader = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

const findHeader = (headers: string[], candidates: string[]): string | undefined => {
    const normalizedHeaders = new Map(headers.map((header) => [normalizeHeader(header), header]));

    for (const candidate of candidates) {
        const match = normalizedHeaders.get(normalizeHeader(candidate));
        if (match) {
            return match;
        }
    }

    return undefined;
};

const resolveHeaderMap = (headers: string[]) => {
    const email = findHeader(headers, ["Email", "email", "E-mail"]);
    const optIn =
        findHeader(headers, ["Join our newsletter", "Newsletter", "Opt In", "Opt-in"]) ||
        headers.find((header) => /join\s+our\s+newsletter/i.test(header));
    const name = findHeader(headers, ["Name", "name", "Full Name"]);

    if (!email) {
        throw new Error("Missing required header: Email");
    }

    if (!optIn) {
        throw new Error("Missing required header: Join our newsletter");
    }

    return {
        email,
        optIn,
        name,
    };
};

const createEmailMarketingProvider = ({
    providerName,
    apiKey,
}: {
    providerName: string;
    apiKey: string;
}): EmailMarketingProvider => {
    if (providerName === "mailerlite") {
        return createMailerLiteProvider({ apiKey });
    }

    throw new Error(`Unsupported email provider: ${providerName}`);
};

export const resolveImportLumaCliArgs = (argv: string[] = process.argv) => {
    const csvFilePath = argv[2]?.trim();
    const hasExtraArgs = argv.length > 3;

    if (!csvFilePath || hasExtraArgs) {
        throw new Error(IMPORT_LUMA_USAGE);
    }

    return { csvFilePath };
};

export const parseLumaCsvDryRun = async (csvContents: string): Promise<DryRunSummary> => {
    return parseLumaCsvDryRunFromReadable(Readable.from([csvContents]));
};

export const parseLumaCsvDryRunFromReadable = async (input: NodeJS.ReadableStream): Promise<DryRunSummary> => {
    return new Promise((resolve, reject) => {
        let detectedHeaders: string[] = [];
        let headerMap: DryRunSummary["headerMap"] | null = null;
        const optInSubscribers: SubscriberRecord[] = [];
        let totalRecords = 0;

        const parser = parse({
            bom: true,
            columns: (headers: string[]) => {
                detectedHeaders = headers;
                headerMap = resolveHeaderMap(detectedHeaders);
                return headers;
            },
            skip_empty_lines: true,
            trim: true,
        });

        parser.on("data", (row: Record<string, string>) => {
            try {
                if (!headerMap) {
                    detectedHeaders = Object.keys(row);
                    headerMap = resolveHeaderMap(detectedHeaders);
                }

                totalRecords += 1;
                const email = (row[headerMap.email] || "").trim();
                const name = headerMap.name ? (row[headerMap.name] || "").trim() : "";
                const optInValue = (row[headerMap.optIn] || "").trim().toLowerCase();
                const optedIn = TRUTHY_VALUES.has(optInValue);

                if (email && optedIn) {
                    optInSubscribers.push({ name, email });
                }
            } catch (error) {
                parser.destroy(error as Error);
            }
        });

        parser.on("end", () => {
            if (!headerMap) {
                resolve({
                    detectedHeaders: [],
                    totalRecords: 0,
                    optInSubscribers: [],
                    headerMap: {
                        email: "",
                        optIn: "",
                    },
                });
                return;
            }

            resolve({
                detectedHeaders,
                totalRecords,
                optInSubscribers,
                headerMap,
            });
        });

        parser.on("error", (error) => {
            reject(error);
        });

        input.on("error", (error) => {
            reject(error);
        });

        input.pipe(parser);
    });
};

export const parseLumaCsvDryRunFromFile = async (csvFilePath: string) => {
    const resolvedPath = path.resolve(process.cwd(), csvFilePath);

    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File not found at ${resolvedPath}`);
    }

    return parseLumaCsvDryRunFromReadable(fs.createReadStream(resolvedPath));
};

export type PrepareImportLumaResult = {
    csvFilePath: string;
    providerName: string;
    apiKey: string;
    audienceId: string;
    summary: DryRunSummary;
};

export const prepareImportLuma = async ({
    argv = process.argv,
    env = process.env,
    parseFile = parseLumaCsvDryRunFromFile,
}: Pick<ExecuteImportLumaOptions, "argv" | "env" | "parseFile"> = {}): Promise<PrepareImportLumaResult> => {
    const { csvFilePath } = resolveImportLumaCliArgs(argv);
    const { providerName, apiKey, audienceId } = resolveEmailPlatformEnv(env);
    const summary = await parseFile(csvFilePath);

    return {
        csvFilePath,
        providerName,
        apiKey,
        audienceId,
        summary,
    };
};

export const syncPreparedImportLuma = async ({
    prepared,
    createProvider = createEmailMarketingProvider,
    wait,
    progressWriter = (chunk) => process.stdout.write(chunk),
}: Pick<ExecuteImportLumaOptions, "createProvider" | "wait" | "progressWriter"> & {
    prepared: PrepareImportLumaResult;
}) => {
    if (prepared.summary.optInSubscribers.length === 0) {
        return {
            ...prepared,
            syncResult: null,
        };
    }

    const provider = createProvider({
        providerName: prepared.providerName,
        apiKey: prepared.apiKey,
    });

    const syncResult = await syncSubscribersSequentially({
        provider,
        subscribers: prepared.summary.optInSubscribers,
        audienceId: prepared.audienceId,
        wait,
        onProgress: () => {
            progressWriter(".");
        },
    });

    return {
        ...prepared,
        providerName: provider.name,
        syncResult,
    };
};

export const executeImportLuma = async ({
    argv = process.argv,
    env = process.env,
    parseFile = parseLumaCsvDryRunFromFile,
    createProvider = createEmailMarketingProvider,
    wait,
    progressWriter = (chunk) => process.stdout.write(chunk),
}: ExecuteImportLumaOptions = {}) => {
    const prepared = await prepareImportLuma({
        argv,
        env,
        parseFile,
    });

    return syncPreparedImportLuma({
        prepared,
        createProvider,
        wait,
        progressWriter,
    });
};

const runCli = async () => {
    loadEmailPlatformEnvFiles();

    let csvFilePath = "";

    try {
        const result = await prepareImportLuma({
            argv: process.argv,
            env: process.env,
        });
        csvFilePath = result.csvFilePath;
        const resolvedPath = path.resolve(process.cwd(), csvFilePath);

        console.log(`\n🔍 Analyst Check: Initiating import for ${path.basename(resolvedPath)}...\n`);
        console.log("📊 CSV Headers Detected:", result.summary.detectedHeaders);
        console.log(`\n✅ Parsing Complete.`);
        console.log(`📈 Total Records Processed: ${result.summary.totalRecords}`);
        console.log(`📨 Valid Opt-Ins Found: ${result.summary.optInSubscribers.length}`);

        if (result.summary.optInSubscribers.length === 0) {
            console.log("\n🛑 No valid opt-ins found. Exiting.");
            return;
        }

        console.log(`\n🚀 Beginning sequential ${result.providerName} sync for ${result.summary.optInSubscribers.length} subscribers...`);

        const executionResult = await syncPreparedImportLuma({
            prepared: result,
        });

        if (executionResult.syncResult?.failures.length) {
            for (const failure of executionResult.syncResult.failures) {
                console.error(`\n❌ Failed to sync ${failure.email}:`, failure.message);
            }
        }

        console.log("\n\n✅ Sync Complete.");
        console.log(`📊 Success: ${executionResult.syncResult?.successCount || 0}`);
        console.log(`⚠️ Failed: ${executionResult.syncResult?.failCount || 0}`);

        if ((executionResult.syncResult?.failCount || 0) > 0) {
            process.exitCode = 1;
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message === IMPORT_LUMA_USAGE) {
            console.error(message);
            process.exit(1);
        }

        if (csvFilePath) {
            const resolvedPath = path.resolve(process.cwd(), csvFilePath);
            if (!fs.existsSync(resolvedPath)) {
                console.error(`❌ Error: File not found at ${resolvedPath}`);
                process.exit(1);
            }
        }

        console.error("❌ Import Error:", message);
        process.exit(1);
    }
};

const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
const expectedScriptFile = path.resolve(process.cwd(), "scripts/import-luma.ts");

if (executedFile === expectedScriptFile) {
    void runCli();
}
