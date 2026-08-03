import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./page/home/components/Navbar"

const API_BASE_URL = "https://buildsphere-backend.onrender.com";

const SPECIALTIES = [
  { value: "Civil Engineering", key: "spec_civil" },
  { value: "Structural Engineering", key: "spec_structural" },
  { value: "Mechanical Engineering", key: "spec_mechanical" },
  { value: "Electrical Engineering", key: "spec_electrical" },
  { value: "Software Engineering", key: "spec_software" },
  { value: "Architectural Engineering", key: "spec_architectural" },
  { value: "Environmental Engineering", key: "spec_environmental" },
  { value: "Industrial Engineering", key: "spec_industrial" },
  { value: "Chemical Engineering", key: "spec_chemical" },
  { value: "Other", key: "spec_other" },
];

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { score: 1, label: t("register.strength_weak"), color: "bg-red-500" },
      { score: 2, label: t("register.strength_fair"), color: "bg-yellow-500" },
      { score: 3, label: t("register.strength_good"), color: "bg-blue-500" },
      { score: 4, label: t("register.strength_strong"), color: "bg-green-500" },
    ];
    return levels[score - 1] || { score: 0, label: "", color: "" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!formData.name.trim()) return t("register.err_full_name");
    if (!formData.email.trim()) return t("register.err_email");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return t("register.err_valid_email");
    if (!formData.specialty) return t("register.err_specialty");
    if (formData.password.length < 8) return t("register.err_password_len");
    if (formData.password !== formData.confirmPassword) return t("register.err_password_match");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role || "USER",
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        dataToSend
      );

      const token = response.data?.token || response.data?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/projects");
      } else {
        console.warn("Token not found in response structure:", response.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || t("register.err_reg_failed");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { step: "01", title: t("register.step1_title"), desc: t("register.step1_desc") },
    { step: "02", title: t("register.step2_title"), desc: t("register.step2_desc") },
    { step: "03", title: t("register.step3_title"), desc: t("register.step3_desc") },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Navbar navLinks={[]} />
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 border-r border-gray-800">

        <div className="pt-20">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            {t("register.join_the")}<br />
            <span className="text-blue-400">{t("register.engineering")}</span><br />
            {t("register.community")}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            {t("register.description")}
          </p>

          <div className="mt-10 space-y-5">
            {steps.map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="text-blue-500 font-bold text-xs mt-0.5 w-6 flex-shrink-0">{item.step}</span>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs">{t("register.copyright")}</p>
      </div>

      {/* Right Panel: Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 pt-20">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white mb-1">{t("register.create_account_title")}</h2>
            <p className="text-gray-400 text-sm">{t("register.create_account_subtitle")}</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("register.full_name_label")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("register.full_name_placeholder")}
                required
                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("register.email_label")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("register.email_placeholder")}
                required
                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("register.specialty_label")}</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-600">{t("register.specialty_placeholder")}</option>
                {SPECIALTIES.map((s) => (
                  <option key={s.value} value={s.value}>{t(`register.${s.key}`)}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("register.password_label")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("register.password_placeholder")}
                  required
                  className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.score ? passwordStrength.color : "bg-gray-700"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("register.password_strength")}{" "}
                    <span className={
                      passwordStrength.score >= 3 ? "text-green-400" :
                        passwordStrength.score === 2 ? "text-yellow-400" : "text-red-400"
                    }>
                      {passwordStrength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("register.confirm_password_label")}</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("register.confirm_password_placeholder")}
                  required
                  className={`w-full bg-gray-900 border text-white placeholder-gray-600 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-1 transition-colors ${formData.confirmPassword && formData.confirmPassword !== formData.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : formData.confirmPassword && formData.confirmPassword === formData.password
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                      : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                <p className="text-xs text-red-400 mt-1">{t("register.passwords_no_match")}</p>
              )}
              {formData.confirmPassword && formData.confirmPassword === formData.password && (
                <p className="text-xs text-green-400 mt-1">{t("register.passwords_match")}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-0.5 rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-950 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer leading-relaxed">
                {t("register.agree_to")} <span className="text-blue-400 hover:text-blue-300">{t("register.terms")}</span> {t("register.and")} <span className="text-blue-400 hover:text-blue-300">{t("register.privacy_policy")}</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {t("register.creating_account")}
                </>
              ) : (
                t("register.create_account_btn")
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {t("register.already_have_account")}{" "}
            <Link to="/Login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              {t("register.sign_in")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}