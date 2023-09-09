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

const client_id = "2c24c289ce0448af9c1a7a9f98f78d31";
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
    "user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public user-read-playback-position user-library-modify user-library-read user-read-email user-read-private";
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
    res.cookie("access_token", accessToken);
    return res.json({ access_token: newAccessToken });
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
  console.log("REQ BODY:", req.body);
  const {
    // minValence,
    // maxValence,
    // minEnergy,
    // maxEnergy,
    valence,
    energy,
    filter1,
    filter2,
    filter3,
    filter4,
    filter5,
  } = req.body;

  //change this offset if not generating enough or too much duplicates
  const rangeOffset = 0.252125;
  let minValence = valence - rangeOffset;
  let maxValence = valence + rangeOffset;
  let minEnergy = energy - rangeOffset;
  let maxEnergy = energy + rangeOffset;
  minValence = Math.max(minValence, 0);
  maxValence = Math.min(maxValence, 1);
  minEnergy = Math.max(minEnergy, 0);
  maxEnergy = Math.min(maxEnergy, 1);

  let baseUrl = "https://api.spotify.com/v1/recommendations?";
  let queryParams = [];

  // if (genre) {
  //   let genreString = genre
  //     .split(",")
  //     .map((g) => g.trim())
  //     .join("%2C");
  //   queryParams.push(`seed_genres=${genreString}`);
  // }

  queryParams.push(`min_energy=${minEnergy}`);
  queryParams.push(`max_energy=${maxEnergy}`);
  // queryParams.push(`min_instrumentalness=${minInstrumentalness}`);
  // queryParams.push(`max_instrumentalness=${maxInstrumentalness}`);
  queryParams.push(`min_valence=${minValence}`);
  queryParams.push(`max_valence=${maxValence}`);

  const url = baseUrl + queryParams.join("&");

  console.log("URL: ", url);

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_tracks=3NZJlJemX3mzjf56MqC5ML%2C3MldzywZOH4Uci6bq9noyJ&min_valence=${minValence}&max_valence=${maxValence}`,
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

/* SPOTIFY SEARCH */
router.get("/search", async (req, res) => {
  const accessToken = req.cookies.access_token;
  const query = req.query.q;
  const url = `https://api.spotify.com/v1/search?q=${query}&type=artist,track&limit=20`;

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

module.exports = router;
