import { useEffect, useState } from "react";
import API from "../services/api";

const FeedbackForm = () => {
  const [form, setForm] = useState({
    employee_id: "",
    strengths: "",
    improvements: "",
    sentiment: "positive",
    anonymous: false,
  });

  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/feedback/", form);
      setMessage("✅ Feedback submitted successfully!");
      setForm({
        employee_id: "",
        strengths: "",
        improvements: "",
        sentiment: "positive",
        anonymous: false,
      });
    } catch (err) {
      if (err.response?.data?.detail) {
        setMessage(`❌ ${err.response.data.detail}`);
      } else {
        setMessage("❌ Error submitting feedback.");
      }
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-title mb-1">Select Employee:</label>
          <select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="">-- Choose an employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.username} (ID: {emp.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-title mb-1">Strengths:</label>
          <textarea
            name="strengths"
            value={form.strengths}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block font-medium text-title mb-1">Improvements:</label>
          <textarea
            name="improvements"
            value={form.improvements}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block font-medium text-title mb-1">Sentiment:</label>
          <select
            name="sentiment"
            value={form.sentiment}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="anonymous"
            checked={form.anonymous}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Submit anonymously
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-title transition"
        >
          Submit Feedback
        </button>
      </form>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default FeedbackForm;
