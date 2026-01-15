import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import useUserStore from '@/store/userStore';
import RoleBadge from '@/components/RoleBadge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { CONFERENCES_URL } from '@/urls';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { makeAuthHeaders } from '@/lib/utils';
import { CONFERENCE_PAPERS_ROUTE } from '@/routes';
import UserAvatar from '../components/UserAvatar';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';
import { JOIN_AS_AUTHOR_URL } from '@/urls';
import { CREATE_CONFERENCE_URL } from '../urls';
import React from 'react';
import { useQueryClient } from "@tanstack/react-query";

function CreateConferenceForm() {
  const [name, setName] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const createMutation = useMutation({
    mutationFn: async (name) => {
      return axios.post(
        CREATE_CONFERENCE_URL,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      setSuccess('Conference created successfully.');
      setError('');
      setName('');
      queryClient.invalidateQueries(['conferences']);
    },
    onError: () => {
      setSuccess('');
      setError('Failed to create conference.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) {
      createMutation.mutate(name);
    }
  }

  return (
    <form className="border rounded p-4 mb-6 bg-gray-50" onSubmit={handleSubmit}>
      <div className="mb-2 font-semibold">Create New Conference</div>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Conference name"
        className="block w-full border px-2 py-1 mb-2 rounded"
      />
      <Button
        type="submit"
        disabled={!name.trim() || createMutation.isLoading}
      >
        Create
      </Button>
      {createMutation.isError && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
    </form>
  );
}
function ConferenceCard({ conference }) {
  const navigate = useNavigate();

  function redirectToConference() {
    navigate(CONFERENCE_PAPERS_ROUTE(conference.id));
  }

  const joinAsAuthorMutation = useMutation({
    mutationFn: async () => {
      await axios.post(JOIN_AS_AUTHOR_URL(conference.id), null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    onSuccess: () => {
      toast.success('Joined as Author!');
      navigate(CONFERENCE_PAPERS_ROUTE(conference.id));
    },
    onError: () => {
      toast.error('Error');
    },
  });

  function handleJoinAsAuthor() {
    joinAsAuthorMutation.mutate();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 items-center">
          <CardTitle>{conference.name}</CardTitle>
          {!conference.canJoinAsAuthor ? (
            <div>
              <RoleBadge role={conference.userRoleInThisConference} />
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="font-semibold">Reviewers in this conference:</p>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              {conference.conferenceReviewerEmails.map((e) => (
                <UserAvatar email={e} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="font-semibold">Authors in this conference:</p>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              {conference.conferenceAuthorEmails.slice(0, 5).map((e) => (
                <UserAvatar email={e} />
              ))}
            </div>
            {conference.conferenceAuthorEmails.length > 5 ? (
              <p className="font-semibold">
                ... and {conference.conferenceAuthorEmails.length - 5} others
              </p>
            ) : null}
          </div>

          {conference.canJoinAsAuthor ? (
            <Button onClick={handleJoinAsAuthor} disabled={joinAsAuthorMutation.isLoading}>
              Join as Author
            </Button>
          ) : (
            <Button variant="secondary" onClick={redirectToConference}>
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

  const user = useUserStore((state) => state.user);
  const isUserOrganizer = user?.roles.includes('organizer');

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
      {isUserOrganizer ? (<CreateConferenceForm />) : null}
    </div>
  );
}
