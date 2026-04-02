import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  /* ================= VALIDATIONS ================= */

  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Confirm password required";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  /* ================= HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    let error = "";

    if (name === "name") error = validateName(formData.name);
    if (name === "email") error = validateEmail(formData.email);
    if (name === "password") error = validatePassword(formData.password);
    if (name === "confirmPassword")
      error = validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      );

    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    return (
      !validateName(formData.name) &&
      !validateEmail(formData.email) &&
      !validatePassword(formData.password) &&
      !validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      )
    );
  };

  const handleSubmit = async () => {
  if (!isFormValid()) return;

  try {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const response = await axiosInstance.post(
      API_PATHS.AUTH.REGISTER,  // or whatever your path is
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
    );

    setSuccess("Account created successfully!");
    console.log(response.data);

  } catch (err) {
    console.log(err);
    setError(
      err.response?.data?.message || "Something went wrong"
    );
  } finally {
    setIsLoading(false);
  }
};

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-accent-purple/10 blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-accent-blue/10 blur-[100px] -z-10"></div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)] group hover:scale-110 transition-transform duration-500">
              <FileText className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight">
              Join the Galaxy
            </h1>

            <p className="text-text-secondary mt-3 font-medium">
              Create your cosmic account today
            </p>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3 ml-1">
                Full Name
              </label>

              <div className="relative group">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-text-muted group-focus-within:text-accent-blue transition-colors" />

                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Commander Shepard"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name && touched.name
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-white/10 focus:ring-accent-blue/30 focus:border-accent-blue/50"
                  }`}
                />
              </div>

              {fieldErrors.name && touched.name && (
                <p className="text-red-400 text-xs mt-2 ml-1 font-medium">
                  {fieldErrors.name}
                </p>
              )}
            </div>

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

              {fieldErrors.password && touched.password && (
                <p className="text-red-400 text-xs mt-2 ml-1 font-medium">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3 ml-1">
                Confirm Key
              </label>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-text-muted group-focus-within:text-accent-purple transition-colors" />

                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.confirmPassword && touched.confirmPassword
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-white/10 focus:ring-accent-purple/30 focus:border-accent-purple/50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-text-muted hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-400 text-xs mt-2 ml-1 font-medium">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Error / Success */}
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
              className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Establishing Account...
                </>
              ) : (
                <>
                  Establish Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-text-secondary font-medium">
              Already have an identity?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-accent-blue font-bold hover:text-accent-purple transition-colors ml-1"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;