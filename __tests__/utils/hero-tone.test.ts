import { classifyHeroTone, getHeroTone, normalizeHeroToneSetting, resolveHeroTone } from '@/utils/hero-tone';

const rgba = (...pixels: number[]): Uint8Array => new Uint8Array(pixels);

describe('hero-tone', () => {
    it('classifies a dark rendered hero as dark', () => {
        expect(classifyHeroTone(rgba(18, 18, 18, 255))).toBe('dark');
    });

    it('classifies a bright rendered hero as light', () => {
        expect(classifyHeroTone(rgba(245, 245, 245, 255))).toBe('light');
    });

    it('classifies the Music Block sound-bars sample as dark after the hero scrim', () => {
        expect(classifyHeroTone(rgba(20, 210, 90, 255, 8, 24, 12, 255))).toBe('dark');
    });

    it('fails closed for an empty or incomplete pixel buffer', () => {
        expect(classifyHeroTone(new Uint8Array())).toBe('dark');
        expect(classifyHeroTone(new Uint8Array([255, 255]))).toBe('dark');
    });

    it('normalizes only the allowlisted settings', () => {
        expect(normalizeHeroToneSetting('auto')).toBe('auto');
        expect(normalizeHeroToneSetting('light')).toBe('light');
        expect(normalizeHeroToneSetting('dark')).toBe('dark');
        expect(normalizeHeroToneSetting(null)).toBe('auto');
        expect(normalizeHeroToneSetting('pink')).toBe('auto');
        expect(normalizeHeroToneSetting({})).toBe('auto');
        expect(normalizeHeroToneSetting(['dark'])).toBe('dark');
        expect(normalizeHeroToneSetting([])).toBe('auto');
        expect(normalizeHeroToneSetting(['light', 'dark'])).toBe('auto');
    });

    it('honors explicit settings without analyzing an image', async () => {
        const detectTone = jest.fn<Promise<'dark' | 'light'>, [string]>();

        await expect(resolveHeroTone('light', undefined, detectTone)).resolves.toBe('light');
        await expect(resolveHeroTone('dark', 'https://cirquitree.com/image.png', detectTone)).resolves.toBe('dark');

        expect(detectTone).not.toHaveBeenCalled();
    });

    it('delegates auto to the detector when a source image exists', async () => {
        const detectTone = jest.fn<Promise<'dark' | 'light'>, [string]>().mockResolvedValue('light');

        await expect(resolveHeroTone('auto', 'https://cirquitree.com/image.png', detectTone)).resolves.toBe('light');

        expect(detectTone).toHaveBeenCalledWith('https://cirquitree.com/image.png');
    });

    it('fails closed when auto has no source image', async () => {
        const detectTone = jest.fn<Promise<'dark' | 'light'>, [string]>();

        await expect(resolveHeroTone(null, undefined, detectTone)).resolves.toBe('dark');

        expect(detectTone).not.toHaveBeenCalled();
    });

    it('does not fetch an untrusted media URL', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch');

        await expect(getHeroTone('https://example.com/image.png')).resolves.toBe('dark');

        expect(fetchSpy).not.toHaveBeenCalled();
        fetchSpy.mockRestore();
    });

    it('rejects redirects and preserves the analysis fallback', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 200 }));
        const warningSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

        await expect(getHeroTone('https://cirquitree.com/image.png')).resolves.toBe('dark');

        expect(fetchSpy).toHaveBeenCalledWith(
            'https://cirquitree.com/image.png',
            expect.objectContaining({ redirect: 'error' })
        );
        warningSpy.mockRestore();
        fetchSpy.mockRestore();
    });

    it('fails closed before decoding a response over the declared size limit', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(null, {
                headers: { 'content-length': String(10 * 1024 * 1024 + 1) },
                status: 200
            })
        );

        await expect(getHeroTone('https://cirquitree.com/image.png')).resolves.toBe('dark');

        fetchSpy.mockRestore();
    });

    it('fails closed when a chunked response crosses the analysis size limit', async () => {
        const stream = new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(new Uint8Array(5 * 1024 * 1024));
                controller.enqueue(new Uint8Array(5 * 1024 * 1024 + 1));
                controller.close();
            }
        });
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(stream, { status: 200 }));
        const warningSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

        await expect(getHeroTone('https://cirquitree.com/image.png')).resolves.toBe('dark');

        warningSpy.mockRestore();
        fetchSpy.mockRestore();
    });
});
