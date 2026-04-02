import React, { useState, useEffect } from "react";
import { Loader2, Mail, Copy, Check } from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextareaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ReminderModal = ({ isOpen, onClose, invoiceId }) => {
  const [reminderText, setReminderText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      const generateReminder = async () => {
        setIsLoading(true);
        setReminderText("");

        try {
          const response = await axiosInstance.post(
            API_PATHS.AI.GENERATE_REMINDER,
            { invoiceId }
          );

          setReminderText(response.data.reminderText);
        } catch (error) {
          toast.error("Failed to generate reminder.");
          console.error("AI reminder error:", error);
          onClose();
        } finally {
          setIsLoading(false);
        }
      };

      generateReminder();
    }
  }, [isOpen, invoiceId, onClose]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reminderText);
    setHasCopied(true);
    toast.success("Reminder copied to clipboard!");

    setTimeout(() => setHasCopied(false), 2000);
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
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-purple/10 blur-[60px]"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-2xl font-bold text-white flex items-center tracking-tight">
            <div className="p-2 rounded-xl bg-accent-purple/10 border border-accent-purple/20 mr-4">
              <Mail className="w-5 h-5 text-accent-purple" />
            </div>
            AI Reminder
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4 relative z-10">
            <Loader2 className="w-10 h-10 animate-spin text-accent-purple" />
            <p className="text-text-muted animate-pulse font-medium">Crafting the perfect nudge...</p>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            <p className="text-text-secondary leading-relaxed">
              We've drafted a professional reminder for your client. Feel free to tweak it.
            </p>
            <TextareaField
              name="reminderText"
              value={reminderText}
              readOnly
              rows={8}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-4 mt-10 relative z-10">
          <Button variant="secondary" onClick={onClose} className="px-6">
            Dismiss
          </Button>

          <Button
            onClick={handleCopyToClipboard}
            disabled={!reminderText || isLoading}
            className="px-8"
          >
            {hasCopied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Draft
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;