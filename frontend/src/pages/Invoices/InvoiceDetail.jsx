import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { Loader2, Edit, Printer, AlertCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";

import CreateInvoice from "./CreateInvoice";
import Button from "../../components/ui/Button";
// import ReminderModal from "../../components/invoices/ReminderModal";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const invoiceRef = useRef();

  /* ---------------------------------------------------- */
  /* FETCH INVOICE */
  /* ---------------------------------------------------- */

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_INVOICE_BY_ID(id)
        );

        setInvoice(response.data);
      } catch (error) {
        toast.error("Failed to fetch invoice.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  /* ---------------------------------------------------- */
  /* UPDATE INVOICE */
  /* ---------------------------------------------------- */

  const handleUpdate = async (formData) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(id),
        formData
      );

      toast.success("Invoice updated successfully!");
      setInvoice(response.data);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update invoice.");
      console.error(error);
    }
  };

  /* ---------------------------------------------------- */
  /* PRINT */
  /* ---------------------------------------------------- */

  const handlePrint = () => {
    window.print();
  };

  /* ---------------------------------------------------- */
  /* STATES */
  /* ---------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center py-12 text-center bg-slate-50 rounded-lg">
        <AlertCircle className="w-10 h-10 text-red-600 mb-3" />
        <h3 className="text-lg font-medium text-slate-900">
          Invoice Not Found
        </h3>

        <Button onClick={() => navigate("/invoices")}>
          Back to All Invoices
        </Button>
      </div>
    );
  }

  /* ---------------------------------------------------- */
  /* EDIT MODE */
  /* ---------------------------------------------------- */

  if (isEditing) {
    return (
      <CreateInvoice existingInvoice={invoice} onSave={handleUpdate} />
    );
  }

  /* ---------------------------------------------------- */
  /* UI */
  /* ---------------------------------------------------- */

  return (
    <div className="pb-20">
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoice={invoice}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Invoice Details
          </h1>
          <p className="text-text-secondary mt-2 font-mono">
            ID: <span className="text-accent-blue">{invoice.invoiceNumber}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {invoice.status !== "Paid" && (
            <Button
              variant="secondary"
              onClick={() => setIsReminderModalOpen(true)}
            >
              <Mail className="w-4 h-4 mr-2 text-accent-blue" />
              Send Reminder
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2 text-accent-purple" />
            Edit
          </Button>

          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print / Download
          </Button>
        </div>
      </div>

      {/* INVOICE PREVIEW */}
      <div id="invoice-content-wrapper" className="print-area">
        <div
          ref={invoiceRef}
          id="invoice-preview"
          className="glass-card p-8 sm:p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Nebula for Preview */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 blur-[80px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/5 blur-[80px] -z-10"></div>

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between border-b border-white/10 pb-10 gap-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">INVOICE</h2>
              <p className="text-text-muted mt-2 text-lg font-mono">
                #{invoice.invoiceNumber}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Current Status</p>

              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                  invoice.status === "Paid"
                    ? "bg-accent-blue/10 text-accent-neon border border-accent-blue/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                    : invoice.status === "Pending"
                    ? "bg-accent-purple/10 text-accent-purple border border-accent-purple/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                    : "bg-accent-pink/10 text-accent-pink border border-accent-pink/20 shadow-[0_0_15px_rgba(255,100,100,0.1)]"
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          {/* BILL INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 my-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent-purple mb-4">
                Sender Information
              </h3>
              <div className="space-y-1 text-text-secondary">
                <p className="text-white font-bold text-lg">{invoice.billFrom.businessName}</p>
                <p className="text-[15px]">{invoice.billFrom.address}</p>
                <p className="text-[15px]">{invoice.billFrom.email}</p>
                <p className="text-[15px]">{invoice.billFrom.phone}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent-blue mb-4">
                Recipient Details
              </h3>
              <div className="space-y-1 text-text-secondary">
                <p className="text-white font-bold text-lg">{invoice.billTo.clientName}</p>
                <p className="text-[15px]">{invoice.billTo.address}</p>
                <p className="text-[15px]">{invoice.billTo.email}</p>
                <p className="text-[15px]">{invoice.billTo.phone}</p>
              </div>
            </div>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-6 rounded-2xl bg-white/2 border border-white/5 my-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Issue Date</h3>
              <p className="text-white font-medium">
                {moment(invoice.invoiceDate).format("MMMM DD, YYYY")}
              </p>
            </div>

            <div className="border-l border-white/5 sm:pl-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Due Date</h3>
              <p className="text-white font-medium">
                {moment(invoice.dueDate).format("MMMM DD, YYYY")}
              </p>
            </div>

            <div className="border-l border-white/5 sm:pl-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Terms</h3>
              <p className="text-white font-medium">{invoice.paymentTerms}</p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="bg-white/2 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Item Description</th>
                  <th className="px-8 py-4 text-center text-xs font-bold text-text-muted uppercase tracking-widest">Qty</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-widest">Unit Price</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-widest">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="group hover:bg-white/2 transition-colors">
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-white tracking-wide">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-sm font-medium text-text-secondary">
                      {item.quantity}
                    </td>
                    <td className="px-8 py-5 text-right text-sm font-medium text-text-secondary">
                      ₹{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-8 py-5 text-right text-sm font-bold text-white">
                      ₹{(
                        (item.quantity || 0) *
                        (item.unitPrice || 0) *
                        (1 + (item.taxPercent || 0) / 100)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="flex justify-end mt-12">
            <div className="w-full max-w-sm space-y-4">
              <div className="flex justify-between items-center text-text-secondary px-2">
                <span className="text-sm font-medium uppercase tracking-widest">Subtotal</span>
                <span className="font-mono">₹{invoice.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-text-secondary px-2">
                <span className="text-sm font-medium uppercase tracking-widest">Tax Combined</span>
                <span className="font-mono">₹{invoice.taxTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center bg-accent-blue/5 p-5 rounded-2xl border border-accent-blue/20 shadow-[0_0_30px_rgba(37,99,235,0.05)] transition-all hover:bg-accent-blue/10">
                <span className="text-lg font-black text-white uppercase tracking-tighter">Grand Total</span>
                <span className="text-2xl font-black text-accent-neon font-mono tracking-tighter">₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* NOTES */}
          {invoice.notes && (
            <div className="mt-16 pt-10 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Additional Notes</h3>
              <div className="p-6 rounded-2xl bg-white/2 border border-white/5 text-text-secondary italic text-[15px] leading-relaxed">
                {invoice.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default InvoiceDetail;