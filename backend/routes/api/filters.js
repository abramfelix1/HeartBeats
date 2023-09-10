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
  Filter,
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

/* DELETE FILTER ASSOCIATIONS */
router.delete("/:id", async (req, res, next) => {
  const { user } = req;
  const filterId = req.params.id;
  const { genreName, songId, artistId } = req.body;

  let genre;
  let filterGenre;
  if (genreName) {
    genre = await Genre.findOne({ where: { name: genreName } });
    if (!genre) {
      return next({
        errors: { genre: "Genre not found", status: 404 },
      });
    } else {
      filterGenre = await FilterGenre.findOne({
        where: { filterId, genreId: genre.id },
      });
      if (!filterGenre) {
        return next({
          errors: { filter: "Filter GENRE not found", status: 404 },
        });
      } else {
        await filterGenre.destroy();
      }
    }
  }

  let artist;
  let filterArtist;
  if (artistId) {
    artist = await Artist.findOne({ where: { spotifyId: artistId } });
    console.log(artist);
    if (!artist) {
      return next({
        errors: { artist: "Artist not found", status: 404 },
      });
    } else {
      filterArtist = await FilterArtist.findOne({
        where: { filterId, artistId: artist.id },
      });
      if (!filterArtist) {
        return next({
          errors: { filter: "Filter ARTIST not found", status: 404 },
        });
      } else {
        await filterArtist.destroy();
      }
    }
  }

  let song;
  let filterSong;
  if (songId) {
    song = await Song.findOne({ where: { spotifyId: songId } });
    if (!song) {
      return next({
        errors: { song: "Song not found", status: 404 },
      });
    } else {
      filterSong = await FilterSong.findOne({
        where: { filterId, songId: song.id },
      });
      if (!filterSong) {
        return next({
          errors: { filter: "Filter SONG not found", status: 404 },
        });
      } else {
        await filterSong.destroy();
      }
    }
  }

  const filter = await Filter.findOne({
    where: { id: filterId },
  });

  const updatedJournal = await Journal.findOne({
    where: { id: filter.journalId },
    include: [
      {
        model: Filter,
        where: { id: filterId },
        as: "filter",
      },
    ],
  });

  if (!updatedJournal) {
    return res.status(404).json({ error: "Journal not found." });
  }

  return res.json({
    message: "Filter association(s) deleted successfully.",
  });
});

module.exports = router;
