const USER_ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  REVIEWER: 'reviewer',
  AUTHOR:  'author',
};

const PAPER_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

const CONFERENCE_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED:  'completed',
  CANCELLED: 'cancelled',
};

module.exports = {
  USER_ROLES,
  PAPER_STATUS,
  CONFERENCE_STATUS,
};
