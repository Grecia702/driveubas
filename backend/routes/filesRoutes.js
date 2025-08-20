const express = require('express');
const router = express.Router();
// const verifyRefresh = require('../middleware/verifyRefreshToken');
const filesController = require('../controller/filesController');
const Busboy = require('busboy');

router.post("/upload", (req, res) => {
    const busboy = Busboy({ headers: req.headers });
    filesController.upload(req, res, busboy);
});
router.post("/newDirectory", filesController.newDirectory);
router.get("/list", filesController.fileList)
router.get("/download/", filesController.download);
router.delete("/delete/", filesController.fileDelete);
router.patch("/rename", filesController.fileRename);
router.patch("/move", filesController.fileMove);


module.exports = router;
