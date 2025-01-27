import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public';
    fs.access(dir, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist, create it
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) {
            return cb(err);
          }
          cb(null, dir);
        });
      } else {
        // Directory exists
        cb(null, dir);
      }
    });
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

export { fileFilter, storage };
