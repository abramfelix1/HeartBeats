const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Song, UserFeedback } = require("../../db/models");

const router = express.Router();

/* GET ALL FEEDBACK OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;

  const userFeedback = await UserFeedback.findAll({
    where: { userId: user.dataValues.id },
  });

  if (!userFeedback.length) {
    return res.json({ feedback: [] });
  }

  res.json({ userFeedback: userFeedback });
});

/* GET ALL FEEDBACK OF SONG */
router.get("/:songId", async (req, res, next) => {
  const { songId } = req.params;

  const song = await Song.findByPk(songId);

  if (!song) {
    return next({
      errors: { song: "Song could not be found", status: 404 },
    });
  }

  const songFeedback = await UserFeedback.findAll({
    where: { songId },
    attributes: [
      "id",
      "userId",
      "feedbackType",
      [sequelize.fn("COUNT", sequelize.col("id")), "totalFeedbacks"],
      [sequelize.fn("SUM", sequelize.col("like")), "totalLikes"],
    ],
    group: ["UserFeedback.id", "UserFeedback.feedbackType"],
    include: [
      {
        model: Song,
      },
    ],
  });

  if (!songFeedback.length) {
    return res.json({ songFeedback: [] });
  }

  res.json({ songFeedback: songFeedback });
});

module.exports = router;
