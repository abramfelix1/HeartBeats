const express = require("express");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const querystring = require("querystring");
const { access } = require("fs");
const { User } = require("../../db/models");
const user = require("../../db/models/user");
const { Op } = require("sequelize");
const router = express.Router();
const { setTokenCookie } = require("../../utils/auth");

const client_id = "862fa5e982134c959b5203208de393f9";
const client_secret = process.env.CLIENT_SECRET; //Set this ENV key on RENDER
const redirect_uri =
  process.env.NODE_ENV === "production"
    ? "https://heart-beats.onrender.com/api/spotify/callback"
    : "http://localhost:8000/api/spotify/callback"; //Change to Render site when deploying or make if statement for production later
const redirectURL =
  process.env.NODE_ENV === "production"
    ? "https://heart-beats.onrender.com/"
    : "http://localhost:3000/";

// Client Credentials (No Spotify Account LOGIN)
router.get("/public_token", async (req, res) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (response.ok) {
    const data = await response.json();
    res.clearCookie("access_token");
    res.cookie("access_token", data.access_token);
    return res.json({ access_token: data });
  } else {
    const errorData = await response.json();
    console.error("Spotify API response:", errorData);
    throw new Error("Failed to fetch Spotify access token");
  }
});

// For Spotify Login
router.get("/login", (req, res) => {
  // https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js

  const state = req.cookies["_csrf"];

  if (!state) {
    return res.status(400).send("CSRF token is missing.");
  }
  const scope =
    "user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public user-library-modify user-library-read streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state ";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

//redirects here after /login authenticated
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
  });

  if (response.ok) {
    const { user } = req;
    const data = await response.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    res.cookie("access_token", accessToken);
    res.cookie("refresh_token", refreshToken);

    //Fetch spotify user data and create a User instance
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      });

      const data = await response.json();

      //Create new User with data if it doesn't exist
      if (response.ok) {
        const { email, display_name, id } = data;
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ spotifyId: id }, { email: email }],
          },
        });
        let user;
        if (existingUser) {
          user = existingUser;
        } else if (user) {
          const updatedUser = user.update({ spotifyId: id });
        } else {
          user = await User.create({
            email: email.toLowerCase(),
            username:
              display_name.toLowerCase() + "_" + accessToken.slice(0, 4),
            hashedPassword: accessToken.slice(0, 40),
            firstName: null,
            lastName: null,
            spotifyId: id,
          });
          // console.log("SPOTIFY USER ACCOUNT CREATED", user);
        }
        if (!req.session) {
          console.error("Session does not exist!");
          return res.status(500).send("Server error");
        }
        req.session.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          spotifyId: user.spotifyId,
        };
        setTokenCookie(res, user);
      } else {
        res.status(response.status).json({ error: data.error });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }

    return res.redirect(redirectURL);
  } else throw new Error("Failed to fetch Spotify access token");
});

router.get("/refresh_token", async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: querystring.stringify({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const newAccessToken = data.access_token;
    res.clearCookie("access_token");
    res.cookie("access_token", newAccessToken);
    return res.json({
      access_token: newAccessToken,
      expires_in: data.expires_in,
      data,
    });
  } else throw new Error("Failed to refresh access token.");
});

//Get Spotify User Information
router.get("/session", async (req, res) => {
  const accessToken = req.cookies.access_token;
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
    });

    const data = await response.json();

    if (response.ok) {
      return res.json({ ...data });
    } else {
      res.status(response.status).json({ error: data.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get Random Song (TESTING) change to post to send in values later
router.get("/songtest", async (req, res) => {
  //https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  const accessToken = req.cookies.access_token;
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/recommendations?limit=1&seed_genres=pop&target_valence=0.5", //use req body to generate values for queries later
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    const data = await response.json();

    if (response.ok) {
      return res.json({ ...data });
    } else {
      res.status(response.status).json({ error: data.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET REC SONGS */
router.post("/recsongs", async (req, res) => {
  //https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  const accessToken = req.cookies.access_token;
  // console.log("REQ BODY:", req.body);
  const { valence, energy, songs, genres, artists } = req.body.filter;

  // console.log("SONGS: ", songs);
  // console.log("GENRES: ", genres);
  // console.log("ARTISTS: ", artists);

  const rangeOffset = 0.25252125;
  let minValence = valence - rangeOffset;
  let maxValence = valence + rangeOffset;
  let minEnergy = energy - rangeOffset * 1.15;
  let maxEnergy = energy + rangeOffset * 1.15;
  minValence = Math.max(minValence, 0);
  maxValence = Math.min(maxValence, 1);
  minEnergy = Math.max(minEnergy, 0);
  maxEnergy = Math.min(maxEnergy, 1);

  let baseUrl = "https://api.spotify.com/v1/recommendations?";
  let queryParams = [];

  queryParams.push(`min_energy=${minEnergy}`);
  queryParams.push(`max_energy=${maxEnergy}`);
  queryParams.push(`min_valence=${minValence}`);
  queryParams.push(`max_valence=${maxValence}`);

  if (songs && songs.length > 0) {
    const songIds = songs.map((song) => song.spotifyId).join("%2C");
    queryParams.push(`seed_tracks=${songIds}`);
  }

  if (artists && artists.length > 0) {
    const artistIds = artists.map((artist) => artist.spotifyId).join("%2C");
    queryParams.push(`seed_artists=${artistIds}`);
  }

  if (genres && genres.length > 0) {
    const genreNames = genres.map((genre) => genre.name).join("2%C");
    queryParams.push(`seed_genres=${genreNames}`);
  }

  const url = baseUrl + queryParams.join("&");

  // console.log("URL: ", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
    });
    const data = await response.json();
    if (response.ok) {
      return res.json({ ...data });
    } else {
      res.status(response.status).json({ error: data.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* SPOTIFY SEARCH */
router.get("/search", async (req, res) => {
  const accessToken = req.cookies.access_token;
  const query = req.query.q;
  const url = `https://api.spotify.com/v1/search?q=${query}&type=artist,track&limit=11`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
    });

    const data = await response.json();

    if (response.ok) {
      return res.json({ ...data });
    } else {
      res.status(response.status).json({ error: data.error });
    }
  } catch (err) {
    const error = await err.json();
    res.status(500).json({ error: error.message });
  }
});

/* SPOTIFY GENRES */
router.get("/genres", async (req, res) => {
  const accessToken = req.cookies.access_token;
  const url = `https://api.spotify.com/v1/recommendations/available-genre-seeds`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
    });

    const data = await response.json();

    if (response.ok) {
      return res.json({ ...data });
    } else {
      res.status(response.status).json({ error: data.error });
    }
  } catch (error) {
    return next({
      errors: { error: error.message, status: 404 },
    });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
