// scripts/import-luma.ts
import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import MailerLite from "@mailerlite/mailerlite-nodejs";
import * as dotenv from "dotenv";
import { Readable } from "stream";

export type SubscriberRecord = { name: string; email: string };

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

const TRUTHY_VALUES = new Set(["true", "yes", "y", "1"]);
const MAILERLITE_MASTER_GROUP_ID = "125237533318579422";
const MAILERLITE_REQUEST_DELAY_MS = 300;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

const runCli = async () => {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

    const apiKey = process.env.CC_API_KEY;
    if (!apiKey) {
        console.error("❌ System Error: CC_API_KEY is missing from .env.local");
        process.exit(1);
    }

    const mailerlite = new MailerLite({ api_key: apiKey });

    const csvFilePath = process.argv[2];
    if (!csvFilePath) {
        console.error("❌ Usage: pnpm ts-node scripts/import-luma.ts <path-to-luma-export.csv>");
        process.exit(1);
    }

    const resolvedPath = path.resolve(process.cwd(), csvFilePath);
    if (!fs.existsSync(resolvedPath)) {
        console.error(`❌ Error: File not found at ${resolvedPath}`);
        process.exit(1);
    }

    console.log(`\n🔍 Analyst Check: Initiating import for ${path.basename(resolvedPath)}...\n`);

    try {
        const summary = await parseLumaCsvDryRunFromFile(resolvedPath);

        console.log("📊 CSV Headers Detected:", summary.detectedHeaders);
        console.log(`\n✅ Parsing Complete.`);
        console.log(`📈 Total Records Processed: ${summary.totalRecords}`);
        console.log(`📨 Valid Opt-Ins Found: ${summary.optInSubscribers.length}`);

        if (summary.optInSubscribers.length === 0) {
            console.log("\n🛑 No valid opt-ins found. Exiting.");
            return;
        }

        console.log(`\n🚀 Beginning sequential MailerLite sync for ${summary.optInSubscribers.length} subscribers...`);

        let successCount = 0;
        let failCount = 0;

        for (const sub of summary.optInSubscribers) {
            try {
                await mailerlite.subscribers.createOrUpdate({
                    email: sub.email,
                    fields: {
                        name: sub.name,
                    },
                    groups: [MAILERLITE_MASTER_GROUP_ID],
                    status: "unconfirmed",
                });

                successCount += 1;
                process.stdout.write(".");
                await delay(MAILERLITE_REQUEST_DELAY_MS);
            } catch (error: unknown) {
                failCount += 1;
                const message = error instanceof Error ? error.message : String(error);
                console.error(`\n❌ Failed to sync ${sub.email}:`, message);
            }
        }

        console.log("\n\n✅ Sync Complete.");
        console.log(`📊 Success: ${successCount}`);
        console.log(`⚠️ Failed: ${failCount}`);

        if (failCount > 0) {
            process.exitCode = 1;
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("❌ Import Error:", message);
        process.exit(1);
    }
};

const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
const expectedScriptFile = path.resolve(process.cwd(), "scripts/import-luma.ts");

if (executedFile === expectedScriptFile) {
    void runCli();
}
