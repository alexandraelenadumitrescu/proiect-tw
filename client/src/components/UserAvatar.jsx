import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import multiavatar from '@multiavatar/multiavatar/esm';

export default function UserAvatar({ email }) {
  const svgCode = multiavatar(email);
  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar>
            <AvatarImage src={svgDataUri} alt="User Avatar" />
            <AvatarFallback>{email.split('@')[0].slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{email}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
