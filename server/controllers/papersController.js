const prisma = require('../config/shared.js');
const multer = require('multer');
const upload = multer();
const { REVIEWER_ROLE, ORGANIZER_ROLE, AUTHOR_ROLE } = require('../constants/roles.js');

const {
  PAPER_STATUS_DEFAULT,
  PAPER_STATUS_APPROVED,
  PAPER_STATUS_AWAITING_APPROVAL,
  PAPER_STATUS_CHANGES_REQUESTED,
  PAPER_STATUS_NOT_REVIEWED,
} = require('../constants/papers.js');
const { PAPER_VERSIONS_DEFAULT_VERSION_NUMBER } = require('../constants/paperVersions.js');
const {
  CONFERENCE_REVIEWERS_DEFAULT_NUMBER_OF_REVIEWERS_PER_PAPER,
} = require('../constants/conferenceReviewers.js');
const { MEGABYTE_IN_BYTES } = require('../constants/fileSizes.js');
const {
  REVIEW_DECISION_APPROVED,
  REVIEW_DECISION_CHANGES_REQUESTED,
} = require('../constants/reviews.js');

const { pickNRandomElementsFromArray } = require('../utils/pickNRandomElementsFromArray.js');

exports.submitPaper = [
  upload.single('file'),
  async (req, res) => {
    try {
      const confereceId = req.params.conferenceId;

      if (!confereceId) {
        return res.status(400).json({ error: 'Missing conferenceId parameter' });
      }

      const conference = await prisma.conferences.findUnique({
        where: { id: Number(confereceId) },
        include: { conference_authors: true, conference_reviewers: true, papers: true },
      });

      if (!conference) {
        return res.status(404).json({ message: 'Conference not found.' });
      }

      const conferenceAuthorsUserIds = conference.conference_authors.map((ca) => ca.author_id);
      const conferenceReviewersUserIds = conference.conference_reviewers.map(
        (cr) => cr.reviewer_id
      );

      const userId = req.user.id;

      if (conferenceReviewersUserIds.includes(userId)) {
        return res
          .status(400)
          .json({ message: 'Reviewers cannot submit papers to the same conference.' });
      }

      if (conferenceReviewersUserIds.length < 2) {
        return res.status(400).json({
          message:
            'At least two reviewers must be allocated to the conference before submitting papers. Please contact the conference organizer!',
        });
      }

      if (!conferenceAuthorsUserIds.includes(userId)) {
        return res.status(403).json({ message: 'User is not an author in this conference.' });
      }

      const conferencePaperTitles = conference.papers.map((p) => p.title);
      const { title } = req.body;

      if (conferencePaperTitles.includes(title)) {
        return res
          .status(400)
          .json({ message: 'A paper with this title has already been submitted.' });
      }

      const fileName = req.file.originalname;
      const paperBytes = req.file.buffer;

      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Only PDF files are allowed.' });
      }

      if (req.file.size > 3 * MEGABYTE_IN_BYTES) {
        return res.status(400).json({ message: 'File size exceeds the 3MB limit.' });
      }

      const result = await prisma.$transaction(
        async (prisma) => {
          const paper = await prisma.papers.create({
            data: {
              author_id: userId,
              conference_id: conference.id,
              title,
              status: PAPER_STATUS_DEFAULT,
            },
          });

          const paperVersion = await prisma.paper_versions.create({
            data: {
              paper_id: paper.id,
              version_number: PAPER_VERSIONS_DEFAULT_VERSION_NUMBER,
              file_name: fileName,
              file_contents: paperBytes,
            },
          });

          const randomReviewerUserIds = pickNRandomElementsFromArray(
            conference.conference_reviewers.map((cr) => cr.id),
            CONFERENCE_REVIEWERS_DEFAULT_NUMBER_OF_REVIEWERS_PER_PAPER
          );

          await prisma.paper_reviewers.createMany({
            data: randomReviewerUserIds.map((id) => {
              return {
                paper_id: paper.id,
                conference_reviewer_entry_id: id,
              };
            }),
          });

          return { paper, paperVersion };
        },
        // my internet sucks, if reaching the DB takes too long the transaction closes but we don't want this to happen
        { timeout: 30 * 1000 }
      );

      const { paper } = result;
      return res.status(201).json({ paper });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },
];

