import { Badge } from '@/components/ui/badge';
import { FaUserEdit, FaUser, FaUserTie } from 'react-icons/fa';
import { ROLES } from '@/constants/roles';

export default function RoleBadge({ role }) {
  if (role === ROLES.REVIEWER) {
    return (
      <Badge className="bg-blue-500 text-white flex items-center gap-1">
        <FaUserEdit className="inline" /> Reviewer
      </Badge>
    );
  }
  if (role === ROLES.AUTHOR) {
    return (
      <Badge className="bg-green-500 text-white flex items-center gap-1">
        <FaUser className="inline" /> Author
      </Badge>
    );
  }
  if (role === ROLES.ORGANIZER) {
    return (
      <Badge className="bg-purple-600 text-white flex items-center gap-1">
        <FaUserTie className="inline" /> Organizer
      </Badge>
    );
  }
  return null;
}
