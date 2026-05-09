import { useState } from "react";
import {
  Heart,
  Smartphone,
  Banknote,
  CreditCard,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function DonateUs() {
  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("jazzcash");
  const [type, setType] = useState("zakat");
  const [step, setStep] = useState(1);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const presetAmounts = [500, 1000, 2000, 5000];

  const campaigns = [
    "Flood Relief",
    "Education Support",
    "Food Program",
    "Orphan Care",
  ];

  const handleSubmit = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Donate & Help People ❤️
        </h1>
        <p className="text-gray-600 mt-2">
          100% transparent and secure donation system
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            {/* TYPE */}
            <h3 className="font-semibold mb-3">Donation Type</h3>
            <div className="flex gap-2 mb-5">
              {["zakat", "sadqa", "general"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-lg border ${
                    type === t
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* CAMPAIGN */}
            <h3 className="font-semibold mb-3">Campaign</h3>
            <select className="w-full border rounded-lg px-3 py-2 mb-5">
              {campaigns.map((c, i) => (
                <option key={i}>{c}</option>
              ))}
            </select>

            {/* AMOUNT */}
            <h3 className="font-semibold mb-3">Amount</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setAmount(amt);
                    setCustom("");
                  }}
                  className={`py-2 rounded-lg border ${
                    amount === amt
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-50"
                  }`}
                >
                  Rs {amt}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Custom amount"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setAmount(Number(e.target.value));
              }}
              className="w-full border rounded-lg px-3 py-2 mb-5"
            />

            <button
              onClick={() => setStep(2)}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {/* USER INFO */}
            <h3 className="font-semibold mb-3">Your Details</h3>

            <input
              placeholder="Name"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) =>
                setUser({ ...user, phone: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="w-full border p-2 rounded mb-5"
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />

            {/* PAYMENT */}
            <h3 className="font-semibold mb-3">Payment Method</h3>

            {["jazzcash", "easypaisa", "bank", "card"].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`w-full p-3 mb-2 border rounded-lg ${
                  method === m ? "bg-green-50 border-green-500" : ""
                }`}
              >
                {m}
              </button>
            ))}

            {/* PAYMENT INFO */}
            <div className="bg-gray-100 p-4 rounded mt-4 text-sm">
              {method === "jazzcash" && (
                <p>Send to JazzCash: 0300-1234567</p>
              )}
              {method === "easypaisa" && (
                <p>Send to EasyPaisa: 0300-1234567</p>
              )}
              {method === "bank" && (
                <>
                  <p>Bank: Meezan Bank</p>
                  <p>Account: 123456789</p>
                </>
              )}
              {method === "card" && (
                <p>Card payment integration required</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg"
            >
              Confirm Donation
            </button>
          </>
        )}

        {/* STEP 3 SUCCESS */}
        {step === 3 && (
          <div className="text-center py-10">
            <CheckCircle size={50} className="text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              Thank You ❤️
            </h2>
            <p className="text-gray-600 mt-2">
              Your donation of Rs {amount} has been recorded.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}