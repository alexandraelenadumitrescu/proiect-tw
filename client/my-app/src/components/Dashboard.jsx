import { Button } from "./ui/button.tsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold mb-6">🏠 Dashboard</h1>
      <Button className="w-40" onClick={() => navigate("/login")}>
        Go to Login
      </Button>
      <Button className="w-40" variant="secondary" onClick={() => navigate("/register")}>
        Go to Register
      </Button>
      <Button className="w-40" variant="secondary" onClick={() => navigate("/self-assign-roles")}>
        Self Assign Roles
      </Button>
    </div>
  );
};

export default Dashboard;
