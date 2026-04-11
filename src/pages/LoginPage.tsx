import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = login(formState);
    setFeedback({ type: result.success ? "success" : "error", message: result.message });

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <section className="auth_page">
      <div className="container">
        <div className="auth_shell">
          <div className="auth_panel auth_panel_featured">
            <p className="auth_eyebrow">Welcome back</p>
            <h1>Login to continue shopping faster</h1>
            <p>
              Access your saved session, review your cart, and continue exploring the storefront
              without losing context.
            </p>

            <div className="auth_feature_list">
              <div>
                <i className="fa-solid fa-bag-shopping" />
                <span>Keep your cart and browsing flow in sync.</span>
              </div>
              <div>
                <i className="fa-solid fa-bolt" />
                <span>Move faster between collections and product pages.</span>
              </div>
              <div>
                <i className="fa-solid fa-shield-heart" />
                <span>Lightweight local auth for the current project build.</span>
              </div>
            </div>
          </div>

          <div className="auth_panel auth_form_panel">
            <div className="auth_form_header">
              <p className="auth_eyebrow">Login</p>
              <h2>Sign in</h2>
              <p>Use the account credentials you created in this storefront.</p>
            </div>

            <form className="auth_form" onSubmit={handleSubmit}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </label>

              {feedback ? (
                <p className={`auth_feedback auth_feedback_${feedback.type}`}>{feedback.message}</p>
              ) : null}

              <button type="submit" className="btn auth_submit_button">
                Login <i className="fa-solid fa-right-to-bracket" />
              </button>
            </form>

            <p className="auth_switch_text">
              Need an account? <Link to="/signup">Create one here</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}