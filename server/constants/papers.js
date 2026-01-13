// this status is set when none of the reviewers have made a decision
const PAPER_STATUS_NOT_REVIEWED = 'not_reviewed';

// this status is set when at least ONE of the reviewers have requested changes
const PAPER_STATUS_CHANGES_REQUESTED = 'changes_requested';

// this status is set when at least ONE of the reviewers have approved the paper
// while all other reviewers have not yet made a decision
const PAPER_STATUS_AWAITING_APPROVAL = 'awaiting_approval';

// this status is set when ALL of the reviewers await have approved the paper
const PAPER_STATUS_APPROVED = 'approved';

const PAPER_STATUS_DEFAULT = PAPER_STATUS_NOT_REVIEWED;

const PAPER_STATUSES = [
  PAPER_STATUS_NOT_REVIEWED,
  PAPER_STATUS_CHANGES_REQUESTED,
  PAPER_STATUS_APPROVED,
  PAPER_STATUS_AWAITING_APPROVAL,
];

exports.PAPER_STATUS_NOT_REVIEWED = PAPER_STATUS_NOT_REVIEWED;
exports.PAPER_STATUS_CHANGES_REQUESTED = PAPER_STATUS_CHANGES_REQUESTED;
exports.PAPER_STATUS_AWAITING_APPROVAL = PAPER_STATUS_AWAITING_APPROVAL;
exports.PAPER_STATUS_APPROVED = PAPER_STATUS_APPROVED;

exports.PAPER_STATUS_DEFAULT = PAPER_STATUS_DEFAULT;

exports.PAPER_STATUSES = PAPER_STATUSES;
