import type { APIRoute } from 'astro';
import { SITE_CONTENT } from '@/lib/chat-content';

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(SITE_CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
