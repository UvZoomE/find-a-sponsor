export const API_BASE_URL =
  window.location.hostname === "www.findasponsor.net" ||
  window.location.hostname === "findasponsor.net"
    ? "https://find-a-sponsor.onrender.com/api"
    : "http://localhost:5000/api";
