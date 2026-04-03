import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import {
  Loader2,
  AlertCircle,
  Plus,
  Sparkles,
  Search,
  FileText,
  Edit,
  Trash2,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import Button from "../../components/ui/Button";
import CreateWithAiModal from "../../components/invoices/CreateWithAiModal";
import ReminderModal from "../../components/invoices/ReminderModal";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);

  const navigate = useNavigate();

  // ================= FETCH =================
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );

        setInvoices(
          response.data.sort(
            (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
          )
        );
      } catch (err) {
        setError("Failed to fetch invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // ================= FILTER =================
  const filteredInvoices = useMemo(() => {
  return invoices
    .filter((invoice) => {
      if (statusFilter === "All") return true;

      return (
        invoice.status?.toLowerCase().trim() ===
        statusFilter.toLowerCase().trim()
      );
    })
    .filter(
      (invoice) =>
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.billTo?.clientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
}, [invoices, searchTerm, statusFilter]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this invoice?')){
    try {
      await axiosInstance.delete(
        API_PATHS.INVOICE.DELETE_INVOICE(id)
      );
      setInvoices(invoices.filter(invoice => invoice._id !== id));
    } catch (err) {
      console.error(err);
    }}
  };

  // ================= STATUS CHANGE =================
  const handleStatusChange = async (invoice) => {
  try {
    setStatusChangeLoading(invoice._id);

    const updatedStatus =
      invoice.status === "Paid" ? "Unpaid" : "Paid";

    const response = await axiosInstance.put(
      API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id),
      { status: updatedStatus }
    );

    // ✅ use backend response (BEST PRACTICE)
    const updatedInvoice = response.data;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv._id === updatedInvoice._id ? updatedInvoice : inv
      )
    );
  } catch (err) {
    console.error("Status update error:", err);
  } finally {
    setStatusChangeLoading(null);
  }
};
  // ================= REMINDER =================
  const handleOpenReminderModal = (id) => {
    setSelectedInvoiceId(id);
    setIsReminderModalOpen(true);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-neon" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* MODALS */}
      <CreateWithAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            All Invoices
          </h1>
          <p className="text-text-secondary mt-2">
            Manage your transactions in one place
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsAiModalOpen(true)}
          >
            <Sparkles className="w-4 h-4 mr-2 text-accent-blue" />
            Create with AI
          </Button>

          <Button
            onClick={() => navigate("/invoices/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-bold text-red-400 mb-1">
                System Error
              </h3>
              <p className="text-sm text-red-300/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-text-muted absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by invoice # or client..."
                className="w-full h-11 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all appearance-none min-w-[160px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All" className="bg-background-elevated">All Statuses</option>
              <option value="Paid" className="bg-background-elevated">Paid</option>
              <option value="Pending" className="bg-background-elevated">Pending</option>
              <option value="Unpaid" className="bg-background-elevated">Unpaid</option>
            </select>
          </div>
        </div>

        {/* TABLE / EMPTY */}
        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-6">
              <FileText className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No invoices found
            </h3>
            <p className="text-text-muted mb-8 max-w-sm">
              We couldn't find any invoices matching your cosmic coordinates.
            </p>

            {invoices.length === 0 && (
              <Button
                onClick={() => navigate("/invoices/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white/2">
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10">
                    Invoice
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10">
                    Client
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10">
                    Amount
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10">
                    Due Date
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10">
                    Status
                  </th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-white/5 transition-colors group">
                    <td
                      onClick={() =>
                        navigate(`/invoices/${invoice._id}`)
                      }
                      className="px-8 py-5 cursor-pointer"
                    >
                      <span className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors">
                        {invoice.invoiceNumber}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-sm text-text-secondary">
                      {invoice.billTo?.clientName}
                    </td>

                    <td className="px-8 py-5 text-sm font-medium text-white">
                      ₹{invoice.total?.toFixed(2) || "0.00"}
                    </td>

                    <td className="px-8 py-5 text-sm text-text-muted">
                      {moment(invoice.dueDate).format(
                        "MMM DD, YYYY"
                      )}
                    </td>

                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          invoice.status === "Paid"
                            ? "bg-accent-blue/10 text-accent-neon border border-accent-blue/20"
                            : invoice.status === "Pending"
                            ? "bg-accent-purple/10 text-accent-purple border border-accent-purple/20"
                            : "bg-accent-pink/10 text-accent-neon border border-accent-pink/20"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3 flex-nowrap">
                        <button
                          onClick={() => handleStatusChange(invoice)}
                          disabled={statusChangeLoading === invoice._id}
                          className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-secondary bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                        >
                          {statusChangeLoading === invoice._id ? "..." : (invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid")}
                        </button>

                        <button
                          onClick={() =>
                            navigate("/invoices/new", {
                              state: { invoice },
                            })
                          }
                          className="p-2 bg-white/5 text-text-secondary border border-white/10 rounded-lg hover:bg-accent-blue/20 hover:text-accent-neon hover:border-accent-blue/30 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {invoice.status !== "Paid" && (
                          <button
                            onClick={() => handleOpenReminderModal(invoice._id)}
                            className="p-2 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-lg hover:bg-accent-blue hover:text-white transition-all"
                            title="Send Reminder"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default AllInvoices;