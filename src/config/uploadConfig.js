import multer from 'multer';
import { fileFilter, storage } from '../utils/upload.js';

const uploadConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 300 * 1024 * 1024,
  },
});

export default uploadConfig;
