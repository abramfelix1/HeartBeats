const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist, Song, PlaylistSong } = require("../../db/models");

const router = express.Router();

/* GET ALL PLAYLIST OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;

  const playlists = await Playlist.findAll({
    include: [
      {
        model: Journal,
        as: "journal",
        attributes: [],
        where: { userId: user.dataValues.id },
      },
      {
        model: Song,
        as: "songs",
      },
    ],
  });

  if (!playlists.length) {
    res.json({ Playlist: [] });
  }

  res.json({ playlists: playlists });
});

/* GET PLAYLIST BY ID */
router.get("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const playlistId = req.params.id;

  const playlist = await Playlist.findOne({
    where: { id: playlistId },
    include: [
      {
        model: Song,
        as: "songs",
      },
    ],
  });

  if (!playlist) {
    return next({
      errors: { playlist: "Playlist could not be found", status: 404 },
    });
  }

  res.json({ playlist: playlist });
});

/* CREATE A PLAYLIST */
router.post("/", requireAuth, async (req, res, next) => {
  const { user } = req;

  const newPlaylist = await Playlist.create({
    userId: user.dataValues.id,
    journalId: req.body.journalId,
    name: req.body.name,
    spotify_url: req.body.spotify_url || null,
    image_url: req.body.image_url || null,
    instrumental: req.body.instrumental || null,
    mood: req.body.mood || null,
    energy: req.body.energy || null,
  });

  res.json({ playlist: newPlaylist });
});

/* UPDATE PLAYLIST BY ID */
router.put("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const playlistId = req.params.id;

  const journal = await Journal.findOne({
    where: { userId: user.dataValues.id },
    include: {
      model: Playlist,
      as: "playlist",
      where: { id: playlistId },
    },
  });

  if (!journal) {
    const existingPlaylist = await Playlist.findByPk(playlistId);
    if (!existingPlaylist) {
      return next({
        errors: { playlist: "Playlist could not be found", status: 404 },
      });
    }
    return next({
      errors: { journal: "Unauthorized Access", status: 401 },
    });
  }

  const playlist = journal.playlist;
  const updatedPlaylist = await playlist.update(req.body);

  res.json({ playlist: updatedPlaylist });
});

/* DELETE PLAYLIST BY ID */
router.delete("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const playlistId = req.params.id;

  const journal = await Journal.findOne({
    where: { userId: user.dataValues.id },
    include: {
      model: Playlist,
      as: "playlist",
      where: { id: playlistId },
    },
  });

  if (!journal) {
    const existingPlaylist = await Playlist.findByPk(playlistId);
    if (!existingPlaylist) {
      return next({
        errors: { playlist: "Playlist could not be found", status: 404 },
      });
    }
    return next({
      errors: { journal: "Unauthorized Access", status: 401 },
    });
  }

  const playlist = journal.playlist;
  await playlist.destroy();

  res.json({ message: "Playlist deleted successfully" });
});

/* ADD SONG TO PLAYLIST */
router.post("/:playlistId/add/:songId", async (req, res, next) => {
  const { playlistId, songId } = req.params;

  const playlist = await Playlist.findByPk(playlistId);
  const song = await Song.findByPk(songId);

  if (!playlist) {
    return next({
      errors: { playlist: "Playlist not found", status: 404 },
    });
  }

  if (!song) {
    return next({
      errors: { song: "Song not found", status: 404 },
    });
  }

  const playlistSong = await PlaylistSong.create({
    playlistId: playlist.id,
    songId: song.id,
  });

  res.json({ playlistSong: playlistSong });
});

module.exports = router;
