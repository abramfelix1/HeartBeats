const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist, Song, PlaylistSong } = require("../../db/models");

const router = express.Router();

// CREATE A NEW SONG
router.post("/", async (req, res, next) => {
  const { user } = req;

  const newSong = await Song.create({
    userId: user.dataValues.id,
    name: req.body.name,
    artists: req.body.artists,
    preview: req.body.preview,
    img_url: req.body.img_url,
    spotify_url: req.body.spotify_url,
  });

  res.json({ song: newSong });
});

module.exports = router;
