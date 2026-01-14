import React, { useState } from "react";
import { Input } from "./ui/input.tsx";
import { Button } from "./ui/button.tsx";
import { Card, CardHeader, CardContent } from "./ui/card.tsx";
import { LOGIN_URL } from "../constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/auth";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await axios.post(LOGIN_URL, { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      const token = data.token;
      const decoded = jwtDecode(token);

      const user = {
        id: decoded.id,
        email: decoded.email,
        roles: decoded.roles.trim().split(",")
      }

      setAuth({ user, token: data.token });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <Card className="max-w-sm mx-auto mt-20">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">🔐 Login</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={mutation.isLoading} className="w-full">
            {mutation.isLoading ? "Logging in..." : "Login"}
          </Button>
          {mutation.isError && (
            <div className="text-red-500 text-sm text-center">
              {mutation.error?.response?.data?.message || "Login failed"}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
