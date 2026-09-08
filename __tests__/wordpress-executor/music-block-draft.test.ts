import {
    isMusicBlockDraftCommand,
    MUSIC_BLOCK_DRAFT,
    MUSIC_BLOCK_DRAFT_COMMAND,
    MUSIC_BLOCK_DRAFT_OPERATION_ID
} from '@/wordpress-executor/music-block-draft';

describe('CLO-117 bounded Music Block draft command', () => {
    it('exposes only the fixed approved command and event envelope', () => {
        expect(isMusicBlockDraftCommand(MUSIC_BLOCK_DRAFT_COMMAND)).toBe(true);
        expect(isMusicBlockDraftCommand('music-block-20261017-draft --title=unsafe')).toBe(false);
        expect(isMusicBlockDraftCommand(undefined)).toBe(false);
        expect(MUSIC_BLOCK_DRAFT).toEqual({
            operationId: MUSIC_BLOCK_DRAFT_OPERATION_ID,
            title: 'Music Block',
            content: `<p>Music Block is a Cloud City-endorsed gathering built around thoughtful DJ programming, intentional sound, and welcoming social space.</p>
<p>No Hype. Just Music.</p>
<p>Saturday, October 17 · 1–5 PM</p>
<p>How you show up is yours.</p>
<p>RSVP and get the latest details on Partiful.</p>`,
            event_datetime: '2026-10-17 13:00:00',
            address: 'TBA',
            ticket_link: 'https://partiful.com/e/TGox2BL4WnU9a9MMFQ7D'
        });
    });
});
