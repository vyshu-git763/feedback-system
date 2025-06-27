import { useState, useEffect } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

const FeedbackComments = ({ feedbackId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/feedback/${feedbackId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchComments();
    fetchUser();
  }, [feedbackId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/feedback/${feedbackId}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const handleDelete = async (commentId) => {
    const confirm = window.confirm("Are you sure you want to delete this comment?");
    if (!confirm) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold mb-2 text-title">💬 Comments</h4>

      {comments.length === 0 && (
        <p className="text-sm text-gray-600">No comments yet.</p>
      )}

      <ul className="mb-3 space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="bg-arctic p-3 rounded-lg text-sm relative shadow-sm">
            <ReactMarkdown className="prose prose-sm">{c.content}</ReactMarkdown>
            <p className="text-xs text-right text-gray-500 mt-2">
              {new Date(c.created_at).toLocaleString()}
            </p>

            {user && (user.id === c.user_id || user.role === "manager") && (
              <button
                onClick={() => handleDelete(c.id)}
                className="absolute top-2 right-3 text-red-500 text-xs hover:underline"
              >
                🗑️ Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment (Markdown supported)..."
          required
        />
        <button
          type="submit"
          className="self-end bg-primary text-white px-3 py-1 rounded-md hover:bg-title text-sm transition"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default FeedbackComments;
