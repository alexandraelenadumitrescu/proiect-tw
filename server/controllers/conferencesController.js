const prisma = require('../config/shared.js');
const { REVIEWER_ROLE } = require('../constants/roles.js');

exports.createConference = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in to create a conference' });
  }

  try {
    console.log(req.user);
    const conference = await prisma.conferences.create({
      data: {
        name,
        organizer_id: req.user.id,
      },
    });

    res.status(201).json(conference);
  } catch (error) {
    console.error('Error creating conference:', error);
    res.status(500).json({ error: 'Failed to create conference' });
  }
};

exports.allocateReviewerToConference = async (req, res) => {
  const { email } = req.body;
  const conferenceId = req.params.conferenceId;

  if (!email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in to allocate a reviewer' });
  }
  if (!conferenceId) {
    return res.status(400).json({ error: 'Missing conferenceId parameter' });
  }

  try {
    // Fetch the conference and include the organizer user
    const conference = await prisma.conferences.findUnique({
      where: { id: Number(conferenceId) },
      include: { users: true, conference_reviewers: true, conference_authors: true },
    });

    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    if (conference.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the organizer can allocate reviewers' });
    }

    const reviewer = await prisma.users.findUnique({
      where: { email },
      include: { user_roles: true },
    });

    if (!reviewer) {
      return res.status(404).json({ error: 'Reviewer user not found' });
    }

    if (reviewer.id === conference.organizer_id) {
      return res
        .status(400)
        .json({ error: 'Organizer cannot be a reviewer for their own conference' });
    }

    if (!reviewer.user_roles.some((role) => role.role_type === REVIEWER_ROLE)) {
      return res.status(400).json({ error: 'User is not a reviewer' });
    }

    if (conference.conference_reviewers.some((cr) => cr.reviewer_id === reviewer.id)) {
      return res.status(400).json({ error: 'Reviewer is already allocated to this conference' });
    }

    if (conference.conference_authors.some((ca) => ca.author_id === reviewer.id)) {
      return res.status(400).json({ error: 'Reviewer cannot be an author in the same conference' });
    }

    const conferenceReviewer = await prisma.conference_reviewers.create({
      data: {
        conference_id: conference.id,
        reviewer_id: reviewer.id,
      },
    });

    return res.status(201).json(conferenceReviewer);
  } catch (error) {
    console.error('Error allocating reviewer to conference:', error);
    res.status(500).json({ error: 'Failed to allocate reviewer to conference' });
  }
};
