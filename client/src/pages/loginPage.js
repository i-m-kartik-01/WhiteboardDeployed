import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./loginPage.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [theme, setTheme] = useState("light");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN API
        const res = await api.post("/users/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/profile");
      } else {
        // REGISTER API
        await api.post("/users/register", {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        alert("Registration successful. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={`auth-container ${theme}`}>
      <div className="auth-card">
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
