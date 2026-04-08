import { useState } from "react";
import { Sparkles } from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextareaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateWithAiModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
  if (!text.trim()) {
    toast.error("Please paste some text to generate an invoice.");
    return;
  }

  setIsLoading(true);

  try {
    console.log("🚀 Sending request...");
    console.log("URL:", API_PATHS.AI?.PARSE_INVOICE_TEXT);
    console.log("Payload:", { text });

    const response = await axiosInstance.post(
      API_PATHS.AI.PARSE_INVOICE_TEXT,
      { text }
    );

    console.log("✅ FULL RESPONSE:", response);
console.log("✅ RESPONSE DATA:", response.data);
console.log("✅ TYPE:", typeof response.data);

    const invoiceData = response.data;

    toast.success("Invoice data extracted successfully!");
    onClose();

    navigate("/invoices/new", {
      state: { aiData: invoiceData },
    });
  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    console.error("❌ RESPONSE:", error?.response);
    console.error("❌ DATA:", error?.response?.data);
    console.error("❌ STATUS:", error?.response?.status);

    toast.error(
      error?.response?.data?.message ||
      "Failed to generate invoice from text."
    );
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="glass-card max-w-lg w-full p-8 rounded-3xl relative text-left shadow-2xl border border-white/10 overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-blue/10 blur-[60px]"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-2xl font-bold text-white flex items-center tracking-tight">
            <div className="p-2 rounded-xl bg-accent-blue/10 border border-accent-blue/20 mr-4">
              <Sparkles className="w-5 h-5 text-accent-blue" />
            </div>
            Create with AI
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 relative z-10">
          <p className="text-text-secondary leading-relaxed">
            Paste any text containing invoice details. Our cosmic AI will extract the essentials for you.
          </p>

          <TextareaField
            name="invoiceText"
            label="Inspiration Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Design consultation for Starfleet: 5 hours at ₹2000/hr..."
            rows={6}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 mt-10 relative z-10">
          <Button variant="secondary" onClick={onClose} className="px-6">
            Abort
          </Button>

          <Button onClick={handleGenerate} disabled={isLoading} className="px-8">
            {isLoading ? "Analyzing..." : "Generate Magic"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWithAiModal;