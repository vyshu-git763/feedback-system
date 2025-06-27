import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import RequestFeedbackForm from "../components/RequestFeedbackForm";
import { exportSectionAsPDF } from "../utils/exportPdf";
import PeerFeedbackForm from "../components/PeerFeedbackForm";

const EmployeeDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchMyFeedback = async () => {
    try {
      const response = await API.get("/feedback/me");
      const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setFeedbacks(sorted);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
      toast.error("Failed to fetch your feedbacks.");
    }
  };

  const acknowledge = async (id) => {
    try {
      await API.post(`/feedback/${id}/ack`);
      toast.success("Feedback acknowledged!");
      fetchMyFeedback();
    } catch (err) {
      console.error("Failed to acknowledge feedback:", err);
      toast.error("Acknowledgement failed.");
    }
  };

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  return (
    <>
      <Navbar />
      <RequestFeedbackForm />
      <PeerFeedbackForm />


      <div className="bg-arctic min-h-screen flex flex-col items-center pt-24 px-4">
        <h2 className="text-3xl font-bold mb-8 text-title text-center">Employee Dashboard</h2>

        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-600 italic">💤 No feedbacks yet. Stay tuned!</p>
        ) : (
          <>
            <button
              onClick={() => exportSectionAsPDF("employee-feedback-list", "employee_feedbacks.pdf")}
              className="mb-6 bg-frostFG text-white px-4 py-2 rounded hover:bg-title"
            >
              🖨️ Export All Feedbacks as PDF
            </button>

            <div
              className="w-full max-w-4xl flex flex-col items-center gap-6"
              id="employee-feedback-list"
            >
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow w-full max-w-md relative"
                >
                  <p className="text-xs text-gray-500 absolute top-2 right-4">
                    {format(new Date(fb.created_at), "dd MMM yyyy, hh:mm a")}
                  </p>
                  <h4 className="font-semibold text-lg mb-3 text-indigo-600">Feedback</h4>
                  <p className="mb-2">
                    <span className="font-medium text-gray-700">🎯 Strengths:</span> {fb.strengths}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium text-gray-700">🛠 Improvements:</span> {fb.improvements}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium text-gray-700">😄 Sentiment:</span>{" "}
                    <span
                      className={
                        fb.sentiment === "positive"
                          ? "text-green-600"
                          : fb.sentiment === "neutral"
                            ? "text-yellow-500"
                            : "text-red-600"
                      }
                    >
                      {fb.sentiment}
                    </span>
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-700">
                      📌 Acknowledged: {fb.acknowledged ? "Yes ✅" : "No ❌"}
                    </span>
                    {!fb.acknowledged && (
                      <button
                        className="bg-primary text-white px-3 py-1 rounded hover:bg-title"
                        onClick={() => acknowledge(fb.id)}
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EmployeeDashboard;
