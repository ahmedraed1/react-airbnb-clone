require("dotenv").config();
const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const app = express();

const connectDB = require("./db/connect");
const { console } = require("inspector");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Some fields are required" });
  }
  const user = await User.create({
    name,
    email,
    password: bcryptjs.hashSync(password, 10),
  });
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(201).json({ user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Some fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!bcryptjs.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res
    .status(200)
    .cookie("token", token, { httpOnly: true })
    .json({ user: { id: user._id, name: user.name, email: user.email } });
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, name, email } = decoded;
    res.status(200).json({ userInfo: { id, name, email } });
  });
});

app.get("/logout", (req, res) => {
  res
    .status(200)
    .cookie("token", "", { httpOnly: true, expires: new Date(0) })
    .json({ message: "Logged out successfully" });
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ message: "Link is required" });
  }

  const __dirname = path.resolve(path.dirname(decodeURI(req.url)));
  const newName = "photo-" + Date.now() + ".jpg";
  await imageDownloader
    .image({
      url: link,
      dest: path.join(
        __dirname,
        "/projects/react-js/react-airbnb-clone/public",
        newName
      ),
    })
    .then(() => {
      res.status(201).json({
        success: true,
        message: "Images downloaded successfully",
        image: `/${newName}`,
      });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
});

const __dirname1 = path.resolve(path.dirname(decodeURI("../public")));
const filesMiddleware = multer({
  dest: path.join(__dirname1, "/public"),
});
app.post("/uploads", filesMiddleware.array("files", 100), (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("\\", ""));
    const filePath = uploadedFiles[i].split("\\").length - 1;
    uploadedFiles[i] = "/" + uploadedFiles[i].split("\\")[filePath];
  }

  res.status(200).json(uploadedFiles);
});

const port = process.env.PORT || 3000;
connectDB();
app.listen(port, () => {
  console.log("Server started on port 3000");
});
