import type { HeroToneSetting } from '@data-types/types';

export type HeroTone = Exclude<HeroToneSetting, 'auto'>;

const ANALYSIS_SIZE = 48;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_FETCH_TIMEOUT_MS = 5_000;
const HERO_OVERLAY_OPACITY = 0.5;
const DARK_RENDERED_LUMINANCE_THRESHOLD = 0.18;
const TRUSTED_MEDIA_HOSTNAME = 'cirquitree.com';

type ToneDetector = (sourceUrl: string) => Promise<HeroTone>;

const toLinearChannel = (channel: number): number => {
    const normalized = channel / 255;

    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

const getRelativeLuminance = (red: number, green: number, blue: number): number =>
    0.2126 * toLinearChannel(red) + 0.7152 * toLinearChannel(green) + 0.0722 * toLinearChannel(blue);

/**
 * Classifies the final hero context after the existing black scrim is applied.
 * This is a presentation heuristic, not a complete contrast audit.
 */
export const classifyHeroTone = (pixels: Uint8Array, channels = 4): HeroTone => {
    if (channels < 3 || pixels.length < channels) {
        return 'dark';
    }

    let luminanceTotal = 0;
    let sampleCount = 0;

    for (let index = 0; index + 2 < pixels.length; index += channels) {
        luminanceTotal += getRelativeLuminance(pixels[index], pixels[index + 1], pixels[index + 2]);
        sampleCount += 1;
    }

    if (sampleCount === 0) {
        return 'dark';
    }

    const sourceLuminance = luminanceTotal / sampleCount;
    const renderedLuminance = sourceLuminance * (1 - HERO_OVERLAY_OPACITY);

    return renderedLuminance <= DARK_RENDERED_LUMINANCE_THRESHOLD ? 'dark' : 'light';
};

const isTrustedMediaUrl = (sourceUrl: string): boolean => {
    try {
        const parsedUrl = new URL(sourceUrl);

        return parsedUrl.protocol === 'https:' && parsedUrl.hostname === TRUSTED_MEDIA_HOSTNAME;
    } catch {
        return false;
    }
};

const readBoundedResponseBody = async (response: Response): Promise<Buffer> => {
    if (!response.body) {
        const body = Buffer.from(await response.arrayBuffer());

        if (body.byteLength > MAX_IMAGE_BYTES) {
            throw new Error('Image response exceeds the analysis size limit.');
        }

        return body;
    }

    const reader = response.body.getReader();
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            totalBytes += value.byteLength;

            if (totalBytes > MAX_IMAGE_BYTES) {
                await reader.cancel();
                throw new Error('Image response exceeds the analysis size limit.');
            }

            chunks.push(Buffer.from(value));
        }
    } finally {
        reader.releaseLock();
    }

    return Buffer.concat(chunks, totalBytes);
};

/**
 * Server-side image-tone detection for the event hero. Fail closed to dark so
 * the existing dark scrim and white foreground remain the safe fallback.
 */
export const getHeroTone = async (sourceUrl: string): Promise<HeroTone> => {
    if (!isTrustedMediaUrl(sourceUrl)) {
        return 'dark';
    }

    try {
        const response = await fetch(sourceUrl, {
            redirect: 'error',
            signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
        });

        if (!response.ok) {
            return 'dark';
        }

        const declaredLength = Number(response.headers.get('content-length'));

        if (Number.isFinite(declaredLength) && declaredLength > MAX_IMAGE_BYTES) {
            return 'dark';
        }

        const imageBuffer = await readBoundedResponseBody(response);

        const { default: sharp } = await import('sharp');
        const { data, info } = await sharp(imageBuffer, { animated: false })
            .resize(ANALYSIS_SIZE, ANALYSIS_SIZE, { fit: 'cover', position: 'centre' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        return classifyHeroTone(data, info.channels);
    } catch {
        console.warn('[hero-tone] Image analysis failed; using dark fallback.');
        return 'dark';
    }
};

export const normalizeHeroToneSetting = (setting: unknown): HeroToneSetting => {
    const candidate = Array.isArray(setting) && setting.length === 1 ? setting[0] : setting;

    return candidate === 'light' || candidate === 'dark' || candidate === 'auto' ? candidate : 'auto';
};

export const resolveHeroTone = async (
    setting: unknown,
    sourceUrl: string | undefined,
    detectTone: ToneDetector = getHeroTone,
): Promise<HeroTone> => {
    const normalizedSetting = normalizeHeroToneSetting(setting);

    if (normalizedSetting === 'light' || normalizedSetting === 'dark') {
        return normalizedSetting;
    }

    return sourceUrl ? detectTone(sourceUrl) : 'dark';
};
