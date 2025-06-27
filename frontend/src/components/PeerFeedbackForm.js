import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const PeerFeedbackForm = () => {
  const [peers, setPeers] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    strengths: "",
    improvements: "",
    sentiment: "positive",
    anonymous: false,
  });

  useEffect(() => {
    const fetchPeers = async () => {
      try {
        const res = await API.get("/employees");
        setPeers(res.data);
      } catch (err) {
        console.error("Error fetching peers", err);
        toast.error("Failed to load peer list.");
      }
    };

    fetchPeers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/feedback/", form);
      toast.success("Peer feedback submitted!");
      setForm({
        employee_id: "",
        strengths: "",
        improvements: "",
        sentiment: "positive",
        anonymous: false,
      });
    } catch (err) {
      console.error("Feedback submit error", err);
      toast.error("Failed to submit feedback.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-10">
      <h3 className="text-xl font-semibold text-title mb-4">🤝 Peer Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium text-gray-700 mb-1">Select Peer</label>
          <select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="">-- Choose a peer --</option>
            {peers.map((peer) => (
              <option key={peer.id} value={peer.id}>
                {peer.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">🎯 Strengths</label>
          <textarea
            name="strengths"
            value={form.strengths}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">🛠 Improvements</label>
          <textarea
            name="improvements"
            value={form.improvements}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">😄 Sentiment</label>
          <select
            name="sentiment"
            value={form.sentiment}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="anonymous"
            checked={form.anonymous}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Send anonymously</label>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-title"
        >
          📤 Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default PeerFeedbackForm;
