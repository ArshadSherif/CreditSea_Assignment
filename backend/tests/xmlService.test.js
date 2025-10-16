import fs from "fs";
import CreditReport from "../models/creditReport.js";
import {
  processXMLUpload,
  getAllReports,
  getReportByIdService,
} from "../services/xmlService.js";


jest.mock("fs");
jest.mock("../models/creditReport.js");
jest.mock("../utils/xmlParser.js", () => ({
  parseExperianXML: jest.fn().mockResolvedValue({
    basicDetails: { pan: "ABCDE1234F" },
    reportSummary: { totalAccounts: 2 },
    creditAccounts: [{ accountNumber: "12345" }],
  }),
}));

describe("xmlService.js", () => {
  afterEach(() => jest.clearAllMocks());

  test("processXMLUpload should save new report", async () => {
    CreditReport.findOne.mockResolvedValue(null);

    // Mock the save method on the prototype
    CreditReport.prototype.save = jest.fn().mockImplementation(function () {
      this._id = "1"; 
      return this;
    });

    const report = await processXMLUpload("dummy.xml");

    expect(fs.unlinkSync).toHaveBeenCalledWith("dummy.xml");
    expect(report).toHaveProperty("_id", "1");
  });

  test("processXMLUpload should throw duplicate error", async () => {
    CreditReport.findOne.mockResolvedValue({ _id: "existing" });

    await expect(processXMLUpload("dummy.xml")).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  test("getAllReports should return all reports", async () => {
    CreditReport.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ id: 1 }]),
    });

    const reports = await getAllReports();
    expect(Array.isArray(reports)).toBe(true);
    expect(reports[0]).toHaveProperty("id");
  });

  test("getReportByIdService should return report if found", async () => {
    CreditReport.findById.mockResolvedValue({ _id: "123" });
    const report = await getReportByIdService("123");
    expect(report).toHaveProperty("_id", "123");
  });

  test("getReportByIdService should throw error if not found", async () => {
    CreditReport.findById.mockResolvedValue(null);
    await expect(getReportByIdService("123")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
