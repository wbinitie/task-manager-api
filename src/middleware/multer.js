const multer = require("multer");

const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error(
          "Please upload a file with the required file extension (jpg ,jpeg or png)"
        )
      );
    }

    cb(undefined, true);
  },
});

module.exports = upload;
