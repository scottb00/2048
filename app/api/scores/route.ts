import { NextResponse } from 'next/server';
// import { kv } from '@vercel/kv'; // Removed kv import

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  // TODO: Replace with actual storage/retrieval logic
  const bestScore = 0;

  return NextResponse.json({ bestScore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, score } = body;

    if (!walletAddress || typeof score !== 'number') {
      return NextResponse.json({ error: 'Wallet address and score are required' }, { status: 400 });
    }

    // TODO: Replace with actual storage/retrieval logic
    const currentBest = 0;

    if (score > currentBest) {
      // TODO: Replace with actual storage logic
      // await kv.set(walletAddress, score); // Removed kv usage
      return NextResponse.json({ success: true, bestScore: score });
    }

    return NextResponse.json({ success: true, bestScore: currentBest, message: 'Score not higher than current best.' });
  } catch (error) {
    console.error('Error processing score:', error);
    return NextResponse.json({ error: 'Failed to process score' }, { status: 500 });
  }
} 