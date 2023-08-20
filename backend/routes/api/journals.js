const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist, Song } = require("../../db/models");

const router = express.Router();

/* GET ALL JOURNALS OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;
  const where = { userId: user.dataValues.id };

  const journals = await Journal.findAll({
    where,
    include: [
      {
        model: Playlist,
        as: "Playlist",
      },
    ],
  });

  if (!journals.length) {
    res.json({ Journals: [] });
  }

  res.json({ Journals: journals });
});

/* GET JOURNALS BY ID */
router.get("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const journalId = req.params.id;

  const journal = await Journal.findOne({
    where: { id: journalId, userId: user.dataValues.id },
    include: [
      {
        model: Playlist,
        as: "Playlist",
        include: [
          {
            model: Song,
            as: "Songs",
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

  res.json({ Journal: journal });
});

module.exports = router;
