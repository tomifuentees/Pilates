import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Estudio de Pilates
        </h1>
        <p className="text-lg text-muted-foreground">
          Sistema de gestión para clientas e instructoras
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-input bg-background rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}