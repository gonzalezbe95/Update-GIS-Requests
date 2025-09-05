const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
require("dotenv").config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // enable CORS for all origins
app.use(bodyParser.json()); // parse JSON body

// Load sensitive info from environment variables
const SMARTSHEET_ACCESS_TOKEN = process.env.SMARTSHEET_ACCESS_TOKEN;
const SHEET_ID = process.env.SMARTSHEET_SHEET_ID;
const CERT_KEY_PATH = process.env.CERT_KEY_PATH;
const CERT_CRT_PATH = process.env.CERT_CRT_PATH;

// Validate environment variables
if (!SMARTSHEET_ACCESS_TOKEN || !SHEET_ID || !CERT_KEY_PATH || !CERT_CRT_PATH) {
  console.error("Please set all required environment variables in .env file.");
  process.exit(1);
}

// Function to get columns from Smartsheet (optional, for debugging)
const getColumns = async () => {
  try {
    const response = await axios.get(
      `https://api.smartsheet.com/2.0/sheets/${SHEET_ID}/columns`,
      {
        headers: { Authorization: `Bearer ${SMARTSHEET_ACCESS_TOKEN}` },
      }
    );
    console.log("Columns retrieved successfully.");
  } catch (error) {
    console.error("Error fetching columns:", error.message);
  }
};

// Call once at server start
getColumns();

// Format date for Smartsheet
function formatDateForSmartsheet(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// POST endpoint to submit data to Smartsheet
app.post("/submit", async (req, res) => {
  try {
    const formData = req.body.data || req.body;

    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ message: "Form data is empty" });
    }

    if (!formData.requestBy || !formData.requestTitle || !formData.importance) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Construct row data for Smartsheet
    const rowData = {
      toTop: true,
      cells: [
        {
          columnId: parseInt(process.env.COLUMN_REQUESTED_BY || "0"),
          value: formData.requestBy,
        },
        {
          columnId: parseInt(process.env.COLUMN_REQUEST_TITLE || "0"),
          value: formData.requestTitle,
        },
        {
          columnId: parseInt(process.env.COLUMN_IMPORTANCE || "0"),
          value: formData.importance,
        },
        {
          columnId: parseInt(process.env.COLUMN_DEPARTMENT || "0"),
          value: formData.department,
        },
        {
          columnId: parseInt(process.env.COLUMN_DATE_REQUESTED || "0"),
          value: formatDateForSmartsheet(formData.dateRequested),
        },
        {
          columnId: parseInt(process.env.COLUMN_DATE_DUE || "0"),
          value: formatDateForSmartsheet(formData.dateDue),
        },
        {
          columnId: parseInt(process.env.COLUMN_SENSITIVE_DATA || "0"),
          value: formData.sensitiveData,
        },
        {
          columnId: parseInt(process.env.COLUMN_REQUEST_DETAILS || "0"),
          value: formData.requestDetails,
        },
      ],
    };

    // Send row to Smartsheet
    const response = await axios.post(
      `https://api.smartsheet.com/2.0/sheets/${SHEET_ID}/rows`,
      [rowData],
      {
        headers: {
          Authorization: `Bearer ${SMARTSHEET_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      res
        .status(200)
        .json({ message: "Row added successfully", result: response.data });
    } else {
      res.status(500).json({
        message: "Failed to add row to Smartsheet",
        error: response.data,
      });
    }
  } catch (error) {
    console.error(
      "Error submitting to Smartsheet:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Failed to submit data", error: error.message });
  }
});

// Start server using HTTPS
https
  .createServer(
    {
      key: fs.readFileSync(CERT_KEY_PATH),
      cert: fs.readFileSync(CERT_CRT_PATH),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Server running at https://localhost:${PORT}`);
  });
