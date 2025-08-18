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
router.delete("/delete/:id", filesController.fileDelete);
router.patch("/rename/:id", filesController.fileRename);


module.exports = router;
