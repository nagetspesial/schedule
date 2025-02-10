import { NextResponse } from 'next/server';

const INSTAGRAM_AUTH_URL = 'https://api.instagram.com/oauth/authorize';

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
    scope: 'user_profile,user_media,user_media_url',
    response_type: 'code',
  });

  return NextResponse.json({
    url: `${INSTAGRAM_AUTH_URL}?${params.toString()}`,
  });
} 