exports.submitNewVersionOfPaper = [
  upload.single('file'),
  async (req, res) => {
    try {
      const conferenceId = req.params?.conferenceId;
      const paperId = req.params?.paperId;

      if (!conferenceId || !paperId) {
        return res.status(400).json({ message: 'Missing conferenceId or paperId parameter.' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const conference = await prisma.conferences.findUnique({
        where: { id: Number(conferenceId) },
        include: {
          conference_authors: true,
          conference_reviewers: true,
          papers: { include: { paper_versions: true } },
        },
      });

      if (!conference) {
        return res.status(404).json({ message: 'Conference not found.' });
      }

      const paper = conference.papers.find((p) => p.id === Number(paperId));

      if (!paper) {
        return res.status(404).json({ message: 'Paper not found in this conference.' });
      }

      if (paper.status !== PAPER_STATUS_CHANGES_REQUESTED) {
        return res.status(400).json({
          message: 'New versions can only be submitted for papers that have requested changes.',
        });
      }

      // TODO: this is copy paste garbage trash, make this into a middleware
      const conferenceAuthorsUserIds = conference.conference_authors.map((ca) => ca.author_id);
      const conferenceReviewersUserIds = conference.conference_reviewers.map(
        (cr) => cr.reviewer_id
      );

      const userId = req.user.id;

      if (conferenceReviewersUserIds.includes(userId)) {
        return res
          .status(400)
          .json({ message: 'Reviewers cannot submit papers to the same conference.' });
      }

      if (conferenceReviewersUserIds.length < 2) {
        return res.status(400).json({
          message:
            'At least two reviewers must be allocated to the conference before submitting papers. Please contact the conference organizer!',
        });
      }

      if (!conferenceAuthorsUserIds.includes(userId)) {
        return res.status(403).json({ message: 'User is not an author in this conference.' });
      }

      console.log(req);

      const fileName = req.file.originalname;
      const paperBytes = req.file.buffer;

      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Only PDF files are allowed.' });
      }

      if (req.file.size > 3 * MEGABYTE_IN_BYTES) {
        return res.status(400).json({ message: 'File size exceeds the 3MB limit.' });
      }

      const nextPaperVersionNumber = paper.paper_versions.length + 1;

      const result = await prisma.$transaction(async (prisma) => {
        const paperVersion = await prisma.paper_versions.create({
          data: {
            paper_id: paper.id,
            version_number: nextPaperVersionNumber,
            file_name: fileName,
            file_contents: paperBytes,
          },
        });

        await prisma.papers.update({
          where: { id: paper.id },
          data: {
            status: PAPER_STATUS_NOT_REVIEWED,
          },
        });

        return { paperVersion };
      });

      const { paperVersion } = result;
      return res.status(201).json({ paperVersion });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },
];

exports.approvePaper = async (req, res) => {
  try {
    const conferenceId = req.params?.conferenceId;
    const paperId = req.params?.paperId;

    if (!conferenceId || !paperId) {
      return res.status(400).json({ message: 'Missing conferenceId or paperId parameter.' });
    }

    const userId = req?.user?.id;

    const { paperVersion } = req.body;

    if (!paperVersion) {
      return res.status(400).json({ message: 'Please provide a paper version' });
    }

    const conference = await prisma.conferences.findUnique({
      where: { id: Number(conferenceId) },
      include: {
        conference_reviewers: {
          where: {
            reviewer_id: userId,
          },
        },
        papers: {
          where: { id: Number(paperId) },
          include: {
            paper_versions: {
              where: {
                version_number: Number(paperVersion),
              },
            },
            paper_reviewers: {
              include: {
                conference_reviewers: true,
              },
            },
          },
        },
      },
    });

    if (!conference) {
      return res
        .status(400)
        .json({ message: 'Provided conference id does not match any conference' });
    }

    if (conference.papers.length < 1) {
      return res.status(400).json({ message: 'This conference has no papers' });
    }

    if (!conference.conference_reviewers.map((cr) => cr.reviewer_id).includes(userId)) {
      return res.status(400).json({
        message:
          'You are not a reviewer in this conference. Please contact the conference organizer if you think this is wrong',
      });
    }

    if (
      !conference.papers[0].paper_reviewers
        .map((pr) => pr.conference_reviewers.reviewer_id)
        .includes(userId)
    ) {
      return res.status(400).json({
        message: 'You are not assigned as a reviewer for this paper.',
      });
    }
    const relevantConferenceReviewer = await prisma.conference_reviewers.findFirst({
      where: {
        conference_id: conference.id,
        reviewer_id: userId,
      },
      include: {
        paper_reviewers: true,
      },
    });

    const doesReviewAlreadyExist = await prisma.reviews.findFirst({
      where: {
        paper_reviewer_entry_id: relevantConferenceReviewer.paper_reviewers[0].id,
        paper_version_id: conference.papers[0].paper_versions[0].id,
      },
    });

    if (doesReviewAlreadyExist) {
      return res.status(400).json({
        message:
          'You have already submitted a review for this paper version. Please wait for your fellow reviewers to also submit their reviews, or for another version of the paper',
      });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const review = await prisma.reviews.create({
        data: {
          paper_reviewer_entry_id: relevantConferenceReviewer.paper_reviewers[0].id,
          paper_version_id: conference.papers[0].paper_versions[0].id,
          decision: REVIEW_DECISION_APPROVED,
        },
      });

      const allPaperReviews = await prisma.reviews.findMany({
        where: {
          paper_version_id: conference.papers[0].paper_versions[0].id,
        },
      });

      const didAllReviewersProvideADecision =
        allPaperReviews.length === CONFERENCE_REVIEWERS_DEFAULT_NUMBER_OF_REVIEWERS_PER_PAPER;

      if (!didAllReviewersProvideADecision) {
        await prisma.papers.update({
          where: { id: conference.papers[0].id },
          data: {
            status: PAPER_STATUS_AWAITING_APPROVAL,
          },
        });
      }

      const decisions = allPaperReviews.map((d) => d.decision);

      if (
        decisions.every((d) => d === REVIEW_DECISION_APPROVED) &&
        didAllReviewersProvideADecision
      ) {
        await prisma.papers.update({
          where: { id: conference.papers[0].id },
          data: {
            status: PAPER_STATUS_APPROVED,
          },
        });
      }

      return { review };
    });

    const { review } = result;
    return res.status(201).json({ review });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.requestChangesForPaper = async (req, res) => {
  try {
    const conferenceId = req.params?.conferenceId;
    const paperId = req.params?.paperId;

    if (!conferenceId || !paperId) {
      return res.status(400).json({ message: 'Missing conferenceId or paperId parameter.' });
    }

    const userId = req?.user?.id;

    const { paperVersion, comments } = req.body;

    if (!paperVersion) {
      return res.status(400).json({ message: 'Please provide a paper version' });
    }

    if (!comments || !(typeof comments === 'string') || comments.trim().length < 5) {
      return res.status(400).json({
        message:
          'You cannot request changes without providing a description of the changes that is at least 5 characeters long.',
      });
    }

    const conference = await prisma.conferences.findUnique({
      where: { id: Number(conferenceId) },
      include: {
        conference_reviewers: {
          where: {
            reviewer_id: userId,
          },
        },
        papers: {
          where: { id: Number(paperId) },
          include: {
            paper_versions: {
              where: {
                version_number: Number(paperVersion),
              },
            },
            paper_reviewers: {
              include: {
                conference_reviewers: true,
              },
            },
          },
        },
      },
    });

    if (!conference) {
      return res
        .status(400)
        .json({ message: 'Provided conference id does not match any conference' });
    }

    if (conference.papers.length < 1) {
      return res.status(400).json({ message: 'This conference has no papers' });
    }

    if (!conference.conference_reviewers.map((cr) => cr.reviewer_id).includes(userId)) {
      return res.status(400).json({
        message:
          'You are not a reviewer in this conference. Please contact the conference organizer if you think this is wrong',
      });
    }

    if (
      !conference.papers[0].paper_reviewers
        .map((pr) => pr.conference_reviewers.reviewer_id)
        .includes(userId)
    ) {
      return res.status(400).json({
        message: 'You are not assigned as a reviewer for this paper.',
      });
    }
    const relevantConferenceReviewer = await prisma.conference_reviewers.findFirst({
      where: {
        conference_id: conference.id,
        reviewer_id: userId,
      },
      include: {
        paper_reviewers: true,
      },
    });

    const doesReviewAlreadyExist = await prisma.reviews.findFirst({
      where: {
        paper_reviewer_entry_id: relevantConferenceReviewer.paper_reviewers[0].id,
        paper_version_id: conference.papers[0].paper_versions[0].id,
      },
    });

    if (doesReviewAlreadyExist) {
      return res.status(400).json({
        message:
          'You have already submitted a review for this paper version. Please wait for your fellow reviewers to also submit their reviews, or for another version of the paper',
      });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const review = await prisma.reviews.create({
        data: {
          paper_reviewer_entry_id: relevantConferenceReviewer.paper_reviewers[0].id,
          paper_version_id: conference.papers[0].paper_versions[0].id,
          decision: REVIEW_DECISION_CHANGES_REQUESTED,
          comments: comments,
        },
      });

      await prisma.papers.update({
        where: { id: conference.papers[0].id },
        data: {
          status: PAPER_STATUS_CHANGES_REQUESTED,
        },
      });

      return { review };
    });

    const { review } = result;
    return res.status(201).json({ review });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.seePaperStatuses = async (req, res) => {
  try {
    const conferenceId = req.params?.conferenceId;

    if (!conferenceId) {
      return res.status(400).json({ message: 'Missing conferenceId parameter.' });
    }

    const conference = await prisma.conferences.findUnique({
      where: { id: Number(conferenceId) },
      include: {
        conference_authors: true,
        conference_reviewers: true,
        papers: {
          select: {
            id: true,
            author_id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    const conferenceReviewersUserIds = conference.conference_reviewers.map((cr) => cr.reviewer_id);
    const conferenceAuthorsUserIds = conference.conference_authors.map((ca) => ca.author_id);

    const canSeePaperStatuses =
      conference.organizer_id === req.user.id ||
      conferenceReviewersUserIds.includes(req.user.id) ||
      conferenceAuthorsUserIds.includes(req.user.id);

    if (!canSeePaperStatuses) {
      return res.status(403).json({ message: 'You are not part of this conference' });
    }

    const canSeeAllPapers =
      conference.organizer_id === req.user.id || conferenceReviewersUserIds.includes(req.user.id);

    const papersToReturn = !canSeeAllPapers ? conference.papers.filter((p) => p.author_id === req.user.id) : conference.papers;

    const canSubmitANewPaper = conferenceAuthorsUserIds.includes(req.user.id);

    return res.status(200).json({ papers: papersToReturn, canSeeAllPapers, canSubmitANewPaper });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getPaperTimeline = async (req, res) => {
  try {
    const conferenceId = req.params?.conferenceId;
    const paperId = req.params?.paperId;

    if (!conferenceId || !paperId) {
      return res.status(400).json({ message: 'Missing conferenceId or paperId parameter.' });
    }

    const conference = await prisma.conferences.findUnique({
      where: { id: Number(conferenceId) },
      include: {
        conference_reviewers: {
          select: {
            reviewer_id: true,
          },
        },
        conference_authors: {
          select: {
            author_id: true,
          },
        },
        papers: {
          include: {
            paper_versions: {
              orderBy: { created_at: 'asc' },
              select: {
                id: true,
                paper_id: true,
                version_number: true,
                file_name: true,
                created_at: true,

                reviews: {
                  orderBy: { created_at: 'asc' },
                  include: {
                    paper_reviewers: {
                      include: {
                        conference_reviewers: {
                          include: {
                            users: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conference) {
      return res.status(404).json({ message: 'Conference not found.' });
    }

    const conferenceReviewersUserIds = conference.conference_reviewers.map((cr) => cr.reviewer_id);
    const conferenceAuthorsUserIds = conference.conference_authors.map((ca) => ca.author_id);

    const isPartOfConference =
      conferenceReviewersUserIds.includes(req.user.id) ||
      conferenceAuthorsUserIds.includes(req.user.id) ||
      conference.organizer_id === req.user.id;

    if (!isPartOfConference) {
      return res.status(403).json({ message: 'You are not part of this conference.' });
    }

    const userRoleInThisConference =
      req.user.id === conference.organizer_id
        ? ORGANIZER_ROLE
        : conferenceReviewersUserIds.includes(req.user.id)
          ? REVIEWER_ROLE
          : AUTHOR_ROLE;

    const paperICareAbout = conference.papers.find((p) => p.id === Number(paperId));

    // TODO: this is a travesty
    let canPerformRoleSpecificAction = false;
    if (userRoleInThisConference === REVIEWER_ROLE) {
      // cannot leave a review if the paper has been approved already
      if (paperICareAbout.status !== PAPER_STATUS_APPROVED) {
        // you can only leave a review if you have not left a review yet
        const conferenceReviewerEntryId = conference.conference_reviewers.find(
          (cr) => cr.reviewer_id === req.user.id
        ).id;

        const paperReviewerEntry = await prisma.paper_reviewers.findFirst({
          where: {
            paper_id: paperICareAbout.id,
            conference_reviewer_entry_id: conferenceReviewerEntryId,
          },
        });

        const paperReviewerEntryId = paperReviewerEntry.id;

        const lastPaperVersion =
          paperICareAbout.paper_versions[paperICareAbout.paper_versions.length - 1];
        const lastPaperVersionReviewsByMe = lastPaperVersion.reviews.filter(
          (r) => r.paper_reviewer_entry_id === paperReviewerEntryId
        );

        canPerformRoleSpecificAction = lastPaperVersionReviewsByMe.length === 0;
      }
    } else if (userRoleInThisConference === AUTHOR_ROLE) {
      canPerformRoleSpecificAction = paperICareAbout.status === PAPER_STATUS_CHANGES_REQUESTED;
    } else if (userRoleInThisConference === ORGANIZER_ROLE) {
      canPerformRoleSpecificAction = true;
    }

    return res
      .status(200)
      .json({ userRoleInThisConference, canPerformRoleSpecificAction, paper: paperICareAbout });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.downloadPaperVersionFile = async (req, res) => {
  try {
    const conferenceId = req.params.conferenceId;
    const paperId = req.params.paperId;
    const versionNumber = req.params.versionNumber;

    if (!conferenceId || !paperId || !versionNumber) {
      return res
        .status(400)
        .json({ message: 'Missing conferenceId, paperId, or versionNumber parameter.' });
    }

    const conference = await prisma.conferences.findUnique({
      where: { id: Number(conferenceId) },
      include: {
        conference_authors: true,
        conference_reviewers: true,
      },
    });

    if (!conference) {
      return res.status(404).json({ message: 'Conference not found.' });
    }

    const userId = req.user.id;
    const isOrganizer = conference.organizer_id === userId;
    const isReviewer = conference.conference_reviewers.some((cr) => cr.reviewer_id === userId);
    const isAuthor = conference.conference_authors.some((ca) => ca.author_id === userId);

    if (!(isOrganizer || isReviewer || isAuthor)) {
      return res.status(403).json({ message: 'You are not authorized to download this file.' });
    }

    const paperVersion = await prisma.paper_versions.findFirst({
      where: {
        paper_id: Number(paperId),
        version_number: Number(versionNumber),
      },
      select: {
        file_contents: true,
        file_name: true,
      },
    });

    if (!paperVersion) {
      return res.status(404).json({ message: 'Paper version not found.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${paperVersion.file_name}"`);
    return res.send(paperVersion.file_contents);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
