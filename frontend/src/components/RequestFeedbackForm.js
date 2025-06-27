import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const RequestFeedbackForm = () => {
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({
    manager_id: "",
    message: "",
  });

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await API.get("/users/managers");
        setManagers(res.data);
      } catch (err) {
        console.error("Failed to fetch managers:", err);
      }
    };
    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/request-feedback/", form);
      toast.success("Feedback request sent!");
      setForm({ manager_id: "", message: "" });
    } catch (err) {
      toast.error("Failed to send request.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl shadow-md max-w-md mx-auto mt-6"
    >
      <h3 className="text-lg font-bold mb-3 text-title">Request Feedback</h3>
      <select
        name="manager_id"
        value={form.manager_id}
        onChange={(e) =>
          setForm({ ...form, manager_id: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        required
      >
        <option value="">Select a manager</option>
        {managers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.username}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        value={form.message}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
        className="w-full border p-2 mb-3 resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Request message"
        required
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-title transition"
      >
        Send Request
      </button>
    </form>
  );
};

export default RequestFeedbackForm;
