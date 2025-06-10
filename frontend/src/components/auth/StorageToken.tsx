import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StorageToken = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    console.log("Token from URL:", token);

    if (token) {
      localStorage.setItem("auth_token", token);
      setStatus("Token stored, redirecting...");
    } else {
      setStatus("No token found");
    }

    setTimeout(() => {
      navigate("/");
    }, 1000); // Wait a moment so you can see the message
  }, [navigate]);

  return <div>{status}</div>;
};
export default StorageToken;