import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brightness = searchParams.get('b');
  const temperature = searchParams.get('t');

  if (!brightness || !temperature) {
    return NextResponse.json(
      { error: 'Missing brightness (b) or temperature (t) parameters' },
      { status: 400 }
    );
  }

  const b = parseInt(brightness, 10);
  const t = parseInt(temperature, 10);

  if (isNaN(b) || isNaN(t) || b < 0 || b > 100 || t < 2700 || t > 9000) {
    return NextResponse.json(
      { error: 'Invalid parameter values. Brightness: 0-100, Temperature: 2700-9000' },
      { status: 400 }
    );
  }

  // Redirect to studio with the shared settings
  const studioURL = `/studio?b=${b}&t=${t}`;
  return NextResponse.redirect(new URL(studioURL, request.url));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brightness, temperature } = body;

    if (
      typeof brightness !== 'number' ||
      typeof temperature !== 'number' ||
      brightness < 0 ||
      brightness > 100 ||
      temperature < 2700 ||
      temperature > 9000
    ) {
      return NextResponse.json(
        { error: 'Invalid settings' },
        { status: 400 }
      );
    }

    const shareURL = `/studio?b=${brightness}&t=${temperature}`;
    return NextResponse.json({ url: shareURL });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
