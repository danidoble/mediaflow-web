import { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthContext';
import { getHealth } from '../lib/api';

interface Props {
  onChange: (email: string | undefined) => void;
}

export function NotifyEmailField({ onChange }: Props) {
  const { user } = useAuth();
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    getHealth()
      .then((res) => setEmailConfigured(res.data.email === 'ok'))
      .catch(() => setEmailConfigured(false));
  }, []);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (checked) {
      const prefilled = email || user?.email || '';
      if (!email && user?.email) setEmail(user.email);
      onChange(prefilled || undefined);
    } else {
      onChange(undefined);
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    onChange(enabled ? val || undefined : undefined);
  };

  if (!emailConfigured) return null;

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="notify-email-enabled"
          checked={enabled}
          onCheckedChange={(v) => handleToggle(Boolean(v))}
        />
        <Label htmlFor="notify-email-enabled" className="cursor-pointer font-normal">
          Notify me by email when done
        </Label>
      </div>
      {enabled && (
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          autoComplete="email"
        />
      )}
    </div>
  );
}
