const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const {
  Journal,
  Song,
  Genre,
  Artist,
  FilterSong,
  FilterGenre,
  FilterArtist,
} = require("../../db/models");

const router = express.Router();

/* CREATE SONG ARTIST GENRE FOR FILTER ID*/
router.post("/:id", async (req, res) => {
  const { user } = req;
  const filterId = req.params.id;
  const {
    genreName,
    songId,
    songName,
    songArtists,
    songAlbum,
    songPreview,
    songImg,
    songSpotify,
    artistId,
    artistName,
    artistImg,
    artistSpotify,
  } = req.body;

  let genre;
  if (genreName) {
    genre = await Genre.findOne({ where: { name: genreName } });
    if (!genre) {
      genre = await Genre.create({ name: genreName });
    }
    await FilterGenre.create({ filterId, genreId: genre.id });
  }

  let artist;
  if (artistId) {
    artist = await Artist.findOne({ where: { spotifyId: artistId } });
    if (!artist) {
      artist = await Artist.create({
        name: artistName,
        img_url: artistImg,
        spotifyId: artistId,
        spotify_url: artistSpotify,
      });
    }
    await FilterArtist.create({ filterId, artistId: artist.id });
  }

  let song;
  if (songId) {
    song = await Song.findOne({ where: { spotifyId: songId } });
    if (!song) {
      song = await Song.create({
        name: songName,
        artists: songArtists,
        album: songAlbum,
        preview: songPreview,
        img_url: songImg,
        spotifyId: songId,
        spotify_url: songSpotify,
      });
    }
    await FilterSong.create({ filterId, songId: song.id });
  }

  return res.json({
    message: "Filter associations created successfully.",
    filterId,
    genreId: genre ? genre : null,
    artistId: artist ? artist : null,
    songId: song ? song : null,
  });
});

module.exports = router;
