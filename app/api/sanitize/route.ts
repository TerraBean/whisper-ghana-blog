// app/api/sanitize/route.ts

import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export async function POST(request: Request) {
  const { html } = await request.json();

  // Configure DOMPurify with jsdom
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  // Sanitize the HTML
  const sanitizedHtml = purify.sanitize(html);

  return Response.json({ sanitizedHtml });
}