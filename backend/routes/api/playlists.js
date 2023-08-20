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

/* UPDATE PLAYLIST BY ID */
router.put("/playlists/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const playlistId = req.params.id;

  const journal = await Journal.findOne({
    where: { userId: user.dataValues.id },
    include: {
      model: Playlist,
      as: "Playlist",
      where: { id: playlistId },
    },
  });

  if (!journal) {
    const existingPlaylist = await Playlist.findByPk(playlistId);
    if (!existingPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  const playlist = journal.Playlist;
  const updatedPlaylist = await playlist.update(req.body);
});

module.exports = router;
