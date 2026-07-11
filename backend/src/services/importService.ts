import { createBatches } from "../utils/batch";
import { extractCRMData } from "./aiService";

export const importCSVData = async (records: any[]) => {

  const batches = createBatches(records, 50);

  const finalResult: any[] = [];

  for (const batch of batches) {

    console.log(`Processing batch with ${batch.length} records...`);

    const crmRecords = await extractCRMData(batch);

    finalResult.push(...crmRecords);

  }

  return finalResult;
};