import Providers from './providers';

export const metadata = {
  title: 'Liquid 2048',
  description: 'Play 2048!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link href="/style/main.css" rel="stylesheet" type="text/css" />
        <link rel="shortcut icon" href="/2048.jpg" />
        <link rel="apple-touch-icon" href="/meta/apple-touch-icon.png" />
        <link rel="apple-touch-startup-image" href="/meta/apple-touch-startup-image-640x1096.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/meta/apple-touch-startup-image-640x920.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="viewport" content="width=device-width, target-densitydpi=160dpi, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
