import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SELF_ASSIGN_ROLES_ROUTE, SEE_CONFERENCES_ROUTE } from '@/routes';

export default function Dashboard() {
  const navigate = useNavigate();

  function handleAssignRoles() {
    navigate(SELF_ASSIGN_ROLES_ROUTE);
  }

  function handleSeeConferences() {
    navigate(SEE_CONFERENCES_ROUTE);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>Welcome to your dashboard!</CardContent>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>See Conferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <span>
              Interested in conferences? Click below to explore all available conferences.
            </span>
            <Button onClick={handleSeeConferences}>View Conferences</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Not satisfied with your roles?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <span>
              If you are not satisfied with your current roles, click the button below to assign
              yourself more roles.
            </span>
            <Button onClick={handleAssignRoles} variant="secondary">
              Assign More Roles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
