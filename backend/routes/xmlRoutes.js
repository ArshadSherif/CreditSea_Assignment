
    import express from "express";
    import multer from "multer";

    import { uploadXML,getXML,getReportById } from "../controller/xmlController.js";


    const router = express.Router();

    const upload = multer({ dest: "uploads/" });

    router.post("/upload", upload.single("file"), uploadXML);

    router.get("/reports", getXML)

    router.get("/reports/:id", getReportById);

    export default router;