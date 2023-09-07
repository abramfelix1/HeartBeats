const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist, Song, PlaylistSong } = require("../../db/models");
const { validatePlaylist } = require("../../utils/validation");
const user = require("../../db/models/user");

const router = express.Router();

/* GET ALL PLAYLIST OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;

  const playlists = await Playlist.findAll({
    include: [
      // {
      //   model: Journal,
      //   as: "journal",
      //   attributes: [],
      //   where: { userId: user.dataValues.id },
      // },
      {
        model: Song,
        as: "songs",
      },
    ],
  });

  if (!playlists.length) {
    res.json({ playlists: [] });
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
        through: {
          attributes: [],
        },
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
  const { journalId } = req.body;

  // const existingPlaylist = await Playlist.findOne({ where: { journalId } });
  // if (existingPlaylist) {
  //   return next({
  //     errors: { playlist: "Playlist already exists.", status: 404 },
  //   });
  // }

  const newPlaylist = await Playlist.create({
    userId: user.dataValues.id,
    // journalId: req.body.journalId,
    name: req.body.name,
    spotify_url: req.body.spotify_url || null,
    image_url: req.body.image_url || null,
    // instrumental: req.body.instrumental || null,
    // mood: req.body.mood || null,
    // energy: req.body.energy || null,
  });

  res.json({ playlist: newPlaylist });
});

/* UPDATE PLAYLIST BY ID */
router.put("/:id", requireAuth, validatePlaylist, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const playlistId = req.params.id;

  const existingPlaylist = await Playlist.findOne({
    where: {
      userId: userId,
      id: playlistId,
    },
  });

  if (!existingPlaylist) {
    return next({
      errors: { playlist: "Playlist could not be found", status: 404 },
    });
  }

  const updatedPlaylist = await existingPlaylist.update(req.body);
  res.json({ playlist: updatedPlaylist });
});

/* DELETE PLAYLIST BY ID */
router.delete("/:id", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const playlistId = req.params.id;

  const existingPlaylist = await Playlist.findOne({
    where: {
      userId: userId,
      id: playlistId,
    },
  });

  if (!existingPlaylist) {
    return next({
      errors: { playlist: "Playlist could not be found", status: 404 },
    });
  }

  await existingPlaylist.destroy();
  res.json({ message: "Playlist deleted successfully" });
});

/* ADD SONG TO PLAYLIST */
router.post("/:playlistId/add/:songId", async (req, res, next) => {
  const { playlistId, songId } = req.params;

  const song = await Song.findByPk(songId);
  if (!song) {
    return next({
      errors: { song: "Song not found", status: 404 },
    });
  }

  const existingPlaylist = await Playlist.findByPk(playlistId);
  if (!existingPlaylist) {
    return next({
      errors: { playlist: "Playlist could not be found", status: 404 },
    });
  }

  await PlaylistSong.create({
    playlistId: playlistId,
    songId: song.id,
  });

  const updatedPlaylist = await Playlist.findByPk(playlistId, {
    include: [
      {
        model: Song,
        as: "songs",
      },
    ],
  });

  res.json({ playlist: updatedPlaylist });
});

/* DELETE SONG FROM PLAYLIST */
router.delete("/:playlistId/remove/:songId", async (req, res, next) => {
  const { playlistId, songId } = req.params;

  const song = await Song.findByPk(songId);
  if (!song) {
    return next({
      errors: { song: "Song not found", status: 404 },
    });
  }

  const existingPlaylist = await Playlist.findByPk(playlistId);
  if (!existingPlaylist) {
    return next({
      errors: { playlist: "Playlist could not be found", status: 404 },
    });
  }

  const playlistSong = await PlaylistSong.findOne({
    where: {
      playlistId: playlistId,
      songId: song.id,
    },
  });

  if (!playlistSong) {
    return next({
      errors: { playlistSong: "Song is not part of the playlist", status: 404 },
    });
  }

  await playlistSong.destroy();

  const updatedPlaylist = await Playlist.findByPk(playlistId, {
    include: [
      {
        model: Song,
        as: "songs",
      },
    ],
  });

  res.json({ playlist: updatedPlaylist });
});

module.exports = router;
