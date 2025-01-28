'use server';
import { Client } from '@notionhq/client';

export const getNotionClient = async () => new Client({
    auth: process.env.NOTION_TOKEN
});
