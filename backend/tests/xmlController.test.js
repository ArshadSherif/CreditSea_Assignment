import request from "supertest";
import express from "express";
import {
  uploadXML,
  getXML,
  getReportById,
} from "../controller/xmlController.js";
import * as xmlService from "../services/xmlService.js";

jest.mock("../services/xmlService.js");


const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
};

const app = express();
app.use(express.json());


app.post("/upload", async (req, res, next) => {
  req.file = { path: "dummy.xml", originalname: "report.xml" };
  await uploadXML(req, res, next);
});
app.get("/reports", getXML);
app.get("/reports/:id", getReportById);
app.use(errorHandler);

describe("xmlController.js", () => {
  afterEach(() => jest.clearAllMocks());

  test("POST /upload - success", async () => {
    xmlService.processXMLUpload.mockResolvedValue({ id: 1 });

    const res = await request(app).post("/upload");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/success/i);
    expect(res.body.data).toHaveProperty("id", 1);
  });

  test("POST /upload - no file", async () => {
    const customApp = express();
    customApp.use(express.json());
    customApp.post("/upload", async (req, res, next) => {
      req.file = null;
      await uploadXML(req, res, next);
    });
    customApp.use(errorHandler);

    const res = await request(customApp).post("/upload");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/no file/i);
  });

  test("GET /reports - success", async () => {
    xmlService.getAllReports.mockResolvedValue([{ id: 1 }]);
    const res = await request(app).get("/reports");

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  test("GET /reports/:id - success", async () => {
    xmlService.getReportByIdService.mockResolvedValue({ id: 1 });
    const res = await request(app).get("/reports/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  test("GET /reports/:id - not found", async () => {
    xmlService.getReportByIdService.mockRejectedValue({
      statusCode: 404,
      message: "Report not found!",
    });

    const res = await request(app).get("/reports/999");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
