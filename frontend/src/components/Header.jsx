function Header() {
  return (
    <header className="header">
      <div className="logo">DecisionDeck</div>

      <nav>
        <a href="#about">About Us</a>
        <a href="#subscription">Subscription</a>
      </nav>

      <a href="/auth" className="sign-button">
        Sign In
      </a>
    </header>
  );
}

export default Header;