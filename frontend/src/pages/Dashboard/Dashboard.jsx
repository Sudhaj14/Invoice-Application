import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, FileText, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
import AIInsightsCard from "../../components/AIInsightsCard";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );

        const invoices = response.data;

        const totalInvoices = invoices.length;

        const totalPaid = invoices
  .filter((inv) => inv.status?.toLowerCase() === "paid")
  .reduce((acc, inv) => acc + Number(inv.total || 0), 0);

const totalUnpaid = invoices
  .filter((inv) =>
    ["pending", "unpaid"].includes(inv.status?.toLowerCase())
  )
  .reduce((acc, inv) => acc + Number(inv.total || 0), 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });

        setRecentInvoices(
          invoices
            .sort(
              (a, b) =>
                new Date(b.invoiceDate) - new Date(a.invoiceDate)
            )
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "purple",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `₹${stats.totalPaid.toFixed(2)}`,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `₹${stats.totalUnpaid.toFixed(2)}`,
      color: "pink",
    },
  ];

  const colorClasses = {
    purple: { glow: "shadow-[0_0_20px_rgba(124,58,237,0.2)]", icon: "text-accent-purple", bg: "bg-accent-purple/10" },
    blue: { glow: "shadow-[0_0_20px_rgba(37,99,235,0.2)]", icon: "text-accent-blue", bg: "bg-accent-blue/10" },
    pink: { glow: "shadow-[0_0_20px_rgba(56,189,248,0.2)]", icon: "text-accent-neon", bg: "bg-accent-neon/10" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Dashboard
        </h2>
        <p className="text-text-secondary mt-2 text-lg">
          A quick overview of your business finances.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`glass-card p-6 rounded-2xl border border-white/10 ${colorClasses[stat.color].glow} transition-all duration-300 hover:scale-[1.02] hover:border-white/20`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-14 h-14 ${
                  colorClasses[stat.color].bg
                } rounded-xl flex items-center justify-center border border-white/5`}
              >
                <stat.icon
                  className={`w-7 h-7 ${
                    colorClasses[stat.color].icon
                  }`}
                />
              </div>

              <div className="ml-5 min-w-0">
                <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-white mt-1">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AIInsightsCard/>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/2">
          <h3 className="text-xl font-bold text-white">
            Recent Invoices
          </h3>
          <Button variant="secondary" size="sm" onClick={() => navigate("/invoices")}>
            View All
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-white/5">
                    Client
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-white/5">
                    Amount
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-white/5">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-white/5">
                    Due Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                    onClick={() =>
                      navigate(`/invoices/${invoice._id}`)
                    }
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors">
                        {invoice.billTo?.clientName || "N/A"}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>

                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-text-secondary">
                      ₹{invoice.total?.toFixed(2) || "0.00"}
                    </td>

                    <td className="px-8 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          invoice.status === "Paid"
                            ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                            : invoice.status === "Pending"
                            ? "bg-accent-purple/10 text-accent-purple border border-accent-purple/20"
                            : "bg-accent-pink/10 text-accent-pink border border-accent-pink/20"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-8 py-5 whitespace-nowrap text-sm text-text-muted">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <FileText className="w-10 h-10 text-text-muted" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              No invoices yet
            </h3>

            <p className="text-text-muted mb-8 max-w-sm">
              Your futuristic workspace is ready. Start by creating your first invoice.
            </p>

            <Button
              onClick={() => navigate("/invoices/new")}
              className="px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;