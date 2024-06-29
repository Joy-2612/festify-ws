import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '../../packages/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../packages/shared/ui/card';
import { Input } from '../../packages/shared/ui/input';
import { Label } from '../../packages/shared/ui/label';
import { useResetPasswordMutation } from '../../api/auth';
import { toast } from 'sonner';
import { getErrorMessage } from '../../packages/shared/utils/error';

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleResetPaswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const newPassword = formData.get('new-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (newPassword !== confirmPassword) {
      return toast.error('Password and confrim password must be same.');
    }

    try {
      const payload = await resetPassword({
        token,
        password: newPassword,
      }).unwrap();
      toast.success(payload.message);
      navigate('/a/login');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <Card className="mx-auto max-w-sm min-w-60">
      <CardHeader>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password and confirm password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleResetPaswordSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">New Password</Label>
            <Input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Reseting Password...' : 'Reset Password'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/a/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
