const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const router = express.Router();

const client_id = "2c24c289ce0448af9c1a7a9f98f78d31";
const client_secret = process.env.CLIENT_SECRET; //Remember to set this ENV key on RENDER
const redirect_uri = "http://localhost:3000/";

// Client Credentials (No Spotify Account LOGIN)
router.get("/public_token", async (req, res) => {
  try {
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Spotify API response:", errorData);
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();
    res.send({ access_token: data.access_token });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).send("Error obtaining token.");
  }
});

// Authorization Code (Spotify Account LOGIN, IMPLEMENT AS BONUS LATER)
router.get("/login", (req, res) => {
  // https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js
});

router.get("/callback", (req, res) => {
  // https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js
});

router.get("/refresh_token", (req, res) => {
  // https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js
});

module.exports = router;
