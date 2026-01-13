const prisma = require('../config/shared.js');
const multer = require('multer');
const upload = multer();

const { PAPER_STATUS_DEFAULT } = require('../constants/papers.js');
const { PAPER_VERSIONS_DEFAULT_VERSION_NUMBER } = require('../constants/paperVersions.js');
const {
  CONFERENCE_REVIEWERS_DEFAULT_NUMBER_OF_REVIEWERS_PER_PAPER,
} = require('../constants/conferenceReviewers.js');
const { MEGABYTE_IN_BYTES } = require('../constants/fileSizes.js')

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

      const result = await prisma.$transaction(async (prisma) => {
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
          conferenceReviewersUserIds,
          CONFERENCE_REVIEWERS_DEFAULT_NUMBER_OF_REVIEWERS_PER_PAPER
        );

        await prisma.paper_reviewers.createMany({
          data: randomReviewerUserIds.map((rruid) => {
            return {
              paper_id: paper.id,
              reviewer_id: rruid,
            };
          }),
        });

        return { paper, paperVersion };
      });

      const { paper } = result;
      return res.status(201).json({ paper });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },
];
