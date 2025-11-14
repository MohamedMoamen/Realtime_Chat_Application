import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Chat from "./components/Chat";
import api from "./api/axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { createEcho } from './echo';
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(null);

  window.createEcho = createEcho;

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCurrentUser(null);
  };
  useEffect(() => {


window.Pusher = Pusher;


const echo = new Echo({
  broadcaster: "pusher",
  key: "reverb",           
  wsHost: "127.0.0.1",     
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws"],
  cluster: "mt1",          
});

echo.connector.pusher.logToConsole = true; // تفعيل debug في console
window.echo = echo;


window.echo.channel("test").listen("TestEvent", (e) => console.log("Got event:", e));
}, []);

  useEffect(() => {
    if (token) {
      api.get("/user", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCurrentUser(res.data))
        .catch(() => logout());
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token && currentUser ? <Navigate to="/chat" /> : <AuthPage setToken={setToken} />} />
        <Route path="/chat" element={token && currentUser ? <Chat token={token} currentUser={currentUser} logout={logout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
