import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";

import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextareaField";
import Button from "../../components/ui/Button";
import SelectField from "../../components/ui/SelectField";

const CreateInvoice = ({existingInvoice: propInvoice, onSave}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const existingInvoice = propInvoice || location.state?.invoice;

  const [formData, setFormData] = useState(() => {
    if (existingInvoice) {
  return {
    ...existingInvoice,
    billFrom: {
      businessName:
        existingInvoice.billFrom?.businessName ||
        user?.businessName ||
        "",
      email:
        existingInvoice.billFrom?.email ||
        user?.email ||
        "",
      address:
        existingInvoice.billFrom?.address ||
        user?.address ||
        "",
      phone:
        existingInvoice.billFrom?.phone ||
        user?.phone ||
        "",
    },
  };
}
    


    return {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      billFrom: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
      },
      billTo: {
        clientName: "",
        email: "",
        address: "",
        phone: "",
      },
      items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
      notes: "",
      paymentTerms: "Net 15",
    };
  });

  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] =
    useState(!existingInvoice);

  /* ---------------- Invoice Number Generation ---------------- */

  useEffect(() => {
  if (existingInvoice) {
    setFormData({
      ...existingInvoice,
      invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
      dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      billFrom: {
        businessName:
          existingInvoice.billFrom?.businessName ||
          user?.businessName ||
          "",
        email:
          existingInvoice.billFrom?.email ||
          user?.email ||
          "",
        address:
          existingInvoice.billFrom?.address ||
          user?.address ||
          "",
        phone:
          existingInvoice.billFrom?.phone ||
          user?.phone ||
          "",
      },
    });
    return;
  }

  const generateInvoiceNumber = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.INVOICE.GET_ALL_INVOICES
      );

      let maxNum = 0;
      res.data.forEach((inv) => {
        const num = parseInt(inv.invoiceNumber?.split("-")[1]);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      });

      const newNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;

      setFormData((prev) => ({
        ...prev,
        invoiceNumber: newNumber,
      }));
    } catch {
      toast.error("Failed to generate invoice number");
    } finally {
      setIsGeneratingNumber(false);
    }
  };

  generateInvoiceNumber();
}, [existingInvoice, user]); // ✅ added user here

useEffect(() => {
  if (user) {
    setFormData((prev) => ({
      ...prev,
      billFrom: {
        businessName:
          prev.billFrom?.businessName || user.businessName || "",
        email: prev.billFrom?.email || user.email || "",
        address: prev.billFrom?.address || user.address || "",
        phone: prev.billFrom?.phone || user.phone || "",
      },
    }));
  }
}, [user]);

  /* ---------------- Input Handler ---------------- */

const handleInputChange = (e, section = null, index = null) => {
    const { name, value } = e.target;

    // Items
    if (section === "items") {
      const updatedItems = [...formData.items];
      updatedItems[index][name] =
        name === "name" ? value : Number(value);

      setFormData({ ...formData, items: updatedItems });
    }

    else if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [name]: value },
      });
    }

    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  /* ---------------- Calculations ---------------- */

  const { subtotal, taxTotal, total } = (() => {
    let subtotal = 0;
    let taxTotal = 0;

    formData.items.forEach((item) => {
      const itemTotal =
        (item.quantity || 0) * (item.unitPrice || 0);
      subtotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });

    return { subtotal, taxTotal, total: subtotal + taxTotal };
  })();

  /* ---------------- Submit ---------------- */
