import multer from "multer";

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, next) {
    // console.log(file);
    return next(null, `${file.fieldname}-${Date.now()}+${file.originalname}`);
  },
});

export { storage };
