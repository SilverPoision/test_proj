const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const mailBody = require("./misc/mailBody");
const { catchAsync, AppError } = require("./misc/errorHander");
const User = require("../Models/user");

const {
  emailSchema,
  loginSchema,
  forgot_Valid,
} = require("../Models/validate");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "silverpoision@gmail.com",
    pass: "Silver@1022",
  },
});

exports.signup = catchAsync(async (req, res, next) => {
  const { error } = emailSchema(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const email = await User.findOne({ email: req.body.email });
  if (email) {
    return next(new AppError("User Alredy Exists!!", 400));
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
    message: "User Created and password sent to email!!",
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

exports.login = catchAsync(async (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  const { error } = loginSchema(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError("Email or password incorrect", 401));
  }

  const validePass = await bcrypt.compare(password, user.password);

  if (!validePass) {
    return next(new AppError("Email or password incorrect", 401));
  }
  const token = jwt.sign(
    {
      _id: user._id,
      changed: user.isPassReset,
    },
    "gphgphgphgph",
    {
      expiresIn: "6h",
    }
  );
  user.sessToken.push(token);

  const filtered = [];
  let verify;

  user.sessToken.map((el) => {
    try {
      verify = jwt.verify(el, "gphgphgphgph");
      if (verify) {
        filtered.push(el);
      }
    } catch (err) {}
  });
  user.sessToken = filtered;

  user.save();

  return res.status(200).send({
    success: true,
    error: false,
    message: "Login successful",
    token: token,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  let user = await User.findOne({ _id: req.user._id });
  filtered = [];
  user.sessToken.map((el) => {
    if (el != token) {
      filtered.push(el);
    }
  });
  user.sessToken = filtered;
  user.save();
  res.status(200).send({ succes: true, error: false, message: "Logout done" });
});

exports.forgotSend = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const { error } = emailSchema(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return next(new AppError("Request failed!!", 500));
    }
    const token = buffer.toString("hex");
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).send({
        succes: true,
        error: false,
        message: "Password reset token sent to email if it exists!",
      });
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    user.save();
    res.status(200).send({
      succes: true,
      error: false,
      message: "Password reset token sent to email if it exists!",
    });
    const mailOption = {
      from: "silverpoision@gmail.com",
      to: req.body.email,
      subject: "Reset your Password!!",
      html: mailBody.confirmEmail(token),
    };
    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log("Mail Server is not working", err);
      }
      return;
    });
  });
});

exports.forgetValidate = catchAsync(async (req, res, next) => {
  const token = req.params.id;
  if (!token) {
    return next(new AppError("No Token Supplied!!", 400));
  }
  const { error } = forgot_Valid(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or Expired Token Supplied!!", 400));
  }
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  user.password = hash;
  user.save();

  return res.status(200).send({
    success: true,
    error: false,
    message: "Password Reset Successfull!!",
  });
});

exports.user = catchAsync(async (req, res, next) => {
  let user = await User.findOne({
    _id: req.user._id,
  });
  if (!user) {
    return next(new AppError("No user Found!!", 401));
  }
  user = {
    _id: user._id,
    isAdmin: user.isAdmin,
    email: user.email,
  };

  return res.status(200).send({
    success: true,
    error: false,
    user,
  });
});