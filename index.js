const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Dummy data for blog posts
let posts = [
  {
    id: 1,
    title: "Mystic Elegance(Herat) Collection",
    body: "Step into a world of enchantment with our Mystic Elegance Collection. Each hijab in this collection embodies the ethereal beauty of mystical realms, featuring intricate patterns inspired by ancient symbols and celestial motifs. Elevate your style with a touch of mystique and grace.",
    imageUrl: "uploads/1.png",
  },
  {
    id: 2,
    title: "Serene Blossoms(Kabul) collection",
    body: "Experience the tranquility of nature with our Serene Blossoms Collection. Delicate floral prints and soft pastel hues transport you to a serene garden blooming with beauty and grace. Wrap yourself in the gentle embrace of nature's charm and let your inner beauty blossom.",
    imageUrl: "uploads/2.PNG",
  },
  {
    id: 3,
    title: "Urban Chic(Mazar) collection",
    body: "Embrace modern sophistication with our Urban Chic Collection. Sleek lines, bold patterns, and vibrant colors come together to redefine hijab fashion for the contemporary woman. From bustling city streets to trendy cafes, exude confidence and style with every step.",
    imageUrl: "uploads/3.PNG",
  },
  {
    id: 4,
    title: "Golden Sands(Farah) collection",
    body: "Discover the allure of exotic destinations with our Golden Sands Collection. Inspired by sun-kissed beaches and desert landscapes, each hijab in this collection captures the warmth of golden sunsets and the shimmering sands. Embark on a journey of elegance and luxury with every wear.",
    imageUrl: "uploads/4.PNG",
  },
  {
    id: 5,
    title: "Timeless Classics(Badakhshan) collection",
    body: "ndulge in timeless elegance with our Classics Collection. Featuring timeless designs and rich, luxurious fabrics, these hijabs exude sophistication and grace. Perfect for any occasion, elevate your wardrobe with pieces that stand the test of time and never go out of style.",
    imageUrl: "uploads/5.PNG",
  },
];
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/create", (req, res) => {
  res.render("create-post");
});
// app.post("/create", upload.single("image"), (req, res) => {
//   res.send("Image uploaded successfully");
// });
app.post("/create", upload.single("image"), (req, res) => {
  const { title, body } = req.body;
  const imageUrl = req.file ? "/uploads/" + req.file.filename : null;
  const newPost = { id: posts.length + 1, title, body, imageUrl };
  posts.push(newPost);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);
  res.render("edit-post", { post });
});

app.post("/edit/:id", upload.single("image"), (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, body } = req.body;
  const imageUrl = req.file ? "/uploads" + req.file.filename : null;
  const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    posts[index].title = title;
    posts[index].body = body;
    if (imageUrl) {
      posts[index].imageUrl = imageUrl;
    }
  }

  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== postId);
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
