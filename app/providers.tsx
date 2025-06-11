'use client';
import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize Privy's appearance
        appearance: {
          theme: 'light',
          accentColor: '#4fd1c5',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // Configure login methods
        loginMethods: ['email'],
      }}
    >
      {children}
    </PrivyProvider>
  );
} 