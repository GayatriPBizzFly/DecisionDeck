// function Footer() {
//   return (
//     <footer className="footer">
//       <p>© 2026 DecisionDeck. All rights reserved.</p>
//     </footer>
//   );
// }

// export default Footer;


function Footer() {
  return (
    <footer className="footer">

      <div className="footer-main">

        <div className="footer-brand">
          <div className="footer-logo">DecisionDeck</div>

          <p>
            A structured space for making clearer,
            more thoughtful decisions.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#subscription">Subscription</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="/auth">Sign In</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 DecisionDeck. All rights reserved.</p>

        <p>Make decisions with clarity.</p>
      </div>

    </footer>
  );
}

export default Footer;

