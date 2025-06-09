import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

type Scores = {
  [walletAddress: string]: number;
};

const scoresFilePath = path.join(process.cwd(), 'scores.json');

async function readScores(): Promise<Scores> {
  try {
    const data = await fs.readFile(scoresFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty object
    if (isErrnoException(error) && error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

function isErrnoException(e: unknown): e is NodeJS.ErrnoException {
    return e instanceof Error && 'code' in e;
}

async function writeScores(scores: Scores): Promise<void> {
  await fs.writeFile(scoresFilePath, JSON.stringify(scores, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  const scores = await readScores();
  const bestScore = scores[walletAddress] || 0;

  return NextResponse.json({ bestScore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, score } = body;

    if (!walletAddress || typeof score !== 'number') {
      return NextResponse.json({ error: 'Wallet address and score are required' }, { status: 400 });
    }

    const scores = await readScores();
    const currentBest = scores[walletAddress] || 0;

    if (score > currentBest) {
      scores[walletAddress] = score;
      await writeScores(scores);
      return NextResponse.json({ success: true, bestScore: score });
    }

    return NextResponse.json({ success: true, bestScore: currentBest, message: 'Score not higher than current best.' });
  } catch (error) {
    console.error('Error processing score:', error);
    return NextResponse.json({ error: 'Failed to process score' }, { status: 500 });
  }
} 