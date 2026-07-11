import { Request, Response } from "express";
import { parseCSV } from "../services/csvService";

export const uploadCSV = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No CSV file uploaded",
      });
    }

    const csvData = req.file.buffer.toString("utf-8");

    const records = parseCSV(csvData);

    return res.json({
      message: "CSV uploaded successfully",
      totalRows: records.length,
      preview: records.slice(0, 10),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "CSV processing failed",
    });
  }
};