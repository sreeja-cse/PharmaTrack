import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_URL from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "pharmacist"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Registration failed");

        return;

      }

      alert("Registration successful");

      navigate("/");

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

          <Link
            to="/"
            className="auth-tab"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="auth-tab active"
          >
            Register
          </Link>

        </div>

        <div className="auth-heading">

          <h2>Create Account</h2>

          <p>
            Register to access PharmaTrack
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="auth-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
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
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/">
            Sign In
          </Link>

        </div>

      </div>

    </div>

  );

}

export default Register;