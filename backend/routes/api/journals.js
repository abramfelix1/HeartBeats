const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist, Song } = require("../../db/models");
const { validateJournal } = require("../../utils/validation");

const router = express.Router();

/* GET ALL JOURNALS OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;
  const where = { userId: user.dataValues.id };

  const journals = await Journal.findAll({
    where,
    // include: [
    //   {
    //     model: Playlist,
    //     as: "playlist",
    //   },
    // ],
  });

  if (!journals.length) {
    res.json({ journals: [] });
  }

  res.json({ journals: journals });
});

/* GET JOURNALS BY ID */
router.get("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const journalId = req.params.id;

  const journal = await Journal.findOne({
    where: { id: journalId },
    include: [
      {
        model: Playlist,
        as: "playlist",
        include: [
          {
            model: Song,
            as: "songs",
          },
        ],
      },
    ],
  });

  if (!journal) {
    return next({
      errors: { journal: "Journal could not be found", status: 404 },
    });
  }

  res.json({ journal: journal });
});

/* CREATE A JOURNAL */
router.post("/", requireAuth, validateJournal, async (req, res, next) => {
  const { user } = req;

  const newJournal = await Journal.create({
    userId: user.dataValues.id,
    name: req.body.name,
    content: req.body.content,
    image_url: req.body.image_url || null,
  });

  const reorderedJournal = {
    id: newJournal.id,
    userId: newJournal.userId,
    name: newJournal.name,
    content: newJournal.content,
    image_url: newJournal.image_url,
    createdAt: newJournal.createdAt,
    updatedAt: newJournal.updatedAt,
    // playlist: null,
  };

  res.json({ journal: reorderedJournal });
});

/* UPDATE JOURNAL BY ID */
router.put("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const journalId = req.params.id;

  const journal = await Journal.findOne({
    where: { id: journalId },
  });

  if (!journal) {
    return next({
      errors: { journal: "Journal could not be found", status: 404 },
    });
  }

  if (journal.userId !== user.dataValues.id) {
    return next({
      errors: { journal: "Unauthorized Access", status: 401 },
    });
  }

  const updatedJournal = await journal.update(req.body);

  res.json({ journal: updatedJournal });
});

/* DELETE JOURNAL BY ID */
router.delete("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const journalId = req.params.id;

  const journal = await Journal.findOne({
    where: { id: journalId },
  });

  if (!journal) {
    return next({
      errors: { journal: "Journal could not be found", status: 404 },
    });
  }

  if (journal.userId !== user.dataValues.id) {
    return next({
      errors: { journal: "Unauthorized Access", status: 401 },
    });
  }

  await journal.destroy();

  res.json({ message: "Journal deleted successfully" });
});

module.exports = router;
