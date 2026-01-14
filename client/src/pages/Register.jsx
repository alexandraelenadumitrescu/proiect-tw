import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { REGISTER_URL } from '../urls';
import { toast } from 'sonner';

async function registerUser({ email, password }) {
  const res = await axios.post(REGISTER_URL, { email, password });
  return res.data;
}

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registration successful!', {
        description: 'Redirecting to login...',
        duration: 2 * 1000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
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
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
          {mutation.isError && <div className="text-red-500 text-sm">{mutation.error.message}</div>}
        </form>
      </CardContent>
    </Card>
  );
}
