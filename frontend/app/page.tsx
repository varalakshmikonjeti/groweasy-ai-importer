"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [crmData, setCrmData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadCSV = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setPreview(data.preview);
      alert("CSV uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  const importCRM = async () => {
    if (preview.length === 0) {
      alert("Upload a CSV first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: preview,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setCrmData(data.data);
      alert("Import completed successfully!");
    } catch (error) {
      console.error(error);
      alert("Import failed.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          GrowEasy AI Importer
        </h1>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <p className="mt-4">
          <strong>Selected File:</strong>{" "}
          {file ? file.name : "No file selected"}
        </p>

        <button
          onClick={uploadCSV}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
        >
          Upload CSV
        </button>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">
          CSV Preview
        </h2>

        {preview.length === 0 ? (
          <p>No data uploaded yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                {Object.keys(preview[0]).map((key) => (
                  <th key={key} className="border p-2 bg-gray-200">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {preview.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value: any, i) => (
                    <td key={i} className="border p-2">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={importCRM}
          disabled={loading}
          className="mt-8 bg-green-600 text-white px-5 py-2 rounded"
        >
          {loading ? "Importing..." : "Import to CRM"}
        </button>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">
          CRM Results
        </h2>

        {crmData.length === 0 ? (
          <p>No CRM data yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                {Object.keys(crmData[0]).map((key) => (
                  <th key={key} className="border p-2 bg-green-200">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {crmData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value: any, i) => (
                    <td key={i} className="border p-2">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}