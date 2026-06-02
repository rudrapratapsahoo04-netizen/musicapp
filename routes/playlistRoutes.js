const express = require("express");
const router = express.Router();

const Playlist = require("../models/Playlist");
const Music = require("../models/Music"); // ❗ missing tha
const auth = require("../middleware/auth");


// =========================
// CREATE PLAYLIST
// =========================
router.post("/create", auth, async (req, res) => {
    try {

        if (!req.body.name) {
            return res.redirect("/playlist/my");
        }

        await Playlist.create({
            name: req.body.name,
            owner: req.session.user._id
        });

        res.redirect("/playlist/my");

    } catch (err) {
        console.log(err);
        res.redirect("/playlist/my");
    }
});


// =========================
// MY PLAYLISTS
// =========================
router.get("/my", auth, async (req, res) => {
    try {

        const playlists = await Playlist.find({
            owner: req.session.user._id
        });

        res.render("playlist/my", { playlists });

    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});


// =========================
// ADD SONG (NEW CLEAN VERSION)
// =========================
router.post("/add-song", auth, async (req, res) => {
    try {

        const { playlistId, songId } = req.body;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) return res.redirect("/");

        if (
            playlist.owner.toString() !==
            req.session.user._id.toString()
        ) {
            return res.redirect("/");
        }

        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            await playlist.save();
        }

        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});


// =========================
// OPEN PLAYLIST
// =========================
router.get("/:id", auth, async (req, res) => {
    try {

        const playlist = await Playlist.findById(req.params.id)
            .populate("songs");

        if (!playlist) return res.redirect("/playlist/my");

        res.render("playlist/show", { playlist });

    } catch (err) {
        console.log(err);
        res.redirect("/playlist/my");
    }
});


module.exports = router;