import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AuthPage.css";

function AuthPage() {
  const [mode, setMode] = useState("signin");

  //Forgot Password
  const [forgotPassword, setForgotPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");

  const navigate = useNavigate();


  // Google Client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Google Sign In response
  const handleGoogleResponse = async (response) => {
    try {
      const result = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
        }
      );

      const data = await result.json();

      if (!result.ok) {
        setMessage(data.message || "Google login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage("Google login successful");

      navigate("/dashboard");
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  // Initialize Google Sign In
  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !googleClientId) {
        return;
      }

      const googleButton = document.getElementById(
        "google-signin-button"
      );

      if (!googleButton) {
        return;
      }

      // Clear previous Google button if React re-renders
      googleButton.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        googleButton,
        {
          theme: "outline",
          size: "large",
          width: 260,
          text: "continue_with",
        }
      );
    };

    // Google script may load slightly after React
    if (window.google) {
      initializeGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [googleClientId]);

//SMTP-Forgot Password
const handleForgotPassword = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Unable to send reset link");
      return;
    }

    setMessage(
      "Password reset link has been sent to your email."
    );
  } catch (error) {
    setMessage("Unable to connect to server");
  }
};


//
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      mode === "signin"
        ? "http://localhost:5000/api/auth/signin"
        : "http://localhost:5000/api/auth/signup";

    const body =
      mode === "signin"
        ? {
            email,
            password,
          }
        : {
            name,
            email,
            password,
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (mode === "signin") {
        localStorage.setItem("token", data.token);

        // Storing user information in localStorage
        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }

        setMessage("Login successful");

        navigate("/dashboard");
      } else {
        setMessage("Account created successfully");

        setMode("signin");
        setPassword("");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Back to Home */}
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <h1>DecisionDeck</h1>

        <h2>
          {/* {mode === "signin"
            ? "Welcome Back"
            : "Create Account"} */}
            {forgotPassword
            ? "Forgot Password"
            : mode === "signin"
            ? "Welcome Back"
            : "Create Account"}
        </h2>

        <p className="auth-subtitle">
          {/* {mode === "signin"
            ? "Sign in to manage your decisions."
            : "Create your account and start managing decisions."} */}
          {forgotPassword
            ? "Enter your email and we'll send you a password reset link."
            : mode === "signin"
            ? "Sign in to manage your decisions."
            : "Create your account and start managing decisions."}

        </p>

      <form
  onSubmit={
    forgotPassword
      ? handleForgotPassword
      : handleSubmit
  }
>
  {/* Name field - only for Sign Up */}
  {!forgotPassword && mode === "signup" && (
    <input
      type="text"
      placeholder="Full Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  )}

  {/* Email */}
  <input
    type="email"
    placeholder="Email Address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

  {/* Password - Sign In / Sign Up only */}
  {!forgotPassword && (
    <div className="password-field">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() =>
          setShowPassword(!showPassword)
        }
        aria-label={
          showPassword
            ? "Hide password"
            : "Show password"
        }
      >
        {showPassword ? "👁️" : "🙈"}
      </button>
    </div>
  )}

  {/* Forgot Password Link */}
  {!forgotPassword && mode === "signin" && (
    <button
      type="button"
      className="forgot-password-link"
      onClick={() => {
        setForgotPassword(true);
        setMessage("");
      }}
    >
      Forgot Password?
    </button>
  )}

  {/* Submit */}
  <button
    type="submit"
    className="auth-submit"
  >
    {forgotPassword
      ? "Send Reset Link"
      : mode === "signin"
      ? "Sign In"
      : "Create Account"}
  </button>

    {/* Back to Sign In */}
    {forgotPassword && (
      <button
        type="button"
        className="forgot-back-button"
        onClick={() => {
          setForgotPassword(false);
          setMessage("");
        }}
      >
        ← Back to Sign In
      </button>
    )}
  </form> 



        {/* Message */}
        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        {!forgotPassword && (
  <>
          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Google Sign In */}
          <div
            id="google-signin-button"
            className="google-signin-container"
          ></div>
        </>
      )}

        {/* Switch Sign In / Sign Up */}
       {!forgotPassword && (
  <p className="switch-auth">

    {mode === "signin"
      ? "Don't have an account?"
      : "Already have an account?"}

    <button
      type="button"
      className="link-button"
      onClick={() => {
        setMode(
          mode === "signin"
            ? "signup"
            : "signin"
        );

        setMessage("");
      }}
    >
      {mode === "signin"
        ? " Sign Up"
        : " Sign In"}
    </button>

  </p>
)}

      </div>

    </div>
  );
}

export default AuthPage;