const validateForm = () => {
  // Basic fields
  if (!formData.invoiceNumber) {
    toast.error("Invoice number is missing");
    return false;
  }

  if (!formData.invoiceDate) {
    toast.error("Invoice date is required");
    return false;
  }

  if (!formData.dueDate) {
    toast.error("Due date is required");
    return false;
  }

  // Bill From
  if (!formData.billFrom.businessName) {
    toast.error("Business name is required");
    return false;
  }

  // Bill To
  if (!formData.billTo.clientName) {
    toast.error("Client name is required");
    return false;
  }

  // Items validation
  for (let i = 0; i < formData.items.length; i++) {
    const item = formData.items[i];

    if (!item.name) {
      toast.error(`Item ${i + 1}: Name is required`);
      return false;
    }

    if (item.quantity <= 0) {
      toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
      return false;
    }

    if (item.unitPrice <= 0) {
      toast.error(`Item ${i + 1}: Unit price must be greater than 0`);
      return false;
    }
  }

  return true;
};
 const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔥 VALIDATION CHECK
  if (!validateForm()) return;

  setLoading(true);

  try {
  if (existingInvoice && !onSave) {
    await axiosInstance.put(
      API_PATHS.INVOICE.UPDATE_INVOICE(existingInvoice._id),
      { ...formData, subtotal, taxTotal, total }
    );
    toast.success("Invoice updated successfully");
  } else if (onSave) {
    await onSave({ ...formData, subtotal, taxTotal, total });
  } else {
    await axiosInstance.post(
      API_PATHS.INVOICE.CREATE,
      { ...formData, subtotal, taxTotal, total }
    );
    toast.success("Invoice created successfully");
  }

  navigate("/dashboard");
} catch {
  toast.error("Something went wrong");
} finally {
  setLoading(false);
}
};
  

  return (
    <div className="pb-20">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-accent-purple/10 border border-accent-purple/20">
              <Plus className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {existingInvoice ? "Edit  Invoice" : "Forge New Invoice"}
              </h2>
              <p className="text-text-secondary mt-1 font-medium italic">
                {existingInvoice ? "Recalibrating existing transaction data" : "Transcribing a new galactic shipment"}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || isGeneratingNumber}
            className="shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
          >
            {loading ? "Processing..." : (existingInvoice ? "Finalize Changes" : "Save Invoice")}
          </Button>
        </div>

        {/* Invoice Info Bar */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-lg bg-white/2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InputField
              label="Invoice Coordinate (Number)"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              readOnly
              disabled
              placeholder={isGeneratingNumber ? "Calculating..." : ""}
            />

            <InputField
              label="Date"
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleInputChange}
            />

            <InputField
              label="Expiry (Due Date)"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Bill From / Bill To */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Bill From */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent-purple/5 blur-3xl -z-10"></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-accent-purple flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"></div>
              Origin (Sender)
            </h3>

            <div className="space-y-5">
              <InputField
                label="Sender Business"
                name="businessName"
                value={formData.billFrom?.businessName || ""}
                onChange={(e) => handleInputChange(e, "billFrom")}
              />

              <InputField
                label="Comms Channel (Email)"
                type="email"
                name="email"
                value={formData.billFrom.email}
                onChange={(e) => handleInputChange(e, "billFrom")}
              />

              <TextareaField
                label="HQ Coordinate (Address)"
                name="address"
                value={formData.billFrom.address}
                onChange={(e) => handleInputChange(e, "billFrom")}
                rows={2}
              />

              <InputField
                label="Direct Frequency (Phone)"
                name="phone"
                value={formData.billFrom.phone}
                onChange={(e) => handleInputChange(e, "billFrom")}
              />
            </div>
          </div>

          {/* Bill To */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-3xl -z-10"></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-accent-blue flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
              Destination (Recipient)
            </h3>

            <div className="space-y-5">
              <InputField
                label="Recipient Identity"
                name="clientName"
                value={formData.billTo.clientName}
                onChange={(e) => handleInputChange(e, "billTo")}
              />

              <InputField
                label="Target Channel"
                type="email"
                name="email"
                value={formData.billTo.email}
                onChange={(e) => handleInputChange(e, "billTo")}
              />

              <TextareaField
                label="Target Coordinate"
                name="address"
                value={formData.billTo.address}
                onChange={(e) => handleInputChange(e, "billTo")}
                rows={2}
              />

              <InputField
                label="Safety Frequency"
                name="phone"
                value={formData.billTo.phone}
                onChange={(e) => handleInputChange(e, "billTo")}
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl bg-white/2">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-blue border border-white/10">#</span>
              Cargo Manifest (Items)
            </h3>
            
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all flex items-center gap-2"
            >
              <Plus className="w-3 h-3" />
              Add Cargo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Name/Desc</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-text-muted uppercase tracking-widest">Qty</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-text-muted uppercase tracking-widest">Tax%</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 w-20"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 bg-white/1">
                {formData.items.map((item, index) => (
                  <tr key={index} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 min-w-[200px]">
                      <input
                        type="text"
                        name="name"
                        value={item.name}
                        onChange={(e) => handleInputChange(e, "items", index)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all font-medium"
                        placeholder="Item name..."
                      />
                    </td>

                    <td className="px-6 py-4 w-24">
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, "items", index)}
                        className="w-full text-center bg-white/5 border border-white/10 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                      />
                    </td>

                    <td className="px-6 py-4 w-32">
                      <input
                        type="number"
                        name="unitPrice"
                        value={item.unitPrice}
                        onChange={(e) => handleInputChange(e, "items", index)}
                        className="w-full text-right bg-white/5 border border-white/10 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                      />
                    </td>

                    <td className="px-6 py-4 w-24">
                      <input
                        type="number"
                        name="taxPercent"
                        value={item.taxPercent}
                        onChange={(e) => handleInputChange(e, "items", index)}
                        className="w-full text-center bg-white/5 border border-white/10 rounded-xl py-2.5 text-accent-purple font-bold focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all"
                      />
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-black text-white pr-10">
                      ₹
                      {(
                        (item.quantity || 0) *
                        (item.unitPrice || 0) *
                        (1 + (item.taxPercent || 0) / 100)
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2.5 rounded-xl text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary and Footer Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Notes & Terms */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/2 space-y-6">
            <h3 className="text-lg font-black text-white tracking-widest uppercase flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent-blue rounded-full"></div>
              Mission Notes
            </h3>

            <TextareaField
              label="Public Memo"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any additional galactic coordinates or terms..."
            />

            <SelectField
              label="Temporal Terms (Net Days)"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleInputChange}
              options={["Net 15", "Net 30", "Net 60", "Due on receipt"]}
            />
          </div>

          {/* Summation Section */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/2 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-blue/10 blur-[60px]"></div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-text-secondary px-2">
                <p className="text-sm font-bold uppercase tracking-[0.2em]">Subtotal Cargo</p>
                <p className="font-mono text-lg">₹{subtotal.toFixed(2)}</p>
              </div>

              <div className="flex justify-between items-center text-text-secondary px-2 border-b border-white/5 pb-6">
                <p className="text-sm font-bold uppercase tracking-[0.2em]">Combined Taxes</p>
                <p className="font-mono text-lg text-accent-purple/80">₹{taxTotal.toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-2 pt-4 group">
                <div className="flex justify-between items-center bg-accent-blue/5 p-8 rounded-2xl border border-white/10 shadow-inner group-hover:border-accent-blue/40 transition-all">
                  <p className="text-sm font-black text-white uppercase tracking-[0.3em] font-mono">Grand Total</p>
                  <p className="text-4xl font-black text-accent-neon tracking-tighter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] font-mono">
                    ₹{total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;