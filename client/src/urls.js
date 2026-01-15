export const BACKEND_URL = 'http://localhost:7878';

export const REGISTER_URL = `${BACKEND_URL}/register`;

export const LOGIN_URL = `${BACKEND_URL}/login`;

export const USERS_ROLES_URL = (userId) => `${BACKEND_URL}/users/${userId}/roles`;
export const ASSIGN_ROLE_URL = `${BACKEND_URL}/users/assign-roles-to-self`;
export const CONFERENCES_URL = `${BACKEND_URL}/conferences`;
export const SEE_PAPER_STATUSES_URL = (conferenceId) => `${BACKEND_URL}/conferences/${conferenceId}/see-paper-statuses`;
