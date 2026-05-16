import { useState, useEffect } from "react";

export default function AdmissionForm({ id = 'admission' }) {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    qualification: "",
    cnic: "",
    address: "",
    whatsapp: "",
    email: "",
    course: "",
    message: "",
    photo: null,
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/courses");
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://localhost:5000/api/user/admission", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        alert("Application Submitted Successfully ✅");
        // Reset form
        setFormData({
          name: "",
          fatherName: "",
          dob: "",
          qualification: "",
          cnic: "",
          address: "",
          whatsapp: "",
          email: "",
          course: "",
          timing: "",
          message: "",
          photo: null,
        });
      } else {
        alert("Failed to submit application: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
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
            { name: "email", placeholder: "Email Address" },
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
            className="md:col-span-2 w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-400"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course.title}>
                {course.title}
              </option>
            ))}
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
            disabled={loading}
            className={`md:col-span-2 ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

        </form>
      </div>
    </section>
  );
}