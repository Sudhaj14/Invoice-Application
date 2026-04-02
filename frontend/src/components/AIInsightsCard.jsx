import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY
        );

        setInsights(response.data.insights || []);
      } catch (error) {
        console.error("Failed to fetch AI insights", error);
        setInsights([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl overflow-hidden relative group">
      {/* Decorative Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-purple/10 blur-[60px] group-hover:bg-accent-purple/20 transition-all duration-700"></div>
      
      <div className="flex items-center mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-accent-purple/10 border border-accent-purple/20 mr-4 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
          <Lightbulb className="w-5 h-5 text-accent-purple" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          AI Insights
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse relative z-10">
          <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
          <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
          <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
        </div>
      ) : (
        <ul className="space-y-4 relative z-10">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start text-text-secondary group/item">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-blue/40 mt-2 mr-3 flex-shrink-0 group-hover/item:bg-accent-blue transition-colors"></span>
              <span className="text-[15px] leading-relaxed group-hover/item:text-text-primary transition-colors">
                {insight}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AIInsightsCard;