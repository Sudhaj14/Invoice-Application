import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------- INPUT CHANGE ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ---------------- BLUR VALIDATION ----------------
  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    validateField(name, formData[name]);
  };

  // ---------------- FIELD VALIDATION ----------------
  const validateField = (name, value) => {
    let message = "";

    if (!value) message = `${name} is required`;

    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        message = "Invalid email format";
      }
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: message,
    }));

    return message === "";
  };

  // ---------------- FORM VALID ----------------
  const isFormValid = () => {
    if (!formData.email || !formData.password) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
  if (!isFormValid()) return;

  try {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const response = await axiosInstance.post(
      API_PATHS.AUTH.LOGIN,
      formData
    );

    console.log("FULL RESPONSE:", response.data);

    const { token, ...userData } = response.data;
    login(userData, token);

    setSuccess("Login successful!");
    setTimeout(() => navigate("/dashboard"), 1000);

  } catch (err) {
    console.log("ERROR:", err);
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent-purple/10 blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-blue/10 blur-[100px] -z-10"></div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)] group hover:scale-110 transition-transform duration-500">
              <FileText className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight">
              Cosmic Login
            </h1>

            <p className="text-text-secondary mt-3 font-medium">
              Welcome back to your invoice nexus
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3 ml-1">
                Identity (Email)
              </label>

              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-text-muted group-focus-within:text-accent-blue transition-colors" />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="commander@nebula.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email && touched.email
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-white/10 focus:ring-accent-blue/30 focus:border-accent-blue/50"
                  }`}
                />
              </div>

              {fieldErrors.email && touched.email && (
                <p className="text-red-400 text-xs mt-2 ml-1 font-medium">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3 ml-1">
                Access Key
              </label>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-text-muted group-focus-within:text-accent-purple transition-colors" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password && touched.password
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-white/10 focus:ring-accent-purple/30 focus:border-accent-purple/50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error/Success Feedbacks */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-xl">
                <p className="text-accent-blue text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
              className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Initiate Session
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-text-secondary font-medium">
              New to the galaxy?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-accent-blue font-bold hover:text-accent-purple transition-colors ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;