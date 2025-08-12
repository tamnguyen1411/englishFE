import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log("Token:", token);
    console.log("User:", user);
    if (!token || !user) {
      navigate("/login");
    } else {
      const parsed = JSON.parse(user);
      setUserName(parsed.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Chào mừng, {userName}!</h1>
      <p className="text-gray-600 mb-6">Bạn đã đăng nhập thành công!</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Dashboard;
