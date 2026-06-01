import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, AlertCircle } from "lucide-react";

// Predefined Country Code configuration for Phone Inputs
const COUNTRIES = [
  { code: "", length: 11, name: "Select Country"},
  { code: "+93", length: 9, name: "Afghanistan", flag: "🇦🇫" },
  { code: "+213", length: 9, name: "Algeria", flag: "🇩🇿" },
  { code: "+973", length: 8, name: "Bahrain", flag: "🇧🇭" },
  { code: "+880", length: 10, name: "Bangladesh", flag: "🇧🇩" },
  { code: "+20", length: 10, name: "Egypt", flag: "🇪🇬" },
  { code: "+91", length: 10, name: "India", flag: "🇮🇳" },
  { code: "+62", length: 10, lengthMax: 11, name: "Indonesia", flag: "🇮🇩" },
  { code: "+98", length: 10, name: "Iran", flag: "🇮🇷" },
  { code: "+964", length: 10, name: "Iraq", flag: "🇮🇶" },
  { code: "+962", length: 9, name: "Jordan", flag: "🇯🇴" },
  { code: "+965", length: 8, name: "Kuwait", flag: "🇰🇼" },
  { code: "+60", length: 9, lengthMax: 10, name: "Malaysia", flag: "🇲🇾" },
  { code: "+212", length: 9, name: "Morocco", flag: "🇲🇦" },
  { code: "+968", length: 8, name: "Oman", flag: "🇴🇲" },
  { code: "+92", length: 10, name: "Pakistan", flag: "🇵🇰" },
  { code: "+974", length: 8, name: "Qatar", flag: "🇶🇦" },
  { code: "+966", length: 9, name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+252", length: 9, name: "Somalia", flag: "🇸🇴" },
  { code: "+249", length: 9, name: "Sudan", flag: "🇸🇩" },
  { code: "+963", length: 9, name: "Syria", flag: "🇸🇾" },
  { code: "+90", length: 10, name: "Turkey", flag: "🇹🇷" },
  { code: "+971", length: 9, name: "UAE", flag: "🇦🇪" },
  { code: "+44", length: 10, name: "UK", flag: "🇬🇧" },
  { code: "+1", length: 10, name: "USA/Canada", flag: "🇺🇸/🇨🇦" },
  { code: "+967", length: 9, name: "Yemen", flag: "🇾🇪" },
  { code: "+27", length: 9, name: "South Africa", flag: "🇿🇦" },
  { code: "+33", length: 9, name: "France", flag: "🇫🇷" },
  { code: "+49", length: 10, name: "Germany", flag: "🇩🇪" },
  { code: "+61", length: 9, name: "Australia", flag: "🇦🇺" },
  { code: "+81", length: 10, name: "Japan", flag: "🇯🇵" },
  { code: "+86", length: 11, name: "China", flag: "🇨🇳" },
  { code: "+234", length: 10, name: "Nigeria", flag: "🇳🇬" },
  { code: "+254", length: 9, name: "Kenya", flag: "🇰🇪" }
];

interface EnrollFormProps {
  formspreeId?: string;
  className?: string;
}

export default function EnrollForm({ 
  formspreeId = "mdayeawn",
  className = "" 
}: EnrollFormProps) {
  // Form State
  const [enrollName, setEnrollName] = useState("");
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrollCountry, setEnrollCountry] = useState("");
  const [enrollPhone, setEnrollPhone] = useState("");
  const [enrollCourse, setEnrollCourse] = useState("");
  const [enrollStudent, setEnrollStudent] = useState("child");
  const [enrollMessage, setEnrollMessage] = useState("");

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [phoneFeedback, setPhoneFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Determine phone input placeholders & requirements dynamically
  const activeCountry = COUNTRIES.find(c => c.code === enrollCountry) || { length: 10, lengthMax: 10 };
  const minDigits = activeCountry.length;
  const maxDigits = activeCountry.lengthMax || activeCountry.length;

  // Run customized phone code validation
  const handlePhoneChange = (val: string) => {
    // Only permit digits
    const cleaned = val.replace(/\D/g, "");
    setEnrollPhone(cleaned);

    if (cleaned.length > 0 && (cleaned.length < minDigits || cleaned.length > maxDigits)) {
      setPhoneFeedback(`Digits count should match ${minDigits}${maxDigits > minDigits ? `-${maxDigits}` : ""} digits.`);
    } else {
      setPhoneFeedback("");
    }
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify phone digit validation (optional, so skipped validation if blank)
    if (enrollPhone.length > 0 && (enrollPhone.length < minDigits || enrollPhone.length > maxDigits)) {
      setPhoneFeedback("Please confirm phone number format is correct.");
      return;
    }

    setFormStatus("submitting");
    setErrorMessage("");

    try {
      const formatData = new FormData();
      formatData.append("name", enrollName);
      formatData.append("email", enrollEmail);
      if (enrollPhone) {
        formatData.append("phone", `${enrollCountry} ${enrollPhone}`);
      }
      formatData.append("course", enrollCourse);
      formatData.append("student", enrollStudent);
      formatData.append("message", enrollMessage);

      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: formatData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        setFormStatus("success");
        // Reset Inputs
        setEnrollName("");
        setEnrollEmail("");
        setEnrollPhone("");
        setEnrollCourse("");
        setEnrollMessage("");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Formspree returned an integration error.");
      }
    } catch (err: any) {
      console.error(err);
      setFormStatus("error");
      setErrorMessage(err?.message || "There was an issue sending your message. Please check connection and try again.");
    }
  };

  return (
    <div className={`enroll-form-container relative ${className}`}>
      {/* Success banner or standard Form */}
      <AnimatePresence mode="wait">
        {formStatus === "success" ? (
          <motion.div 
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center p-8 bg-[rgba(240,237,232,0.5)] rounded-2xl border border-[var(--color-border)] min-h-[400px]"
            id="success-banner"
          >
            <div className="w-16 h-16 bg-[#064E3B] text-white flex items-center justify-center rounded-full mb-6 shadow-md shadow-[#064e3b]/10">
              <Check className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-bold font-heading text-[#064E3B] mb-3">
              Application Received!
            </h3>
            
            <p className="text-[var(--color-text-muted)] font-sans max-w-sm mb-8 leading-relaxed">
              Thank you for enrolling. Your application has been sent safely and our coordinators will reach out using your provided contact details very soon!
            </p>

            <button
              onClick={() => setFormStatus("idle")}
              className="btn btn-primary inline-flex items-center justify-center h-11 px-6 font-semibold text-sm rounded-lg hover:bg-opacity-95 active:scale-95 transition-all duration-300 leading-none cursor-pointer"
            >
              Submit Another Request
            </button>
          </motion.div>
        ) : (
          <motion.form 
            key="form-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="enroll-form" 
            onSubmit={handleSubmit} 
            id="enrollment-submission-form"
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="text-sm font-semibold text-[var(--color-text)]">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  disabled={formStatus === "submitting"}
                  placeholder="Your name"
                  value={enrollName}
                  onChange={e => setEnrollName(e.target.value)}
                  className="mt-1 transition duration-200"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="text-sm font-semibold text-[var(--color-text)]">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  disabled={formStatus === "submitting"}
                  placeholder="your@email.com"
                  value={enrollEmail}
                  onChange={e => setEnrollEmail(e.target.value)}
                  className="mt-1 transition duration-200"
                />
              </div>
            </div>

            {/* Country and phone compilation */}
            <div className="form-row form-row-phone">
              <div className="form-group form-group-country">
                <label htmlFor="country-code" className="text-sm font-semibold text-[var(--color-text)]">Country Code</label>
                <select 
                  id="country-code" 
                  name="country_code"
                  disabled={formStatus === "submitting"}
                  value={enrollCountry}
                  onChange={e => {
                    setEnrollCountry(e.target.value);
                    setEnrollPhone("");
                    setPhoneFeedback("");
                  }}
                  className="mt-1 transition duration-200"
                >
                  {COUNTRIES.map(ct => (
                    <option key={ct.code} value={ct.code}>{ct.flag} {ct.name} {ct.code}</option>
                  ))}
                </select>
              </div>
              <div className="form-group form-group-phone">
                <label htmlFor="phone" className="text-sm font-semibold text-[var(--color-text)]">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  disabled={formStatus === "submitting"}
                  placeholder={`Enter ${minDigits}${maxDigits > minDigits ? `-${maxDigits}` : ""} digits`}
                  pattern="[0-9]*" 
                  inputMode="numeric" 
                  maxLength={maxDigits}
                  value={enrollPhone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  className="mt-1 transition duration-200"
                />
              </div>
            </div>

            {/* Digits length helper / errors */}
            {phoneFeedback && (
              <p className="text-xs text-amber-600 block mt-[-0.5rem] mb-4 ml-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {phoneFeedback}
              </p>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course" className="text-sm font-semibold text-[var(--color-text)]">Select Course</label>
                <select 
                  id="course" 
                  name="course" 
                  required
                  disabled={formStatus === "submitting"}
                  value={enrollCourse}
                  onChange={e => setEnrollCourse(e.target.value)}
                  className="mt-1 transition duration-200"
                >
                  <option value="">Choose a course</option>
                  <option value="tahfeez">Tahfeez (Memorization)</option>
                  <option value="reading">Reading</option>
                  <option value="noorani">Noorani Qaida</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="student" className="text-sm font-semibold text-[var(--color-text)]">Student Type</label>
                <select 
                  id="student" 
                  name="student"
                  disabled={formStatus === "submitting"}
                  value={enrollStudent}
                  onChange={e => setEnrollStudent(e.target.value)}
                  className="mt-1 transition duration-200"
                >
                  <option value="child">Child</option>
                  <option value="adult">Adult</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="text-sm font-semibold text-[var(--color-text)]">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                required 
                disabled={formStatus === "submitting"}
                placeholder="Any questions, preferred schedule, or special requests..."
                value={enrollMessage}
                onChange={e => setEnrollMessage(e.target.value)}
                className="mt-1 transition duration-200"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full inline-flex items-center justify-center gap-2 font-semibold h-12 py-0 relative overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-85 leading-none cursor-pointer"
              disabled={formStatus === "submitting"}
              id="enroll-submit-button"
            >
              {formStatus === "submitting" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="leading-none">Submitting request...</span>
                </>
              ) : (
                <span className="leading-none">Submit Enrollment</span>
              )}
            </button>

            {formStatus === "error" && (
              <div className="bg-red-50 text-red-600 text-xs rounded-lg p-3.5 mt-4 border border-red-100 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
