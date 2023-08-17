const express = require("express");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const querystring = require("querystring");
const { access } = require("fs");
const router = express.Router();

const client_id = "2c24c289ce0448af9c1a7a9f98f78d31";
const client_secret = process.env.CLIENT_SECRET; //Set this ENV key on RENDER
const redirect_uri = "http://localhost:8000/api/spotify/callback"; //Change to Render site when deploying or make if statement for production later

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
    res.json({ access_token: data });
  } else {
    const errorData = await response.json();
    console.error("Spotify API response:", errorData);
    throw new Error("Failed to fetch Spotify access token");
  }
});

// Authorization Code (Spotify Account LOGIN, IMPLEMENT AS BONUS LATER)
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
    const data = await response.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    res.cookie("access_token", accessToken);
    res.cookie("refresh_token", refreshToken);

    res.redirect("http://localhost:3000/"); // Redirect to your app's main page or dashboard.
  }

  throw new Error("Failed to fetch Spotify access token");
});

router.get("/refresh_token", async (req, res) => {
  const refreshToken = req.query.refresh_token;

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
    res.json({ access_token: newAccessToken });
  }

  throw new Error("Failed to refresh access token.");
});

module.exports = router;
