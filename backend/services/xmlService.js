import fs from "fs";
import CreditReport from "../models/creditReport.js";
import { parseExperianXML } from "../utils/xmlParser.js";

 const processXMLUpload = async (filePath) => {
  const { basicDetails, reportSummary, creditAccounts } =
    await parseExperianXML(filePath);

  // Check for duplicates
  const existingReport = await CreditReport.findOne({
    "basicDetails.pan": basicDetails.pan,
  });

  if (existingReport) {
    fs.unlinkSync(filePath);
    throw {
      statusCode: 409,
      message: "Duplicate entry detected. Report already exists for this PAN.",
    };
  }

  const newReport = new CreditReport({
    basicDetails,
    reportSummary,
    creditAccounts,
  });

  await newReport.save();
  fs.unlinkSync(filePath);

  return newReport;
};


 const getAllReports = async () => {
  return await CreditReport.find().sort({ createdAt: -1 });
};

 const getReportByIdService = async (id) => {
  const report = await CreditReport.findById(id);
  if (!report) throw { statusCode: 404, message: "Report not found!" };
  return report;
};

export { processXMLUpload, getAllReports, getReportByIdService };