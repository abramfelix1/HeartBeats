const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist } = require("../../db/models");

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

module.exports = router;
