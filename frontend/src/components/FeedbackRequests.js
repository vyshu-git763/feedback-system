import { useEffect, useState } from "react";
import API from "../services/api";
import { format } from "date-fns";

const FeedbackRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/requests");
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg mt-10">
      <h3 className="text-2xl font-semibold mb-4 text-title">
        📨 Feedback Requests
      </h3>
      {requests.length === 0 ? (
        <p className="text-gray-600 italic">No feedback requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="p-4 border rounded-lg shadow-sm bg-arctic flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800">
                  <strong>From Employee ID:</strong> {req.employee_id}
                </p>
                <p className="text-gray-600 italic">
                  {req.message || "No message"}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {format(new Date(req.created_at), "dd MMM yyyy, hh:mm a")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FeedbackRequests;
