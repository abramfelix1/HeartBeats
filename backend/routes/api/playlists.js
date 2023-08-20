const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist, Song } = require("../../db/models");

const router = express.Router();

/* GET ALL PLAYLIST OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;

  const playlists = await Playlist.findAll({
    include: [
      {
        model: Journal,
        as: "Journal",
        attributes: [],
        where: { userId: user.dataValues.id },
      },
      {
        model: Song,
        as: "Songs",
      },
    ],
  });

  if (!playlists.length) {
    res.json({ Playlist: [] });
  }

  res.json({ Playlists: playlists });
});

/* GET PLAYLIST BY ID */
router.get("/playlists/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const playlistId = req.params.id;

  const playlist = await Playlist.findOne({
    where: { id: playlistId },
    include: [
      {
        model: Song,
        as: "Songs",
      },
    ],
  });

  if (!playlist) {
    return next({
      errors: { playlist: "Playlist could not be found", status: 404 },
    });
  }

  res.json({ Playlist: playlist });
});

module.exports = router;
