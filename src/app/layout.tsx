import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';

export const metadata = {
  title: 'NextPlay',
  description: 'RAWG 기반 게임 정보 사이트',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <QueryProvider>
            <div className="mx-auto max-w-7xl px-4">
              <header className="h-16 flex items-center justify-between">
                <h1 className="text-xl font-semibold">NextPlay</h1>
              </header>
              <main className="py-6">{children}</main>
              <footer className="py-10 text-sm text-muted-foreground">© NextPlay</footer>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
