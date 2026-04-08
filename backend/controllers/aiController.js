const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");

// Initialize AI only if API key is available and AI is enabled
let ai = null;
const useAI = process.env.USE_AI !== 'false' && process.env.GEMINI_API_KEY;

if (useAI) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error.message);
    ai = null;
  }
}
console.log("USE_AI:", process.env.USE_AI);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle AI calls with retry and fallback
const callGeminiWithRetry = async (prompt, fallbackResponse, maxRetries = 1) => {
  const useAI = process.env.USE_AI !== 'false' && ai; // Check both flag and initialization
  
  if (!useAI) {
    console.log('AI is disabled or not properly initialized - using fallback response');
    return fallbackResponse;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let responseText =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    return responseText;
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Check if it's a quota exceeded error (429)
    if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota exceeded')) {
      console.log('Gemini quota exceeded. Attempting retry if retryDelay is available...');
      
      // Try retry if retryDelay is provided
      if (maxRetries > 0 && error.retryDelay) {
        console.log(`Retrying after ${error.retryDelay}ms delay...`);
        await delay(error.retryDelay);
        return callGeminiWithRetry(prompt, fallbackResponse, maxRetries - 1);
      }
      
      console.log('Gemini quota exceeded - using fallback response');
      return fallbackResponse;
    }
    
    // For other errors, also use fallback
    console.log('AI call failed - using fallback response');
    return fallbackResponse;
  }
};

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
Extract invoice details from the text below.

Return ONLY valid JSON. No explanation. No extra text.

Format:
{
  "clientName": "",
  "email": "",
  "address": "",
  "items": [
    {
      "name": "",
      "quantity": 0,
      "unitPrice": 0
    }
  ]
}

Text:
${text}
`;
    // Fallback response for when AI is unavailable
    const fallbackResponse = JSON.stringify({
      clientName: "Client",
      email: "",
      address: "",
      items: []
    });

    const responseText = await callGeminiWithRetry(prompt, fallbackResponse);

    // Use regex to find the first JSON block or the entire text if no block format is used
    const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : responseText.trim();

    const parsedData = JSON.parse(cleanedJson);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    // Return fallback data instead of error
    res.status(200).json({
      clientName: "Client",
      email: "",
      address: "",
      items: []
    });
  }
  console.log("USE_AI:", process.env.USE_AI);
console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
console.log("AI OBJECT:", ai);
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

    // Fallback response for when AI is unavailable
    const fallbackResponse = `Subject: Friendly Reminder: Invoice ${invoice.invoiceNumber}

Dear ${invoice.billTo?.clientName || 'Client'},

This is a friendly reminder that invoice ${invoice.invoiceNumber} for ₹${invoice.total?.toFixed(2) || '0.00'} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.

Please let us know if you have any questions.

Thank you for your business!`;

    const reminderText = await callGeminiWithRetry(prompt, fallbackResponse);

    res.status(200).json({ reminderText });
  } catch (error) {
    console.error("Error generating reminder email with AI:", error);
    // Return fallback email instead of error
    const invoice = await Invoice.findById(invoiceId);
    const fallbackEmail = `Subject: Friendly Reminder: Invoice ${invoice?.invoiceNumber || 'Unknown'}

Dear ${invoice?.billTo?.clientName || 'Client'},

This is a friendly reminder that your invoice is due soon.

Please let us know if you have any questions.

Thank you for your business!`;
    
    res.status(200).json({ reminderText: fallbackEmail });
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

    // Fallback response for when AI is unavailable
    const fallbackResponse = JSON.stringify([
      "AI insights temporarily unavailable. Please try again later.",
      `You have ${totalInvoices} total invoices with ${totalOutstanding.toFixed(2)} outstanding.`,
      "Consider following up on unpaid invoices to improve cash flow."
    ]);

    const responseText = await callGeminiWithRetry(prompt, fallbackResponse);

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    const cleaned = jsonMatch ? jsonMatch[0] : responseText.trim();

    const insights = JSON.parse(cleaned);

    res.status(200).json({ insights });
  } catch (error) {
    console.error("Error dashboard summary with AI:", error);
    // Return fallback insights instead of error
    res.status(200).json({
      insights: [
        "AI insights temporarily unavailable. Please try again later.",
        "Continue monitoring your invoice performance regularly."
      ]
    });
  }
};

module.exports = {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
};