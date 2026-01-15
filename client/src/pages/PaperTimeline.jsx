import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { makeAuthHeaders } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaCheckCircle, FaExclamationCircle, FaFileAlt } from 'react-icons/fa';
import { PAPER_TIMELINE_URL } from '@/urls';

function TimelineItem({ version }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-gray-300 w-6 h-6 flex items-center justify-center">
          <FaFileAlt className="text-gray-700" />
        </div>
        <div className="h-full w-px bg-gray-300 flex-1" />
      </div>
      <div>
        <div className="font-semibold">
          Version {version.version_number}: {version.file_name}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Uploaded at {new Date(version.created_at).toLocaleString()}
        </div>
        {version.reviews && version.reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {version.reviews.map((review) => (
              <div key={review.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {review.decision === 'changes_requested' ? (
                    <>
                      <FaExclamationCircle className="text-orange-500" />
                      <Badge className="bg-orange-500 text-white">Changes Requested</Badge>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-green-500" />
                      <Badge className="bg-green-500 text-white">Approved</Badge>
                    </>
                  )}
                  {review.decision === 'changes_requested' ? (
                    <span className="text-xs text-orange-700 ml-2">
                      Changes requested by <span className="font-semibold">{review.paper_reviewers.conference_reviewers.users.email}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-600 ml-2">
                      Reviewed by {review.paper_reviewers.conference_reviewers.users.email}
                    </span>
                  )}
                </div>
                {review.decision === 'changes_requested' && review.comments && (
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mt-1 text-sm text-orange-900 rounded whitespace-pre-line">
                    {review.comments}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Badge className="bg-gray-400 text-white">No Reviews</Badge>
        )}
      </div>
    </div>
  );
}

export default function PaperTimeline() {
  const { conferenceId, paperId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['paper-timeline', conferenceId, paperId],
    queryFn: async () => {
      const res = await fetch(
        PAPER_TIMELINE_URL(conferenceId, paperId),
        { headers: makeAuthHeaders() }
      );
      if (!res.ok) throw new Error('Failed to fetch timeline');
      return res.json();
    },
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Paper Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Loading timeline...</div>}
          {error && <div className="text-red-500">Failed to load timeline.</div>}
          {data && data.paper && (
            <div className="flex flex-col">
              <div className="font-bold text-lg mb-4">{data.paper.title}</div>
              {data.paper.paper_versions.map((version) => (
                <TimelineItem
                  key={version.id}
                  version={version}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
