import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { CONFERENCES_URL } from '@/urls';
import { CONFERENCE_ROUTE } from '@/routes';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { makeAuthHeaders } from '@/lib/utils';

function ConferenceCard({ conference }) {
  const navigate = useNavigate();

  function handleJoinOrView() {
    navigate(CONFERENCE_ROUTE(conference.id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{conference.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {conference.canJoinAsAuthor ? (
            <Button onClick={handleJoinOrView}>Join as Author</Button>
          ) : (
            <Button variant="ghost" onClick={handleJoinOrView}>
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
