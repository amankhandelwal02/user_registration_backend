const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
  // origin: "https://userregisrationfrontend.herokuapp.com",
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));

const userRoute = require("../routes/users");

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Running Successfully",
  });
});

app.use("/api/users", userRoute);

app.listen(port, () => {
  console.log(`The app listening on port ${port}`);
});
