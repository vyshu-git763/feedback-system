import { useEffect, useState } from "react";
import API from "../services/api";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ManagerTeamFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchTeamFeedback = async () => {
    try {
      const res = await API.get("/feedback/team");
      setFeedbacks(res.data);
    } catch (err) {
      toast.error("Failed to load team feedback");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeamFeedback();
  }, []);

  return (
    <div className="bg-sky-50 p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">🧑‍💼 Team Feedback History</h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500 italic">No feedback given yet.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white p-4 rounded-xl shadow border-l-4 border-indigo-400 relative"
            >
              <p className="absolute top-2 right-4 text-sm text-gray-400">
                {format(new Date(fb.created_at), "dd MMM yyyy, hh:mm a")}
              </p>
              <h4 className="font-bold text-lg text-indigo-600 mb-2">
                Feedback for Employee ID #{fb.employee_id}
              </h4>
              <p><strong>🎯 Strengths:</strong> {fb.strengths}</p>
              <p><strong>🛠 Improvements:</strong> {fb.improvements}</p>
              <p>
                <strong>😄 Sentiment:</strong>{" "}
                <span className={
                  fb.sentiment === "positive"
                    ? "text-green-600"
                    : fb.sentiment === "neutral"
                    ? "text-yellow-600"
                    : "text-red-600"
                }>
                  {fb.sentiment}
                </span>
              </p>
              <p><strong>🔒 Anonymous:</strong> {fb.anonymous ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerTeamFeedbackList;
