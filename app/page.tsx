'use client';
import {usePrivy} from '@privy-io/react-auth';
import type {WalletWithMetadata} from '@privy-io/react-auth';
import Script from 'next/script';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    startGame?: (walletAddress: string) => void;
  }
}

// Utility function to shorten wallet address
function shortenAddress(address?: string) {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

function isLargeScore(score: number) {
  return score >= 100000; // Adjust threshold as needed
}

export default function Home() {
  const { ready, authenticated, user, login, logout, createWallet } = usePrivy();
  console.log('Privy:', { ready, authenticated, user, login, logout, createWallet });
  console.log('Environment check:', { 
    privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    hasAppId: !!process.env.NEXT_PUBLIC_PRIVY_APP_ID 
  });
  const userRef = useRef(user);
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addressButtonRef = useRef<HTMLButtonElement>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showDisconnecting, setShowDisconnecting] = useState(false);
  const [showSubmittingScore, setShowSubmittingScore] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  // Only access user/wallet after ready & authenticated
  let wallet: WalletWithMetadata | undefined = undefined;
  let walletAddress: string | undefined = undefined;
  if (ready && authenticated && user) {
    wallet = user.linkedAccounts.find((account) => account.type === 'wallet') as WalletWithMetadata | undefined;
    walletAddress = wallet?.address;
  }
  console.log(user);
 
  useEffect(() => {
    // Reload page on logout
    if (userRef.current && !user) {
      window.location.reload();
    }
    userRef.current = user;

    if (ready && authenticated && user && walletAddress) {
      if (window.startGame) {
        window.startGame(walletAddress);
      }
      // Fetch best score
      fetch(`/api/scores?walletAddress=${walletAddress}`)
        .then(res => res.json())
        .then(data => {
          if (data.bestScore) {
            setBestScore(data.bestScore);
          }
        });
    }
  }, [ready, authenticated, user, walletAddress]);

  // Handle wallet creation for users without wallets
  useEffect(() => {
    const handleWalletCreation = async () => {
      // Only try to create wallet if user is authenticated but has no wallet
      if (ready && authenticated && user && !walletAddress && !isCreatingWallet && createWallet) {
        console.log('User authenticated but no wallet found, creating wallet...');
        setIsCreatingWallet(true);
        
        try {
          await createWallet();
          console.log('Wallet creation initiated');
        } catch (error) {
          console.error('Failed to create wallet:', error);
          setIsCreatingWallet(false);
        }
      }
    };

    // Add a small delay to ensure Privy has time to populate user data
    const timer = setTimeout(handleWalletCreation, 1000);
    
    return () => clearTimeout(timer);
  }, [ready, authenticated, user, walletAddress, isCreatingWallet, createWallet]);

  // Reset wallet creation state when wallet is found
  useEffect(() => {
    if (walletAddress && isCreatingWallet) {
      setIsCreatingWallet(false);
    }
  }, [walletAddress, isCreatingWallet]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const scoreContainer = document.querySelector('.score-container');
    if (!scoreContainer) return;

    const observer = new MutationObserver(() => {
      const newScore = parseInt(scoreContainer.textContent || '0', 10);
      setScore(newScore);
    });

    observer.observe(scoreContainer, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  const handleSubmitScore = async () => {
    if (!user || !walletAddress) {
      return;
    }
    setShowSubmittingScore(true);
    setTimeout(() => setShowSubmittingScore(false), 1500);

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
          score: bestScore,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.bestScore) {
          setBestScore(data.bestScore);
        }
      } else {
        alert(`Score submission failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('An error occurred while submitting the score.');
    }
  };

  return (
    <>
      <div className="outer-container">
        <div className="logo-container">
          <Image src="/logo.jpg" alt="logo" width="160" height="160" />
        </div>
        <div className="container" style={{ marginTop: '20px' }}>
          <div className="heading" style={{ marginBottom: '0px' }}>
            <h1 className="title"><span>2</span><span className="zero">0</span><span>48</span></h1>
            <div className="scores-container" style={{ display: 'flex', gap: '12px' }}>
              <div className={`score-container${isLargeScore(score) ? ' compact' : ''}`}>{score}</div>
              <div className={`best-container${isLargeScore(bestScore) ? ' compact' : ''}`}>{bestScore}</div>
            </div>
          </div>

          <div className="above-game" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={handleSubmitScore} className="submit-score-button" style={{ background: '#8f7a66', color: '#fff', border: 'none', borderRadius: 3, padding: '0 16px', height: 37, fontWeight: 700, fontSize: 18, cursor: 'pointer', marginRight: 8 }}>
              Submit Score
            </button>
            <a className="restart-button" style={{ background: '#8f7a66', color: '#fff', border: 'none', borderRadius: 3, padding: '0 16px', height: 37, fontWeight: 700, fontSize: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>New Game</a>
          </div>

          <div className="game-container" style={{ marginTop: '16px' }}>
            {(!ready || !authenticated || !user || !walletAddress) && (
              <div className="game-overlay">
                <p>{(!ready || !authenticated || !user) ? 'Please connect a wallet to play' : 'Creating wallet...'}</p>
              </div>
            )}
            <div className="game-message">
              <p></p>
              <div className="lower">
                <a className="keep-playing-button">Keep going</a>
                <a className="retry-button">Try again</a>
              </div>
            </div>

            <div className="grid-container">
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
            </div>

            <div className="tile-container"></div>
          </div>

          <p className="game-explanation">
            <strong className="important">How to play:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
          </p>
        </div>
        <div className="logo-container-right">
          {(!ready || !authenticated || !user) && (
            <button className="connect-wallet-button" style={{background: "#4fd1c5", border: 'none'}} onClick={login}>
              Connect Wallet
            </button>
          )}
          {ready && authenticated && user && !walletAddress && (
            <div style={{ 
              padding: '12px 16px', 
              background: '#f0f0f0', 
              borderRadius: '6px', 
              color: '#666',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center'
            }}>
              <div>
                {isCreatingWallet ? 'Creating wallet...' : 'Wallet creation needed'}
              </div>
              {!isCreatingWallet && createWallet && (
                <button 
                  onClick={async () => {
                    setIsCreatingWallet(true);
                    try {
                      await createWallet();
                    } catch (error) {
                      console.error('Manual wallet creation failed:', error);
                      setIsCreatingWallet(false);
                    }
                  }}
                  style={{
                    background: '#4fd1c5',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Create Wallet
                </button>
              )}
              {!createWallet && (
                <div style={{ color: '#ff6b6b', fontSize: '12px' }}>
                  Error: Privy not properly configured
                </div>
              )}
            </div>
          )}
          {ready && authenticated && user && walletAddress && (
            <div className="wallet-info" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '1em',
                  color: '#4fd1c5',
                  display: 'flex',
                  alignItems: 'center',
                  outline: 'none',
                  borderRadius: 6,
                  boxShadow: '0 0 0 2px #4fd1c5',
                  transition: 'box-shadow 0.2s',
                  gap: '8px',
                }}
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="Show wallet menu"
                ref={addressButtonRef}
              >
                <span style={{ marginLeft: 8 }}>{shortenAddress(walletAddress)}</span>
                <svg style={{ marginLeft: 4 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    background: '#3d7e64',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    minWidth: 180,
                    zIndex: 10,
                    padding: '8px 10px',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '1em',
                    fontWeight: 'normal',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'inherit', fontSize: '1em', fontWeight: 'normal' }}>{shortenAddress(walletAddress)}</span>
                    <button
                      onClick={() => {
                        if (walletAddress) {
                          navigator.clipboard.writeText(walletAddress);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1200);
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 8 }}
                      aria-label="Copy wallet address"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    </button>
                  </div>
                  {copied && <div style={{ color: '#4fd1c5', fontSize: '0.9em', marginBottom: 8 }}>Copied!</div>}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.25)', margin: '8px 0' }} />
                  <button
                    onClick={() => {
                      setShowDisconnecting(true);
                      setTimeout(() => setShowDisconnecting(false), 1500);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: '2px 0',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontWeight: 'normal',
                      fontSize: '0.95em',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="logo-container">
            <Image src="/logo.jpg" alt="logo" width="160" height="160" />
          </div>
        </div>
      </div>
      <Script src="/js/bind_polyfill.js" />
      <Script src="/js/classlist_polyfill.js" />
      <Script src="/js/animframe_polyfill.js" />
      <Script src="/js/keyboard_input_manager.js" />
      <Script src="/js/html_actuator.js" />
      <Script src="/js/grid.js" />
      <Script src="/js/tile.js" />
      <Script src="/js/local_storage_manager.js" />
      <Script src="/js/game_manager.js" />
      <Script src="/js/application.js" />
      {showDisconnecting && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#3d7e64',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontFamily: 'inherit',
          fontSize: '1em',
          fontWeight: 'normal',
          transition: 'opacity 0.3s',
        }}>
          Disconnecting wallet ...
        </div>
      )}
      {showSubmittingScore && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#3d7e64',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontFamily: 'inherit',
          fontSize: '1em',
          fontWeight: 'normal',
          transition: 'opacity 0.3s',
        }}>
          Submitting score ...
        </div>
      )}
    </>
  );
}
