import { useTheme } from "./ThemeContext";

function Header() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="logo">DecisionDeck</div>

      <nav>
        <a href="#about">About Us</a>
        <a href="#subscription">Subscription</a>
      </nav>

      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <a href="/auth" className="sign-button">
          Sign In
        </a>
      </div>
    </header>
  );
}

export default Header;