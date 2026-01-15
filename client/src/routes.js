export const DASHBOARD_ROUTE = '/dashboard';

export const LOGIN_ROUTE = '/login';
export const REGISTER_ROUTE = '/register';

export const SELF_ASSIGN_ROLES_ROUTE = '/self-assign-roles';

export const SEE_CONFERENCES_ROUTE = '/conferences';
export const CONFERENCES_ROUTE = '/conferences';
export const CONFERENCE_ROUTE = (conferenceId) => `/conferences/${conferenceId}`;
export const CONFERENCE_PAPERS_ROUTE = (conferenceId) => `/conferences/${conferenceId}/papers`;
export const PAPER_TIMELINE_ROUTE = (conferenceId, paperId) =>
  `/conferences/${conferenceId}/papers/${paperId}/timeline`;
