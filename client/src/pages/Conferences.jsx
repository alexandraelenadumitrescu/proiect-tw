import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import RoleBadge from '@/components/RoleBadge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { CONFERENCES_URL } from '@/urls';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { makeAuthHeaders } from '@/lib/utils';
import { CONFERENCE_PAPERS_ROUTE } from '@/routes';
import UserAvatar from '../components/UserAvatar';

function ConferenceCard({ conference }) {
  const navigate = useNavigate();

  function handleJoinOrView() {
    navigate(CONFERENCE_PAPERS_ROUTE(conference.id));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 items-center">
          <CardTitle>{conference.name}</CardTitle>
          {!conference.canJoinAsAuthor ? <div>
            <RoleBadge role={conference.userRoleInThisConference} />
          </div> : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className='font-semibold'>Reviewers in this conference:</p>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              {conference.conferenceReviewerEmails.map(e =>
                <UserAvatar email={e} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className='font-semibold'>Authors in this conference:</p>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              {conference.conferenceAuthorEmails.slice(0, 5).map(e =>
                <UserAvatar email={e} />
              )}
            </div>
            {conference.conferenceAuthorEmails.length > 5 ? (
              <p className='font-semibold'>... and {conference.conferenceAuthorEmails.length - 5} others</p>
            ) : null}
          </div>

          {conference.canJoinAsAuthor ? (
            <Button onClick={handleJoinOrView}>Join as Author</Button>
          ) : (
            <Button variant="secondary" onClick={handleJoinOrView}>
              <FaArrowRight className="mr-2" />
              View Conference
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Conferences() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['conferences'],
    queryFn: async () => {
      const res = await fetch(CONFERENCES_URL, { headers: makeAuthHeaders() });

      if (!res.ok) throw new Error('Failed to fetch conferences');
      return res.json();
    },
  });

  console.log(data);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Available Conferences</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Loading conferences...</div>}
          {error && <div className="text-red-500">Failed to load conferences.</div>}
          {data && data.conferences && (
            <div className="flex flex-col gap-4">
              {data.conferences.map((conf) => (
                <ConferenceCard key={conf.id} conference={conf} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
