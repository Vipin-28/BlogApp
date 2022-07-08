const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();
app.use(express.json());
// to make the images for public so that we can use that in frontEnd
app.use("/images", express.static(path.join(__dirname, "/images")));

const connectDatabase = async () => {
    try {
      const { connection } = await mongoose.connect(process.env.MONGO_URL);
      console.log(`MongoDB connected: ${connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
connectDatabase();


// createing multer storage
const storage = multer.diskStorage({ // callbacks function takes care of errors
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name); // can't be used for postman testing
  },
});
const upload = multer({ storage: storage });  // upload from above storage
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json({success:"true", message:"File has been uploaded"});
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

///////////deployment//////////////

__dirname = path.resolve();
app.use(express.static(path.join(__dirname,"/client/build")));
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname,"/client/build", "index.html"));
});

app.listen(process.env.PORT||4000, ()=>{
    console.log("Backend is running on port 4000!!!");
});