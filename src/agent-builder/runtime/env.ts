import fs from 'fs';
import path from 'path';

export type RuntimeEnvLoadResult = {
    loadedFiles: string[];
    appliedKeys: string[];
};

const envFilesInPrecedenceOrder = ['.env', '.env.local'];

const parseEnvValue = (value: string) => {
    const trimmed = value.trim();
    const quote = trimmed[0];

    if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
};

const parseEnvFile = (contents: string) => {
    const entries = new Map<string, string>();

    for (const rawLine of contents.split(/\r?\n/)) {
        const line = rawLine.trim();

        if (!line || line.startsWith('#')) {
            continue;
        }

        const normalizedLine = line.startsWith('export ') ? line.slice('export '.length).trim() : line;
        const separatorIndex = normalizedLine.indexOf('=');

        if (separatorIndex <= 0) {
            continue;
        }

        const key = normalizedLine.slice(0, separatorIndex).trim();
        const value = normalizedLine.slice(separatorIndex + 1);

        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
            entries.set(key, parseEnvValue(value));
        }
    }

    return entries;
};

export const loadAgentBuilderRuntimeEnv = ({
    cwd = process.cwd(),
    env = process.env
}: {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
} = {}): RuntimeEnvLoadResult => {
    const fileEntries = new Map<string, string>();
    const loadedFiles: string[] = [];

    for (const envFile of envFilesInPrecedenceOrder) {
        const envPath = path.resolve(cwd, envFile);

        if (!fs.existsSync(envPath)) {
            continue;
        }

        loadedFiles.push(envFile);
        for (const [key, value] of parseEnvFile(fs.readFileSync(envPath, 'utf8'))) {
            fileEntries.set(key, value);
        }
    }

    const appliedKeys: string[] = [];

    for (const [key, value] of fileEntries) {
        if (env[key] === undefined) {
            env[key] = value;
            appliedKeys.push(key);
        }
    }

    return { loadedFiles, appliedKeys };
};
