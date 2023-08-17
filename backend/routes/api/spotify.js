const express = require("express");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const querystring = require("querystring");
const { access } = require("fs");
const { User } = require("../../db/models");
const user = require("../../db/models/user");
const { Op } = require("sequelize");
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
    const data = await response.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    console.log(data);
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
        const { email, display_name } = data;
        console.log(email, display_name);
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ username: display_name }, { email: email }],
          },
        });
        let user;
        if (existingUser) {
          console.log("Existing user found:", existingUser);
          user = existingUser;
        } else {
          user = await User.create({
            email: email.toLowerCase(),
            username: display_name.toLowerCase(),
            hashedPassword: accessToken.slice(0, 40),
            firstName: null,
            lastName: null,
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
        };
        console.log("SESSION USER:", req.session.user);
        return res.redirect("http://localhost:3000/");
      } else {
        res.status(response.status).json({ error: data.error });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }

    return res.redirect("http://localhost:3000/");
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
  console.log(accessToken);
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

module.exports = router;
