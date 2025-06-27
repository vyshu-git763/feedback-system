import { useEffect, useState } from "react";
import API from "../services/api";
import { PencilIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { format } from "date-fns";
import FeedbackComments from "./FeedbackComments";

const FeedbackList = ({ role }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    strengths: "",
    improvements: "",
    sentiment: "positive",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
          role === "manager" ? "/feedback/team" : "/feedback/me"
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };
    fetchData();
  }, [role]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setEditId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEditClick = (f) => {
    setEditId(f.id);
    setEditForm({
      strengths: f.strengths,
      improvements: f.improvements,
      sentiment: f.sentiment,
    });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/feedback/${editId}`, editForm);
      setEditId(null);
      const updated = await API.get(
        role === "manager" ? "/feedback/team" : "/feedback/me"
      );
      setFeedbacks(updated.data);
      toast.success("Feedback updated successfully!");
    } catch (err) {
      toast.error("Failed to update feedback.");
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await API.post(`/feedback/${id}/ack`);
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, acknowledged: true } : f))
      );
    } catch (err) {
      console.error("Ack error:", err);
    }
  };


  return (
    <div className="mt-6">
      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          💤 Nothing here yet... Start spreading the feedback magic! ✨
        </p>
      ) : (
        <ul className="relative border-l-2 border-dustyRose pl-4 space-y-6">
          {feedbacks
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((f) => (
              <li
                key={f.id}
                className="bg-arctic p-5 rounded-xl border-l-4 border-lilac shadow-sm relative"
              >
                <p className="text-xs text-gray-500 absolute top-2 right-4">
                  {format(new Date(f.created_at), "dd MMM yyyy, hh:mm a")}
                </p>
                <p className="mb-2">
                  <strong className="text-title">🎯 Strengths:</strong>{" "}
                  {f.strengths}
                </p>
                <p className="mb-2">
                  <strong className="text-title">🛠 Improvements:</strong>{" "}
                  {f.improvements}
                </p>
                <p className="mb-2">
                  <strong className="text-title">😄 Sentiment:</strong>{" "}
                  <span
                    className={`${
                      f.sentiment === "positive"
                        ? "text-green-600"
                        : f.sentiment === "neutral"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    {f.sentiment}
                  </span>
                </p>
                <p className="mb-2">
                  <strong className="text-title">📌 Acknowledged:</strong>{" "}
                  {f.acknowledged ? "Yes ✅" : "No ❌"}
                </p>

                {role === "manager" && (
                  <button
                    className="mt-2 inline-flex items-center text-blue-600 hover:underline"
                    onClick={() => handleEditClick(f)}
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
                {role === "employee" && !f.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(f.id)}
                    className="mt-2 text-green-600 hover:underline"
                  >
                    ✅ Acknowledge
                  </button>
                )}

                <FeedbackComments feedbackId={f.id} />
              </li>
            ))}
        </ul>
      )}

      {editId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setEditId(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2 text-title">Edit Feedback</h3>
            <textarea
              name="strengths"
              value={editForm.strengths}
              onChange={handleChange}
              placeholder="Strengths"
              className="w-full border p-2 mb-2 rounded-md"
            />
            <textarea
              name="improvements"
              value={editForm.improvements}
              onChange={handleChange}
              placeholder="Improvements"
              className="w-full border p-2 mb-2 rounded-md"
            />
            <select
              name="sentiment"
              value={editForm.sentiment}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded-md"
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            <div className="flex justify-end gap-4 mt-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="text-gray-600 hover:underline"
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
