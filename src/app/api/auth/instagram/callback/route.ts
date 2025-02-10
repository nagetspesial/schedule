import { NextResponse } from 'next/server';

const INSTAGRAM_TOKEN_URL = 'https://api.instagram.com/oauth/access_token';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for access token
    const formData = new FormData();
    formData.append('client_id', process.env.INSTAGRAM_APP_ID!);
    formData.append('client_secret', process.env.INSTAGRAM_APP_SECRET!);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI!);
    formData.append('code', code);

    const response = await fetch(INSTAGRAM_TOKEN_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_message || 'Failed to get access token');
    }

    // Store the access token securely (you might want to use a database or secure session)
    // For now, we'll store it in an HTTP-only cookie
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `instagram_access_token=${data.access_token}; HttpOnly; Secure; SameSite=Strict; Path=/`
    );

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Instagram auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 