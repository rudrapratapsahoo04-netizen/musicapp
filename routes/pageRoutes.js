const express = require("express");
const router = express.Router();

const Music = require("../models/Music");
const Playlist = require("../models/Playlist"); // ❗ THIS WAS MISSING

// Home Page
router.get("/", async (req, res) => {
    try {

        const music = await Music.find({});

        let playlists = [];

        if (req.session.user) {
            playlists = await Playlist.find({
                owner: req.session.user._id
            });
        }

        res.render("index", {
            music,
            playlists
        });

    } catch (err) {
        console.log("HOME PAGE ERROR:", err);
        res.send("Error loading home page");
    }
});
// Search Page
router.get("/search", async (req, res) => {
    try {

        const query = req.query.q;

        let results = [];

        if (query) {

            // DB search (title or singer)
            results = await Music.find({
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { singer: { $regex: query, $options: "i" } }
                ]
            });
        }

        // Agar kuch nahi mila → random songs
        if (!results || results.length === 0) {
            results = await Music.aggregate([
                { $sample: { size: 6 } }
            ]);
        }

        res.render("search", {
            results,
            query
        });

    } catch (err) {
        console.log(err);
        res.send("Search error");
    }
});

module.exports = router;