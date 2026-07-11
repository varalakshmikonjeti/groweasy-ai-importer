import { Request, Response } from "express";
import { importCSVData } from "../services/importService";

export const importCSV = async (
  req: Request,
  res: Response
) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({
        message: "Records are required",
      });
    }

    const result = await importCSVData(records);

    const totalInput = records.length;
    const totalImported = result.length;
    const totalSkipped = totalInput - totalImported;

    return res.json({
      success: true,
      totalRecords: totalInput,
      totalImported,
      totalSkipped,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Import failed",
    });
  }
};