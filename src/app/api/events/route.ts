import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { FlattenedEvent } from '@data-types/types';

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

const flattenNotionResponse = (data: any): FlattenedEvent[] => {
    return data.results.map((event: any) => ({
        id: event.id,
        address: event.properties.Address.rich_text[0]?.plain_text || '',
        date: event.properties.Date.date?.start || '',
        eventType: event.properties['Event Type'].rich_text[0]?.plain_text || '',
        featuredImageSrc: event.properties['Featured Image'].files[0]?.file?.url || '',
        excerpt: event.properties.Excerpt.rich_text[0]?.plain_text || '',
        slug: event.properties.Slug.rich_text[0]?.plain_text || '',
        time: event.properties.Time.rich_text[0]?.plain_text || '',
        title: event.properties.Title.title[0]?.plain_text || '',
        url: event.url || ''
    }));
};

export const GET = async () => {
    try {
        const databaseResponse = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID!
        });

        const events = flattenNotionResponse(databaseResponse);

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
};
