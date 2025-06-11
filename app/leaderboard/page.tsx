'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LeaderboardEntry {
  rank: number;
  wallet_address: string;
  high_score: number;
  username?: string;
}

// Utility function to shorten wallet address
function shortenAddress(address?: string) {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://prometheus-prod--liquidmax-server-fastapi-app.modal.run/api/leaderboard/2048/');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch leaderboard data:', errorText);
          throw new Error(`Failed to fetch leaderboard data: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data.entries)) {
          setLeaderboard(data.entries);
        } else {
          console.error('Unexpected data structure from API:', data);
          throw new Error('Unexpected data structure from API');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };
    fetchLeaderboard();
  }, []);

  const formatAccountValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div
      style={{
        background: '#EEEDFF', // Match main page background
        color: '#776e65',
        minHeight: '100vh',
        fontFamily: '"Clear Sans", "Helvetica Neue", Arial, sans-serif',
        fontSize: 18,
        margin: 0,
        padding: 0,
      }}
    >
      <div
        className="outer-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 20,
          justifyItems: 'center',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {/* Left Logo */}
        <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image src="/logo.jpg" alt="logo" width={160} height={160} style={{ borderRadius: 6 }} />
        </div>
        {/* Center Content */}
        <div className="container" style={{ width: 500, margin: '0 auto', alignSelf: 'start', marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="heading" style={{ marginBottom: 0, width: '100%' }}>
            <h1 className="title" style={{ fontSize: 48, fontWeight: 'bold', margin: 0, display: 'block', textAlign: 'center', width: '100%' }}>
              <span>2</span>
              <span className="zero" style={{ display: 'inline-block', width: 36, height: 60, backgroundImage: 'url(/logo2.jpg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', textIndent: -9999, verticalAlign: 'middle', marginLeft: 5, marginRight: 10, position: 'relative', top: -4.0 }}>{'0'}</span>
              <span>48 Leaderboard</span>
            </h1>
          </div>
          {error ? (
            <p style={{ textAlign: 'center', color: '#f87171' }}>Error: {error}</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: 32 }}>
              <table
                style={{
                  margin: '0 auto',
                  borderCollapse: 'collapse',
                  width: '100%',
                  maxWidth: 800,
                  background: 'rgba(238,228,218,0.73)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  color: '#776e65',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '2px solid #bbada0' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.95rem', color: '#8f7a66' }}>Rank</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.95rem', color: '#8f7a66' }}>Wallet</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.95rem', color: '#8f7a66' }}>High Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} style={{ borderBottom: '1px solid #ede0c8' }}>
                      <td style={{ padding: '1rem' }}>{entry.rank}</td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: 16 }}>{shortenAddress(entry.wallet_address)}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: '#8f7a66', fontSize: 20 }}>{entry.high_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: 32, textAlign: 'center', color: '#8f7a66', fontSize: 18 }}>
            The top ten players from the waitlist will be given early access to the @tryliquidxyz app. Good luck!
          </div>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <a href="/" style={{ color: '#4fd1c5', fontWeight: 600, fontSize: 16, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Play Now</a>
          </div>
        </div>
        {/* Right Logo */}
        <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image src="/logo.jpg" alt="logo" width={160} height={160} style={{ borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 