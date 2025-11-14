import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

export default function AuthPage({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      {isLogin ? <Login setToken={setToken} /> : <Register />}
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: "20px" }}>
        {isLogin ? "Create an account" : "Already have an account?"}
      </button>
    </div>
  );
}
