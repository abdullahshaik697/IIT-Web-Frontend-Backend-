import { useState } from "react";

export default function AdmissionForm({ id = 'admission' }) {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    qualification: "",
    cnic: "",
    address: "",
    whatsapp: "",
    course: "",
    timing: "",
    message: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form Submitted Successfully ✅");
  };

  return (
    <section id={id} className="min-h-screen bg-white flex items-center justify-center px-4 py-16">

      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-10">
        
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
          Online Admission Form
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Input Fields */}
          {[
            { name: "name", placeholder: "Full Name" },
            { name: "fatherName", placeholder: "Father Name" },
            { name: "qualification", placeholder: "Qualification" },
            { name: "cnic", placeholder: "CNIC Number" },
            { name: "whatsapp", placeholder: "WhatsApp Number" },
          ].map((field, i) => (
            <input
              key={i}
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full p-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition"
            />
          ))}

          {/* DOB (Fixed Label) */}
          <div className="flex flex-col">
            <label className="text-sm text-black mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-400"
            />
          </div>

          {/* Course */}
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-400"
          >
            <option value="">Select Course</option>
            <option value="CIT">CIT</option>
            <option value="AI">Artificial Intelligence</option>
            <option value="Cyber">Cyber Security</option>
            <option value="MERN">MERN Stack</option>
          </select>

          {/* Timing */}
          <select
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            required
            className="w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-400"
          >
            <option value="">Select Timing</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="md:col-span-2 w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-400"
          />

          {/* File Upload */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm text-black">
              Upload Picture
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-xl file:bg-green-500 file:text-white file:border-none file:px-4 file:py-1 file:rounded-lg hover:file:bg-green-600"
            />
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className="md:col-span-2 w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-400"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="md:col-span-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]"
          >
            Submit Application
          </button>

        </form>
      </div>
    </section>
  );
}