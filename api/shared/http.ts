import { HttpRequest, HttpResponseInit } from '@azure/functions';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://www.KartonReactMovie.net',
];

function getAllowedOrigins(): string[] {
  const configured = process.env.ALLOWED_ORIGINS;
  if (!configured) {
    return DEFAULT_ALLOWED_ORIGINS;
  }
  return configured
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return true;
  return getAllowedOrigins().includes(origin);
}

export function corsHeaders(req: HttpRequest): Record<string, string> {
  const origin = req.headers.get('origin');
  const allowed = isAllowedOrigin(origin);
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowed && origin ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

/** Returns a 204 preflight response, or null if this is not an OPTIONS request. */
export function handleOptions(req: HttpRequest): HttpResponseInit | null {
  if (req.method !== 'OPTIONS') return null;
  return { status: 204, headers: corsHeaders(req) };
}

/** Returns a 403 response if the origin is not allowed, or null if it is. */
export function rejectDisallowedOrigin(req: HttpRequest): HttpResponseInit | null {
  const origin = req.headers.get('origin');
  if (isAllowedOrigin(origin)) return null;
  return { status: 403, headers: corsHeaders(req), jsonBody: { error: 'Origin not allowed' } };
}

export function jsonResponse(
  req: HttpRequest,
  status: number,
  body: unknown,
): HttpResponseInit {
  return { status, headers: corsHeaders(req), jsonBody: body };
}
