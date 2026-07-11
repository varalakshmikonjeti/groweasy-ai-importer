import "dotenv/config";
import { importCSVData } from "./services/importService";

const sampleData = [
  {
    "Full Name": "John Doe",
    "Email Address": "john@gmail.com",
    "Phone": "9876543210",
    "Company": "ABC Corp",
    "Location": "Bangalore",
  },
  {
    "Full Name": "Sarah Johnson",
    "Email Address": "sarah@gmail.com",
    "Phone": "8888888888",
    "Company": "XYZ Ltd",
    "Location": "Mumbai",
  }
];

(async () => {
  try {
    const result = await importCSVData(sampleData);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();