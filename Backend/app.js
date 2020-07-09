const express = require("express");
const morgan = require("morgan");
const shopRoutes = require("./Routes/user");
const app = express();
const mongo = require("mongoose");

const port = process.env.PORT || 3000;

mongo.connect(
  "mongodb+srv://silverpoision:Silver@1671@test-proj.nknii.mongodb.net/user?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Connected to DB");
  }
);

app.listen(port, (err) => {
  console.log(`Server Started at port ${port}`);
});

//Middlewares
app.use(express.json());
app.use(morgan("tiny"));

//Router
app.use("/api/", shopRoutes);

//404 error Handler
app.use((req, res) => {
  return res.status(404).send("404 You are on a wrong way!!");
});

//Error Handler
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
  });
};

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  mode = "development";

  if (mode === "development") {
    sendErrorDev(err, res);
  } else if (mode === "production") {
    sendErrorProd(err, res);
  }
});
