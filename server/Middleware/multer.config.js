const multer = require("multer")
const path = require("path")

// Upload image in folder Images

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images !", false)
  }
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../Images"))
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`)
  },
})

let uploadFile = multer({ storage: storage, fileFilter: imageFilter })
module.exports = uploadFile