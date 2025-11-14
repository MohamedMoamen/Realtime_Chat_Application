import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export const createEcho = () => {
  const token = localStorage.getItem("token"); 
  if (!token) console.error("Token not found in localStorage");

  const echo = new Echo({
    broadcaster: "pusher",
    key: "xhjqwabtmzgt3oqcbnsu",  // REVERB_APP_KEY
    wsHost: "127.0.0.1",
    wsPort: 8080,
    forceTLS: false,
    encrypted: false,
    enabledTransports: ["ws"],

    
    cluster: "mt1", 
    authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  // Debug logs
  echo.connector.pusher.logToConsole = true;

  echo.connector.pusher.connection.bind("state_change", function (states) {
    console.log("Pusher connection state:", states);
  });

  echo.connector.pusher.connection.bind("error", function (err) {
    console.error("Pusher connection error:", err);
  });

  window.echo = echo;
  return echo;
};

