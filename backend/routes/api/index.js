// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotifyRouter = require("./spotify.js");
const journalsRouter = require("./journals.js");
const playlistsRouter = require("./playlists.js");
const feedbackRouter = require("./feedback.js");
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spotify", spotifyRouter);
router.use("/journals", journalsRouter);
router.use("/playlists", playlistsRouter);
router.use("/feedback", feedbackRouter);

router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
