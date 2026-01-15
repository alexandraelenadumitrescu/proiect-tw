import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { makeAuthHeaders } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEE_PAPER_STATUSES_URL } from '../urls';
import {
  PAPER_STATUS_NOT_REVIEWED,
  PAPER_STATUS_CHANGES_REQUESTED,
  PAPER_STATUS_AWAITING_APPROVAL,
} from '@/constants/papers';
import { Badge } from '@/components/ui/badge';
import { PAPER_STATUS_APPROVED } from '../constants/papers';

function StatusBadge({ status }) {
  if (status === PAPER_STATUS_NOT_REVIEWED) {
    return <Badge className="bg-gray-400 text-white">Not Reviewed</Badge>;
  }
  if (status === PAPER_STATUS_CHANGES_REQUESTED) {
    return <Badge className="bg-orange-500 text-white">Changes Requested</Badge>;
  }
  if (status === PAPER_STATUS_AWAITING_APPROVAL) {
    return <Badge className="bg-teal-500 text-white">Awaiting Approval</Badge>;
  }
  if (status === PAPER_STATUS_APPROVED) {
    return <Badge className="bg-green-500 text-white">Approved</Badge>;
  }
  return <Badge>{status}</Badge>;
}

function PaperCard({ paper, conferenceId, paperId }) {
  const navigate = useNavigate();

  function handleViewTimeline() {
    navigate(PAPER_TIMELINE_ROUTE(conferenceId, paperId));
  }

  return (
    <Card>
      <CardHeader className="flex gap-4 items-center">
        <CardTitle>{paper.title}</CardTitle>
        <StatusBadge status={paper.status} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 justify-between">
          <Button onClick={handleViewTimeline}>View Timeline</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConferencePapers() {
  const { conferenceId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['conference-papers', conferenceId],
    queryFn: async () => {
      const res = await fetch(
        SEE_PAPER_STATUSES_URL(conferenceId),
        {
          headers: {
            ...makeAuthHeaders(),
          },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch papers');
      return res.json();
    },
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Papers for Conference {conferenceId}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Loading papers...</div>}
          {error && <div className="text-red-500">Failed to load papers.</div>}
          {data && data.papers && (
            <div className="flex flex-col gap-4">
              {data.papers.map((paper, idx) => (
                <PaperCard
                  key={idx}
                  paper={paper}
                  conferenceId={conferenceId}
                  paperId={idx}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
