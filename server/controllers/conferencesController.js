const prisma = require('../config/shared.js');

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
