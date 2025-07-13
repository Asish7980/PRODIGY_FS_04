import React, { useState } from "react";
import ChatSelector from "./components/ChatSelector";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [user, setUser] = useState(null); // user = { username, token }
  const [view, setView] = useState("login"); // 'login' or 'register'

  // When user successfully logs in or registers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleRegisterSuccess = () => {
    setView("login");
  };

  if (!user) {
    return (
      <>
        {view === "login" ? (
          <Login
            setUser={handleLoginSuccess}
            onSwitchToRegister={() => setView("register")}
          />
        ) : (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setView("login")}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Welcome, {user.username}!
        </h1>
        <ChatSelector username={user.username} />
      </div>
    </div>
  );
}

export default App;
