import { Router } from "express";
import multer from "multer";

import { uploadCSV } from "../controllers/uploadController";
import { importCSV } from "../controllers/importController";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  upload.single("file"),
  uploadCSV
);

router.post(
  "/import",
  importCSV
);

export default router;