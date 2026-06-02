const router = require("express").Router();
const multer = require("multer");
const Music = require("../models/Music");
const auth = require("../middleware/auth");

// Local Storage
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// Add Music Page
router.get("/add", auth, (req, res) => {
  res.render("addmusic");
});


// Upload Music
router.post(
  "/add",
  auth,
  upload.fields([
    { name: "audio" },
    { name: "thumbnail" }
  ]),
  async (req, res) => {
    try {
      const { title, singer, duration } = req.body;

      await Music.create({
        title,
        singer,
        duration,
        audioFile: req.files.audio[0].filename,
        thumbnail: req.files.thumbnail[0].filename,
        createdBy: req.session.user._id
      });

      req.flash("success", "Music Uploaded!");
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send("Upload Error");
    }
  }
);


// like 
router.post("/like/:id", auth, async (req, res) => {

    const music = await Music.findById(req.params.id);

    const userId = req.session.user._id;

    const alreadyLiked = music.likes.includes(userId);

    if (alreadyLiked) {
        music.likes.pull(userId);
    } else {
        music.likes.push(userId);
    }

    await music.save();

    res.redirect("/");
});


module.exports = router;