import { useParams, useNavigate } from 'react-router-dom';
import useUserStore from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { makeAuthHeaders } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEE_PAPER_STATUSES_URL } from '@/urls';
import {
  PAPER_STATUS_NOT_REVIEWED,
  PAPER_STATUS_CHANGES_REQUESTED,
  PAPER_STATUS_AWAITING_APPROVAL,
} from '@/constants/papers';
import { Badge } from '@/components/ui/badge';
import { PAPER_STATUS_APPROVED } from '@/constants/papers';
import { PAPER_TIMELINE_ROUTE } from '@/routes';
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldGroup,
  FieldLegend,
} from '@/components/ui/field';
import { ALLOCATE_REVIEWER_URL } from '../urls';
import axios from 'axios';
import { SUBMIT_PAPER_URL } from '../urls';

function AuthorActions({ conferenceId }) {
  const [title, setTitle] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [success, setSuccess] = React.useState('');
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const submitMutation = useMutation({
    mutationFn: async ({ title, file }) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);

      return axios.post(SUBMIT_PAPER_URL(conferenceId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      setSuccess('Paper submitted successfully.');
      setTitle('');
      setFile(null);
      queryClient.invalidateQueries(['conference-papers', conferenceId]);
    },
    onError: () => {
      setSuccess('');
    },
  });

  return (
    <form
      className="border rounded p-4 mb-6 bg-gray-50"
      onSubmit={(e) => {
        e.preventDefault();
        if (title && file) {
          submitMutation.mutate({ title, file });
        }
      }}
    >
      <FieldSet>
        <FieldLegend>Submit Paper</FieldLegend>
        <FieldDescription>Submit a new paper to this conference.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="paper-title">Title</FieldLabel>
            <input
              id="paper-title"
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paper Title"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="paper-file">PDF File</FieldLabel>
            <input
              id="paper-file"
              type="file"
              accept="application/pdf"
              className="border rounded px-2 py-1 w-full"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <FieldDescription>Upload your paper as a PDF file.</FieldDescription>
          </Field>
          <div className="flex gap-2 mt-4 mb-2">
            <Button type="submit" disabled={submitMutation.isLoading || !title || !file}>
              Submit Paper
            </Button>
          </div>
          {submitMutation.isError && (
            <div className="text-red-500 text-sm mb-1">Failed to submit paper.</div>
          )}
          {success && <div className="text-green-600 text-sm mb-1">{success}</div>}
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

function OrganizerActions({ conferenceId }) {
  const [email, setEmail] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const inviteMutation = useMutation({
    mutationFn: async (email) => {
      return axios.post(
        ALLOCATE_REVIEWER_URL(conferenceId),
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      setSuccess('Reviewer invited successfully.');
      setEmail('');
      queryClient.invalidateQueries(['paper-timeline', conferenceId]);
    },
    onError: () => {
      setSuccess('');
    },
  });

  return (
    <form
      className="border rounded p-4 mb-6 bg-gray-50"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FieldSet>
        <FieldLegend>Invite Reviewer</FieldLegend>
        <FieldDescription>Invite a reviewer to this conference by email.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="reviewer-email">Reviewer Email</FieldLabel>
            <input
              id="reviewer-email"
              type="email"
              className="border rounded px-2 py-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reviewer@example.com"
              required
            />
          </Field>
          <div className="flex gap-2 mt-4 mb-2">
            <Button
              onClick={() => inviteMutation.mutate(email)}
              disabled={inviteMutation.isLoading || !email}
              type="button"
            >
              Invite Reviewer
            </Button>
          </div>
          {inviteMutation.isError && (
            <div className="text-red-500 text-sm mb-1">Failed to invite reviewer.</div>
          )}
          {success && <div className="text-green-600 text-sm mb-1">{success}</div>}
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
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
      const res = await fetch(SEE_PAPER_STATUSES_URL(conferenceId), {
        headers: {
          ...makeAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch papers');
      return res.json();
    },
  });

  const user = useUserStore((state) => state.user);
  const isUserOrganizer = user?.roles.includes('organizer');

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
                <PaperCard key={idx} paper={paper} conferenceId={conferenceId} paperId={paper.id} />
              ))}
              {!data?.papers?.length && !isLoading && !error && (
                <div className="text-center text-gray-500 py-8">
                  No papers found for this conference.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {data && data.canSeeAllPapers && isUserOrganizer ? <OrganizerActions conferenceId={conferenceId} /> : null}

      {data && data.canSubmitANewPaper ? <AuthorActions conferenceId={conferenceId} /> : null}
    </div>
  );
}
