const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const mailBody = require("./misc/mailBody");
const { catchAsync, AppError } = require("./misc/errorHander");
const User = require("../Models/user");

const { emailSchema } = require("../Models/validate");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "silverpoision@gmail.com",
    pass: "Silver@1022",
  },
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { error } = emailSchema(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const email = await User.findOne({ email: req.body.email });
  if (email) {
    return next(
      new AppError(
        "User Alredy Exists if you want to change password then send this req with put!!",
        400
      )
    );
  }

  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: true,
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const userTo = {
    email: req.body.email,
    password: hashedPass,
  };

  const user = new User(userTo);
  user.save();

  res.send({
    success: true,
    error: false,
    message: "User Created and password sent to user's email!!",
  });

  const mailOption = {
    from: "silverpoision@gmail.com",
    to: req.body.email,
    subject: "Login to your Account!!",
    html: `<h1>Here's Your Email and Password:</h1>
           <h3>Email: </h3>${req.body.email}
           <h3>Password: </h3>${password}`,
  };
  transport.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log("Mail Server is not working", err);
    }
    return;
  });
});

exports.editUser = catchAsync(async (req, res, next) => {
  const data = {
    email: req.body.email,
    newEmail: req.body.newemail,
    password: req.body.password,
  };

  const user = User.findOne({ email: email });

  if (!user) {
    return next(new AppError("No user found", 401));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(data.password, salt);

  user.email = data.newEmail;
  user.password = hashedPass;
  user.save();
  return res.send({
    success: true,
    error: false,
    message: "User Updated",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  const user = User.findOneAndDelete({ email: email });

  if (!user) {
    return next(new AppError("No user found", 401));
  }
  return res.send({
    success: true,
    error: false,
    message: "User Updated",
  });
});

exports.readUser = catchAsync(async (req, res, next) => {
  const user = await User.find({ isAdmin: false });

  if (!user) {
    return next(new AppError("No user found", 401));
  }

  const arr = [];

  user.map((el) => {
    arr.push({
      _id: el._id,
      email: el.email,
      isAdmin: el.isAdmin,
    });
  });

  return res.send({
    success: true,
    error: false,
    user: arr,
  });
});
