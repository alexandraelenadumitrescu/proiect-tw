import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { makeAuthHeaders } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaCheckCircle, FaExclamationCircle, FaFileAlt } from 'react-icons/fa';
import { PAPER_TIMELINE_URL } from '@/urls';
import { FaDownload } from 'react-icons/fa';
import { DOWNLOAD_PAPER_VERSION_URL } from '../urls';
import axios from 'axios';

function FileDownload({ conferenceId, paperId, versionNumber, fileName }) {
  function handleDownload() {
    const url = DOWNLOAD_PAPER_VERSION_URL(conferenceId, paperId, versionNumber);
    const token = localStorage.getItem('token');

    axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(res.data);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1 px-3 py-2 rounded bg-blue-50 hover:bg-blue-100 transition border border-blue-200 mb-2"
      type="button"
      title={`Download ${fileName}`}
    >
      <FaDownload className="text-blue-500" />
      <span className="text-xs text-gray-500 ml-2">Download</span>
    </button>
  );
}

function TimelineItem({ version, conferenceId }) {
  console.log('version is', version);
  return (
    <div className="flex items-start gap-4 mb-8 w-full">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-gray-300 w-6 h-6 flex items-center justify-center">
          <FaFileAlt className="text-gray-700" />
        </div>
        <div className="h-full w-px bg-gray-300 flex-1" />
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <div>
            <div className="font-semibold">
              Version {version.version_number}: {version.file_name}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Uploaded at {new Date(version.created_at).toLocaleString()}
            </div>
          </div>
          <FileDownload
            conferenceId={conferenceId}
            paperId={version.paper_id}
            versionNumber={version.version_number}
            fileName={version.file_name}
          />
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
                      Changes requested by{' '}
                      <span className="font-semibold">
                        {review.paper_reviewers.conference_reviewers.users.email}
                      </span>
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
      const res = await fetch(PAPER_TIMELINE_URL(conferenceId, paperId), {
        headers: makeAuthHeaders(),
      });
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
                <TimelineItem key={version.id} version={version} conferenceId={conferenceId} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
