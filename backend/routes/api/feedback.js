const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Song, Userfeedback } = require("../../db/models");

const router = express.Router();

/* GET ALL FEEDBACK OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;

  const userFeedback = await UserFeedback.findAll({
    where: { userId: user.dataValues.id },
  });

  if (!userFeedback.length) {
    res.json({ feedback: [] });
  }

  res.json({ feedback: userFeedback });
});

module.exports = router;
