import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Password" required />
          <Button type="submit">Login</Button>
        </form>
      </CardContent>
    </Card>
  );
}
