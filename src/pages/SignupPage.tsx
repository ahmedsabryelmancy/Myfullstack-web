import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, user } = useAuth();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (formState.password.length < 6) {
      setFeedback({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }

    const result = signup({
      name: formState.name,
      email: formState.email,
      password: formState.password,
    });

    setFeedback({ type: result.success ? "success" : "error", message: result.message });

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <section className="auth_page auth_page_signup">
      <div className="container">
        <div className="auth_shell">
          <div className="auth_panel auth_panel_featured">
            <p className="auth_eyebrow">Create account</p>
            <h1>Open a new customer account in seconds</h1>
            <p>
              This signup flow stores customer records locally for the current project, giving the
              app a complete front-end auth path without backend setup.
            </p>

            <div className="auth_feature_list">
              <div>
                <i className="fa-solid fa-user-plus" />
                <span>Create a reusable account tied to your email.</span>
              </div>
              <div>
                <i className="fa-solid fa-cart-shopping" />
                <span>Sign up and continue adding products right away.</span>
              </div>
              <div>
                <i className="fa-solid fa-layer-group" />
                <span>Ready to evolve into API-backed auth later.</span>
              </div>
            </div>
          </div>

          <div className="auth_panel auth_form_panel">
            <div className="auth_form_header">
              <p className="auth_eyebrow">Sign up</p>
              <h2>Create account</h2>
              <p>Set up your local storefront account and continue shopping.</p>
            </div>

            <form className="auth_form" onSubmit={handleSubmit}>
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ahmed Ali"
                  required
                />
              </label>

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
                  placeholder="At least 6 characters"
                  required
                />
              </label>

              <label>
                <span>Confirm password</span>
                <input
                  type="password"
                  value={formState.confirmPassword}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  placeholder="Repeat your password"
                  required
                />
              </label>

              {feedback ? (
                <p className={`auth_feedback auth_feedback_${feedback.type}`}>{feedback.message}</p>
              ) : null}

              <button type="submit" className="btn auth_submit_button">
                Sign up <i className="fa-solid fa-user-plus" />
              </button>
            </form>

            <p className="auth_switch_text">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}