import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LOGIN_URL } from '@/urls';
import { LOGIN_ROUTE } from '@/routes';
import { toast } from 'sonner';
import axios from 'axios';
import useUserStore from '@/store/userStore';

async function loginUser({ email, password }) {
  const res = await axios.post(LOGIN_URL, { email, password });
  return res.data;
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const setUserFromToken = useUserStore((s) => s.setUserFromToken);
  const logout = useUserStore((s) => s.logout);
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUserFromToken(data.token);
      toast.success('Login successful!');
      localStorage.setItem('token', data.token);
      setTimeout(() => navigate('/dashboard'), 2000);
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate(form);
  }

  function handleLogout() {
    logout();
    queryClient.clear();
    localStorage.removeItem('token');
    toast('Logged out');
    navigate(LOGIN_ROUTE);
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        {!user ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <div>Logged in as {user.email}</div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
