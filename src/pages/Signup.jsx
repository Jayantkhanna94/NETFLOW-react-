import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, UserRound, ArrowUpRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AuthLayout, AuthHead, Input } from "../components/UI";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [f, setF] = useState({
    name: "",
    email: "",
    role: "Student",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const strength =
    f.password.length >= 10
      ? 4
      : f.password.length >= 8
      ? 3
      : f.password.length >= 6
      ? 2
      : f.password
      ? 1
      : 0;

  function submit(e) {
    e.preventDefault();
    setErr("");

    if (f.password.length < 6) {
      return setErr("Password must contain at least 6 characters.");
    }
    if (f.password !== f.confirm) {
      return setErr("Passwords do not match.");
    }

    const result = signup({
      name: f.name,
      email: f.email,
      role: f.role,
      password: f.password,
    });

    if (result.success) {
      // Automatically log the new user into the platform and enter dashboard
      login(f.email, f.password);
      navigate("/", { replace: true });
    } else {
      setErr(result.error || "Failed to create account.");
    }
  }

  return (
    <AuthLayout
      title="Join the NetFlow network."
      desc="Create an account for smart campus monitoring, resources, alerts and telemetry."
      features={[
        "Infrastructure and device management",
        "Incident and alert visibility",
      ]}
    >
      <form className="auth-card signup-card" onSubmit={submit}>
        <AuthHead title="Create account" desc="Set up your NetFlow profile" />
        <div className="two-col">
          <div>
            <label>Full name</label>
            <Input
              icon={<User size={17} />}
              value={f.name}
              onChange={(v) => set("name", v)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label>Account type</label>
            <div className="input-wrap">
              <UserRound size={17} />
              <select
                value={f.role}
                onChange={(e) => set("role", e.target.value)}
              >
                <option>Student</option>
                <option>Faculty</option>
              </select>
            </div>
          </div>
        </div>

        <label>Email address</label>
        <Input
          icon={<Mail size={17} />}
          value={f.email}
          onChange={(v) => set("email", v)}
          type="email"
          placeholder="you@college.edu"
        />

        <div className="two-col">
          <div>
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={17} />
              <input
                value={f.password}
                onChange={(e) => set("password", e.target.value)}
                type={show ? "text" : "password"}
                placeholder="Minimum 6 characters"
                required
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <div>
            <label>Confirm password</label>
            <Input
              icon={<Lock size={17} />}
              value={f.confirm}
              onChange={(v) => set("confirm", v)}
              type={show ? "text" : "password"}
              placeholder="Repeat password"
            />
          </div>
        </div>

        <div className="strength">
          <div>
            {[1, 2, 3, 4].map((i) => (
              <i key={i} className={i <= strength ? "filled" : ""} />
            ))}
          </div>
          <span>
            {["Password strength", "Weak", "Fair", "Good", "Strong"][strength]}
          </span>
        </div>

        {err && <div className="form-error">{err}</div>}

        <label className="check-line">
          <input type="checkbox" required />{" "}
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>

        <button className="auth-submit">
          Create account <ArrowUpRight size={17} />
        </button>

        <div className="auth-login-line">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export { Signup };
