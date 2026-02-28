import React, { useState } from "react";

const Auth = ({ setToken, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(
        `https://expense-tracker-qhlb.vercel.app${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
        } else {
          setError("");
          setIsLogin(true);
          alert(
            "Registration successful! Please log in with your credentials.",
          );
        }
      } else {
        setError(
          data.msg + (data.error ? `: ${data.error}` : "") ||
            "Something went wrong",
        );
      }
    } catch (err) {
      setError("Connection failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <div className="glass-card" style={{ width: "100%", maxWidth: "400px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "2rem",
          }}
        >
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        {error && (
          <p
            style={{
              color: "var(--danger)",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
        <form onSubmit={onSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <input
                className="input-field"
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input
              className="input-field"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <button className="btn" style={{ width: "100%", marginTop: "1rem" }}>
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
