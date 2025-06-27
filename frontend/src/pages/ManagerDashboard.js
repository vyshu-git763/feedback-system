import Navbar from "../components/Navbar";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import { useEffect, useState } from "react";
import API from "../services/api";
import FeedbackRequests from "../components/FeedbackRequests";
import { exportSectionAsPDF } from "../utils/exportPdf";
import ManagerTeamFeedbackList from "../components/ManagerTeamFeedbackList";

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [section, setSection] = useState("overview"); 

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard/manager");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />

      <main className="pt-28 px-4 md:px-8 lg:px-16 bg-arctic min-h-screen">
        <h2 className="text-4xl font-bold mb-10 text-center text-title">
          📋 Manager Dashboard
        </h2>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "requests", label: "🗂️ Requests" },
            { key: "give", label: "✍️ Give Feedback" },
            { key: "history", label: "📁 Feedback History" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`px-4 py-2 rounded-lg transition-all shadow-sm border ${
                section === key
                  ? "bg-title text-white border-title"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {section === "overview" && stats && (
          <section className="mb-10">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-title">👥 Team Overview</h3>
              <p className="mb-2 text-gray-800">
                <strong>Total Feedbacks:</strong> {stats.total_feedbacks}
              </p>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {Object.entries(stats.sentiment_summary).map(([sentiment, count]) => (
                  <p key={sentiment}>
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}:{" "}
                    <strong>{count}</strong>
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {section === "requests" && (
          <section className="mb-12">
            <FeedbackRequests />
          </section>
        )}

        {section === "give" && (
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-title">✍️ Give Feedback</h3>
            <FeedbackForm />
          </section>
        )}

        {section === "history" && (
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-title">📁 Feedback History</h3>
            <button
              onClick={() => exportSectionAsPDF("manager-feedback-list", "manager_feedbacks.pdf")}
              className="mb-4 bg-frostFG text-white px-4 py-2 rounded hover:bg-title"
            >
              🖨️ Export All Feedbacks as PDF
            </button>
            <div id="manager-feedback-list">
              <FeedbackList role="manager" />
              <ManagerTeamFeedbackList />
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ManagerDashboard;
