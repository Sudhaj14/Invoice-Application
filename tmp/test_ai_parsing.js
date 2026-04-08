/**
 * This script tests the JSON extraction logic used in aiController.js
 */

const extractJSON = (text, type = 'object') => {
  if (!text) return type === 'array' ? [] : {};

  // 1. Try to find JSON block in markdown
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  const match = jsonRegex.exec(text);
  let cleaned = match ? match[1] : text;

  // 2. If no markdown, try to find boundaries based on type
  if (!match) {
    const startChar = type === 'array' ? '[' : '{';
    const endChar = type === 'array' ? ']' : '}';
    const start = cleaned.indexOf(startChar);
    const end = cleaned.lastIndexOf(endChar);
    
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.slice(start, end + 1);
    }
  }

  try {
    const parsed = JSON.parse(cleaned.trim());
    
    if (type === 'array' && !Array.isArray(parsed)) {
      throw new Error('Expected JSON array but got ' + typeof parsed);
    }
    if (type === 'object' && (Array.isArray(parsed) || typeof parsed !== 'object')) {
      throw new Error('Expected JSON object but got ' + (Array.isArray(parsed) ? 'array' : typeof parsed));
    }
    
    return parsed;
  } catch (err) {
    console.error(`❌ JSON Extraction failed (${type}):`, err.message);
    throw new Error(`Failed to extract valid JSON ${type} from AI response`);
  }
};

// Test Cases
const runTests = () => {
  console.log("Running Extraction Tests...\n");

  // Case 1: Markdown wrapped object
  const raw1 = "Sure, here is the invoice:\n```json\n{\"clientName\": \"John Doe\", \"items\": []}\n```\nHope it helps!";
  console.log("Test 1 (Markdown Object):", JSON.stringify(extractJSON(raw1, 'object')));

  // Case 2: Array with text before/after
  const raw2 = "Here are several insights: [\"Insight 1\", \"Insight 2\"] - end.";
  console.log("Test 2 (Array with fluff):", JSON.stringify(extractJSON(raw2, 'array')));

  // Case 3: Naked JSON
  const raw3 = "{\"name\": \"test\"}";
  console.log("Test 3 (Naked JSON):", JSON.stringify(extractJSON(raw3, 'object')));

  // Case 4: Mismatch Error
  try {
    const raw4 = "[1, 2, 3]";
    extractJSON(raw4, 'object');
  } catch (e) {
    console.log("Test 4 (Expected Error):", e.message);
  }
};

runTests();
