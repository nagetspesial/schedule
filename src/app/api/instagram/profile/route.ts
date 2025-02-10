import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const INSTAGRAM_GRAPH_URL = 'https://graph.instagram.com';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('instagram_access_token');

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // First fetch the user profile
    const profileResponse = await fetch(
      `${INSTAGRAM_GRAPH_URL}/me?fields=id,username,account_type,media_count&access_token=${accessToken.value}`
    );

    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      throw new Error(profileData.error?.message || 'Failed to fetch profile');
    }

    // Then fetch the user's media to get the profile picture
    const mediaResponse = await fetch(
      `${INSTAGRAM_GRAPH_URL}/me/media?fields=id,media_type,media_url,thumbnail_url&access_token=${accessToken.value}`
    );

    const mediaData = await mediaResponse.json();

    if (!mediaResponse.ok) {
      throw new Error(mediaData.error?.message || 'Failed to fetch media');
    }

    // Return combined data
    return NextResponse.json({
      ...profileData,
      profile_picture: mediaData.data[0]?.media_url || mediaData.data[0]?.thumbnail_url
    });
  } catch (error) {
    console.error('Instagram profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 