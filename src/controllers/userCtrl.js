const User = require("../models/user");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");

const createUser = async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    res
      .status(201)
      .send({ message: "New user created successfully", user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};
const updateUser = async (req, res) => {
  const allowedUpdates = Object.keys(User.schema.obj);
  // console.log(allowedUpdates);

  const toUpdate = Object.keys(req.body);
  const isValidUpdate = toUpdate.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) return res.status(400).send({ error: "Invalid update" });

  try {
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const user = req.user;

    toUpdate.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send({ message: "User successfully updated", user });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  const user = req.user;
  try {
    await req.user.remove();
    sendCancellationEmail(user.email, user.name);
    res.send({ message: "User deleted", user });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteProfilePic = async (req, res) => {
  const user = req.user;
  // console.log(user);
  try {
    user.avatar = undefined;
    await user.save();
    res.status(200).send({ message: "Profile picture deleted", user });
  } catch (error) {
    res.status(400).send();
  }
};

const getUserProfile = async (req, res) => {
  res.send(req.user);
};

const getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error("Unable to get Avatar");

    res.set("Content-Type", "image/png"); // set Content-Type to "image/png"
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
};

const uploadProfilePic = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({
      width: 250,
      height: 250,
    })
    .png()
    .toBuffer(); // .toBuffer() method converts it buffer - .png() method converts it to png
  req.user.avatar = buffer;
  await req.user.save();
  res.send({
    message: "Profile picture successfully uploaded",
    user: req.user,
  });
};

const logOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("User logged out successfully");
  } catch (error) {
    res.status(500).send();
  }
};
const logOutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("User logged out successfully on all devices");
  } catch (error) {
    res.status(500).send();
  }
};
module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  uploadProfilePic,
  logIn,
  logOut,
  logOutAll,
  deleteProfilePic,
  getAvatar,
};
