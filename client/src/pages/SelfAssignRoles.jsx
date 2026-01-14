import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import useUserStore from '@/store/userStore';
import { ALL_ROLES } from '@/constants/roles';
import { USERS_ROLES_URL, ASSIGN_ROLE_URL } from '@/urls';
import { toast } from 'sonner';

export default function SelfAssignRoles() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      const res = await axios.get(USERS_ROLES_URL(user.id));
      return res.data;
    },
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: async (role) => {
      const token = localStorage.getItem('token');

      await axios.post(
        ASSIGN_ROLE_URL,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', user?.id] });
      toast.success('Role assigned!');
    },
  });

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Assign Roles</CardTitle>
        </CardHeader>
        <CardContent>Please log in to assign roles.</CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Assign Roles</CardTitle>
        </CardHeader>
        <CardContent>Loading your roles...</CardContent>
      </Card>
    );
  }

  const hasAllRoles = ALL_ROLES.every((role) => userRoles.includes(role));

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Assign Yourself More Roles</CardTitle>
      </CardHeader>
      <CardContent>
        {hasAllRoles ? (
          <div className="text-green-600">You already have all available roles!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {ALL_ROLES.map((role) => {
              const hasRole = userRoles.includes(role);
              return (
                <Button
                  key={role}
                  disabled={hasRole || mutation.isPending}
                  variant={hasRole ? 'outline' : 'default'}
                  className={hasRole ? 'opacity-50 cursor-not-allowed' : ''}
                  onClick={() => mutation.mutate(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                  {hasRole ? ' (Already assigned)' : ''}
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
