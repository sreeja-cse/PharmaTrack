
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "pharmacist"
  });

  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful");

      setActiveTab("login");

      setLoginData({
        email: registerData.email,
        password: ""
      });

      setRegisterData({
        name: "",
        email: "",
        password: "",
        role: "pharmacist"
      });

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">

          <div className="auth-logo-icon">
            ✚
          </div>

          <div>
            <h1>PharmaTrack</h1>
            <p>Pharmacy Management System</p>
          </div>

        </div>

        <div className="auth-tabs">

          <button
            type="button"
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>

          <button
            type="button"
            className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>

        </div>

        {activeTab === "login" ? (

          <>

            <div className="auth-heading">

              <h2>Welcome Back</h2>

              <p>
                Sign in to continue to PharmaTrack
              </p>

            </div>

            <form onSubmit={handleLogin}>

              <div className="auth-field">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />

              </div>

              <div className="auth-field">

                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />

              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

          </>

        ) : (

          <>

            <div className="auth-heading">

              <h2>Create Account</h2>

              <p>
                Register to get started with PharmaTrack
              </p>

            </div>

            <form onSubmit={handleRegister}>

              <div className="auth-field">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  required
                />

              </div>

              <div className="auth-field">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />

              </div>

              <div className="auth-field">

                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />

              </div>

              <div className="auth-field">

                <label>Role</label>

                <select
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterChange}
                >
                  <option value="pharmacist">
                    Pharmacist
                  </option>

                  <option value="user">
                    User
                  </option>
                </select>

              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

          </>

        )}

      </div>

    </div>
  );
}

export default Login;

