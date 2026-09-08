import type { CreateMarketingDraftInput } from './types';

export const MUSIC_BLOCK_DRAFT_COMMAND = 'music-block-20261017-draft' as const;
export const MUSIC_BLOCK_DRAFT_OPERATION_ID = 'clo117-music-block-20261017-draft' as const;

export const MUSIC_BLOCK_DRAFT: CreateMarketingDraftInput = {
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
};

export function isMusicBlockDraftCommand(argument: string | undefined): boolean {
    return argument === MUSIC_BLOCK_DRAFT_COMMAND;
}
