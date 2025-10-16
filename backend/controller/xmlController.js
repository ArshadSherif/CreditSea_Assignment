import fs from "fs";

import { processXMLUpload } from "../services/xmlService.js";
import { getAllReports, getReportByIdService } from "../services/xmlService.js";

const uploadXML = async (req, res, next) => {
  try {
    if (!req.file) throw { statusCode: 400, message: "No file uploaded!" };

    const report = await processXMLUpload(req.file.path);

    res.json({
      message: "XML uploaded and data saved successfully!",
      data: report,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};



const getXML = async (req, res, next) => {
  try {
    const reports = await getAllReports();
    res.json({ message: "Reports fetched successfully!", data: reports });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await getReportByIdService(req.params.id);
    res.json({ message: "Report fetched successfully!", data: report });
  } catch (error) {
    next(error);
  }
};

export { uploadXML, getXML, getReportById };
