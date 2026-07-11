import Papa from "papaparse";

export const parseCSV = (csvData: string) => {
  const result = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data;
};