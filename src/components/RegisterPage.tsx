import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, UserPlus } from 'lucide-react';
import { register as apiRegister } from '../lib/api';
import { ThemeToggle } from './ThemeToggle';

function RegisterForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRegister(email, password);
      const { tokens, user } = res.data;
      login(tokens.access_token, tokens.refresh_token, { id: user.id, email: user.email });
      window.location.href = '/dashboard';
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2 font-semibold text-foreground mb-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              MF
            </span>
            <span className="text-lg">MediaFlow</span>
          </a>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>Start converting media in seconds</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 1 character"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Create account
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
