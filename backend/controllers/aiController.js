const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* =========================================
   PARSE INVOICE FROM TEXT
========================================= */

const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const prompt = `
You are an expert invoice data extraction AI. Analyze the following text and extract the relevant details.
The output MUST be a valid JSON object.

The JSON object should have the following structure:
{
  "clientName": "string",
  "email": "string (if available)",
  "address": "string (if available)",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "unitPrice": number
    }
  ]
}

Here is the text to parse:
--- TEXT START ---
${text}
--- TEXT END ---

Extract the data and provide only the JSON object.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let responseText =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    // Use regex to find the first JSON block or the entire text if no block format is used
    const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : responseText.trim();

    const parsedData = JSON.parse(cleanedJson);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    res.status(500).json({
      message: "Failed to parse invoice data from text.",
      details: error.message,
    });
  }
};

/* =========================================
   GENERATE REMINDER EMAIL
========================================= */

const generateReminderEmail = async (req, res) => {
  const { invoiceId } = req.body;

  if (!invoiceId) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }

  try {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const prompt = `
You are a professional and polite accounting assistant.
Write a friendly reminder email to a client about an unpaid invoice.

Use the following details to personalize the email:

- Client Name: ${invoice.billTo?.clientName}
- Invoice Number: ${invoice.invoiceNumber}
- Amount Due: ₹{invoice.total?.toFixed(2) || "0.00"}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

The tone should be friendly but clear. Keep it concise.
Start the email with "Subject:".
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const reminderText =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    res.status(200).json({ reminderText });
  } catch (error) {
    console.error("Error generating reminder email with AI:", error);
    res.status(500).json({
      message: "Failed to generate reminder email.",
      details: error.message,
    });
  }
};

/* =========================================
   DASHBOARD SUMMARY (AI Insights)
========================================= */

const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (invoices.length === 0) {
      return res.status(200).json({
        insights: ["No invoice data available to generate insights."],
      });
    }

    // Calculate statistics
    const totalInvoices = invoices.length;

    const paidInvoices = invoices.filter(
      (inv) => inv.status === "Paid"
    );

    const unpaidInvoices = invoices.filter(
      (inv) => inv.status !== "Paid"
    );

    const totalRevenue = paidInvoices.reduce(
      (acc, inv) => acc + inv.total,
      0
    );

    const totalOutstanding = unpaidInvoices.reduce(
      (acc, inv) => acc + inv.total,
      0
    );

    const dataSummary = `
- Total number of invoices: ${totalInvoices}
- Total paid invoices: ${paidInvoices.length}
- Total unpaid/pending invoices: ${unpaidInvoices.length}
- Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
- Total outstanding amount from unpaid/pending invoices: ${totalOutstanding.toFixed(2)}
`;

    const prompt = `
You are a friendly and insightful financial analyst for a small business owner.

Based on the following summary of invoice data, provide 2-3 concise and actionable insights.
Each insight should be a short string in a JSON array.
The insights should be encouraging and helpful. Do not just repeat the data.

Summary:
${dataSummary}

Return only a JSON array of insights.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let responseText =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    const cleaned = jsonMatch ? jsonMatch[0] : responseText.trim();

    const insights = JSON.parse(cleaned);

    res.status(200).json({ insights });
  } catch (error) {
    console.error("Error dashboard summary with AI:", error);
    res.status(500).json({
      message: "Failed to generate dashboard insights.",
      details: error.message,
    });
  }
};

module.exports = {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
};