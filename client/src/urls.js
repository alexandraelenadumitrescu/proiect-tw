export const BACKEND_URL = 'http://localhost:7878';

export const REGISTER_URL = `${BACKEND_URL}/register`;

export const LOGIN_URL = `${BACKEND_URL}/login`;

export const USERS_ROLES_URL = (userId) => `${BACKEND_URL}/users/${userId}/roles`;
export const ASSIGN_ROLE_URL = `${BACKEND_URL}/users/assign-roles-to-self`;
export const CONFERENCES_URL = `${BACKEND_URL}/conferences`;
export const SEE_PAPER_STATUSES_URL = (conferenceId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/see-paper-statuses`;
export const PAPER_TIMELINE_URL = (conferenceId, paperId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/papers/${paperId}/timeline`;

export const DOWNLOAD_PAPER_VERSION_URL = (conferenceId, paperId, versionNumber) =>
  `${BACKEND_URL}/conferences/${conferenceId}/papers/${paperId}/versions/${versionNumber}/download`;
export const JOIN_AS_AUTHOR_URL = (conferenceId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/join-as-author`;

export const REVIEW_APPROVE = (conferenceId, paperId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/papers/${paperId}/approve`;
export const REVIEW_REQUEST_CHANGES = (conferenceId, paperId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/papers/${paperId}/request-changes`;
export const ALLOCATE_REVIEWER_URL = (conferenceId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/allocate-reviewer`;

export const SUBMIT_PAPER_URL = (conferenceId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/submit-paper`;
export const SUBMIT_NEW_VERSION_OF_PAPER_URL = (conferenceId, paperId) =>
  `${BACKEND_URL}/conferences/${conferenceId}/papers/${paperId}/upload-new-paper-version`;

export const CREATE_CONFERENCE_URL = `${BACKEND_URL}/conferences`;
