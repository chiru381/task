const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

const userRoute = require('./routes/userRoutes');

dotenv.config({ path: ".env" });

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("server connected");
});

app.use('/api', userRoute)

mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo DB - Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
});
app.use("/profile", express.static("upload/images"));
app.post("/upload", upload.single("profile"), (req, res) => {
  res.json({
    success: 1,
    profile_url: `http://localhost:${process.env.PORT}/profile/${req.file.filename}`,
  });
});

function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message,
    });
  }
}
app.use(errHandler);


app.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(`running on port no: ${process.env.PORT}`);
});