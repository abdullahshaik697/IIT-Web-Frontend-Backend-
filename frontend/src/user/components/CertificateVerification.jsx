import { useState } from "react";
import { CheckCircle, XCircle, Search, User, BookOpen, Clock, Phone, Hash } from "lucide-react";

export default function CertificateVerification({ id = 'certificate-verification' }) {
  const [certNo, setCertNo] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const certificateDatabase = [
    {
      certNo: "IIT-11111",
      status: "valid",
      student: {
        name: "Abdullah Shaikh",
        courseName: "Web Development",
        duration: "6 Months (Jan - June 2024)",
        contact: "+92 300 1234567",
        issueDate: "15 June 2024",
      }
    },
    {
      certNo: "IIT-67890",
      status: "valid",
      student: {
        name: "Ahmed ALi",
        courseName: "Artificial Intelligence",
        duration: "8 Months (March - Oct 2024)",
        contact: "+92 321 9876543",
        issueDate: "30 October 2024",
      }
    },
    {
      certNo: "IIT-11111",
      status: "valid",
      student: {
        name: "Rafay",
        courseName: "Cyber Security",
        duration: "4 Months (May - Aug 2024)",
        contact: "+92 315 4567890",
        issueDate: "25 August 2024",
      }
    },
  ];

  const handleVerify = () => {
    if (!certNo) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const found = certificateDatabase.find(
        (cert) => cert.certNo === certNo.trim()
      );

      if (found) {
        setResult(found);
      } else {
        setResult({ status: "invalid" });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <section id={id} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-10">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Certificate Verification
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your certificate number to verify authenticity
        </p>

        {/* Input */}
        <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:border-green-500 transition">
          <Search className="text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Enter Certificate Number (e.g. IIT-12345)"
            value={certNo}
            onChange={(e) => setCertNo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleVerify}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6">

            {/* ========== VALID CERTIFICATE ========== */}
            {result.status !== "invalid" ? (
              <div className="text-center">
                
                {/* Success Header */}
                <div className="text-green-600 flex flex-col items-center gap-2 mb-6">
                  <CheckCircle size={48} />
                  <p className="font-semibold text-lg">Certificate is VALID ✅</p>
                </div>

                {/* Student Details Card */}
                <div className="bg-gray-50 rounded-xl p-4 border border-green-200">
                  
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 text-left">
                    Student Details
                  </h3>

                  {/* Details List */}
                  <div className="space-y-3">
                    
                    {/* Name */}
                    <div className="flex items-center gap-3 text-left">
                      <User size={18} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Student Name</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {result.student.name}
                        </p>
                      </div>
                    </div>

                    {/* Course Name */}
                    <div className="flex items-center gap-3 text-left">
                      <BookOpen size={18} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Course Name</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {result.student.courseName}
                        </p>
                      </div>
                    </div>

                    {/* Course ID */}
                    <div className="flex items-center gap-3 text-left">
                      <Hash size={18} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Certificate No</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {result.certNo}
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3 text-left">
                      <Clock size={18} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {result.student.duration}
                        </p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-3 text-left">
                      <Phone size={18} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {result.student.contact}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Issue Date */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                       Issued on: {result.student.issueDate}
                    </p>
                  </div>

                </div>

              </div>
            ) : (
              /* ========== INVALID CERTIFICATE ========== */
              <div className="text-red-500 flex flex-col items-center gap-2 text-center">
                <XCircle size={48} />
                <p className="font-semibold text-lg">Invalid Certificate ❌</p>
                <p className="text-sm text-gray-500">
                  No record found for certificate number: <br />
                  <span className="font-semibold text-red-500">{certNo}</span>
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}