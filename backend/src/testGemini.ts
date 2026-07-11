import "dotenv/config";
import { extractCRMData } from "./services/aiService";

const sampleData = [
  {
    "Full Name": "John Doe",
    "Email Address": "john@gmail.com",
    "Phone": "9876543210",
    "Company": "ABC Corp",
    "Location": "Bangalore",
  },
];

(async () => {
  try {
    const result = await extractCRMData(sampleData);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();