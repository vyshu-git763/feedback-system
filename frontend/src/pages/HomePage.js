import { useNavigate } from "react-router-dom";
import { UserIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const HomePage = () => {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-arctic flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-title mb-4">DPDZero 🚀</h1>
      <p className="text-lg text-gray-700 mb-10 italic">"Because feedback shouldn't feel like a root canal 🦷"</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div
          onClick={() => navigate("/login?role=manager")}
          className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 text-center"
        >
          <BriefcaseIcon className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold text-title mb-2">Manager Login</h2>
          <p className="text-sm text-gray-600">Oversee, analyze, and motivate. Be the mentor you wish you had. 💼</p>
        </div>

        <div
          onClick={() => navigate("/login?role=employee")}
          className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 text-center"
        >
          <UserIcon className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold text-title mb-2">Employee Login</h2>
          <p className="text-sm text-gray-600">Request. Reflect. Rise. Your growth story starts here. 📈</p>
        </div>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        Built with 💜 for a better feedback culture.
      </footer>
    </div>
  );
};

export default HomePage;