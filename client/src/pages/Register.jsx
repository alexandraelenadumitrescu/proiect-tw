import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Input type="text" placeholder="Name" required />
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Password" required />
          <Button type="submit">Register</Button>
        </form>
      </CardContent>
    </Card>
  );
}
