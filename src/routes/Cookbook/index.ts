import express from 'express';
import { auth, handleError, superAuth } from '../../utils/utils';
import CookbookController from './CookbookController';
import { wrapAsync } from '../../utils/utils';
import { logRoutes } from '../../utils/logging';
import { default as GuideRouter } from './Guide';
import { default as PostRouter } from './Post';
import { default as TagRouter } from './Tag';
import multer from 'multer';
import multerS3 from 'multer-s3';
import {S3Client} from '@aws-sdk/client-s3';
import path from 'path';
import { FileModel } from '../../models/File/file.model';

const s3 = new S3Client({
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
      secretAccessKey: process.env.AWS_SECRET ?? ''
  },
  region: "us-east-1"
});

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: "media.cookbook.gg", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: async (req, file, cb) => {
      const {cookbook} = req.params;
      const {gfycat} = req.body;
      const {originalname, mimetype, size, encoding} = file;
      try {
        if (cookbook == null) return cb('Cookbook undefined');
        const fileModel = await FileModel.create({
          filename: originalname, 
          mime_type: mimetype, 
          file_size: size, 
          encoding,
          cookbook: cookbook._id,
          gfycat
        })
        const fileName = `${fileModel._id}${path.extname(originalname.toLowerCase())}`;
        cb(null, fileName);
      } catch (err) {
        cb(err);
      }

  }
});

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
  // Define the allowed extension
  const fileExts = [".png", ".jpg", ".jpeg", ".gif", ".mp4"];

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(
      path.extname(file.originalname.toLowerCase())
  );

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

  if (isAllowedExt && isAllowedMimeType) {
      return cb(null, true); // no errors
  } else {
      // pass error msg to callback, which can be displaye in frontend
      cb("Error: File type not allowed!");
  }
}

// our middleware
const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
      sanitizeFile(file, callback)
  },
  limits: {
      fileSize: 1024 * 1024 * 20 // 20mb file size
  }
})

const router = express.Router();

router.get('', wrapAsync(CookbookController.get));
router.get('/:cookbook', wrapAsync(CookbookController.getById));
router.patch(
  '/:cookbook',
  wrapAsync(auth),
  wrapAsync(CookbookController.update),
);
router.delete(
  '/:cookbook',
  wrapAsync(superAuth),
  wrapAsync(CookbookController.delete),
);
router.post('', wrapAsync(superAuth), wrapAsync(CookbookController.create));

logRoutes('/cookbooks', router);

router.use('/:cookbook/guides', GuideRouter);
router.use('/:cookbook/posts', PostRouter);
router.use('/:cookbook/tags', TagRouter);

router.use('/:cookbook/upload', wrapAsync(auth), uploadImage.single("image"), wrapAsync(async (req, res) => {
  if (req.file != null && req.file.location != null) {
    res.send(req.file.location);
  }
}));

router.use(handleError);

export default router;
