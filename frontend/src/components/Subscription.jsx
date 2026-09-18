// function Subscription() {
//   return (
//     <section className="subscription" id="subscription">
//       <div className="subscription-heading">
//         <p className="section-label">PLANS & PRICING</p>

//         <h2>Choose the plan that fits your decisions</h2>

//         <p>
//           Start organizing your decisions today with a plan that matches
//           your needs.
//         </p>
//       </div>

//       <div className="plans">

//         {/* Free Plan */}
//         <div className="plan-card">
//           <h3>Free</h3>

//           <p className="plan-description">
//             For individuals getting started.
//           </p>

//           <div className="price">
//             ₹0<span>/month</span>
//           </div>

//           <button className="plan-button">
//             Get Started
//           </button>

//           <ul>
//             <li>✓ Up to 10 decisions</li>
//             <li>✓ Basic decision tracking</li>
//             <li>✓ Priority management</li>
//             <li>✓ Status tracking</li>
//           </ul>
//         </div>

//         {/* Pro Plan */}
//         <div className="plan-card featured">

//           <div className="popular-badge">
//             MOST POPULAR
//           </div>

//           <h3>Pro</h3>

//           <p className="plan-description">
//             For users managing decisions regularly.
//           </p>

//           <div className="price">
//             ₹299<span>/month</span>
//           </div>

//           <button className="plan-button">
//             Start Pro
//           </button>

//           <ul>
//             <li>✓ Unlimited decisions</li>
//             <li>✓ Advanced decision tracking</li>
//             <li>✓ Priority management</li>
//             <li>✓ Decision history</li>
//             <li>✓ Better organization</li>
//           </ul>
//         </div>

//         {/* Team Plan */}
//         <div className="plan-card">
//           <h3>Team</h3>

//           <p className="plan-description">
//             For teams making decisions together.
//           </p>

//           <div className="price">
//             ₹799<span>/month</span>
//           </div>

//           <button className="plan-button">
//             Choose Team
//           </button>

//           <ul>
//             <li>✓ Everything in Pro</li>
//             <li>✓ Team decision management</li>
//             <li>✓ Shared decisions</li>
//             <li>✓ Collaboration features</li>
//           </ul>
//         </div>

//       </div>
//     </section>
//   );
// }

// export default Subscription;


function Subscription() {
  return (
    <section className="subscription-section" id="subscription">
      <div className="section-heading">
        <p className="eyebrow">SUBSCRIPTION</p>

        <h2>Choose what works for you.</h2>

        <p>
          Start simply and move to a plan that fits the way you make
          decisions.
        </p>
      </div>

      <div className="pricing-grid">

        {/* Free */}
        <div className="pricing-card">
          <p className="plan-name">Free</p>

          <h3>
            ₹0<span>/month</span>
          </h3>

          <p className="plan-description">
            For exploring the basics of structured decision making.
          </p>

          <ul>
            <li>✓ 3 Decisions</li>
            <li>✓ Basic Decision Cards</li>
            <li>✓ Decision History</li>
          </ul>

          <a href="/auth" className="pricing-btn">
            Start Free
          </a>
        </div>

        {/* Pro */}
        <div className="pricing-card featured">
          <div className="popular-badge">POPULAR</div>

          <p className="plan-name">Pro</p>

          <h3>
            ₹299<span>/month</span>
          </h3>

          <p className="plan-description">
            For users who regularly evaluate important choices.
          </p>

          <ul>
            <li>✓ Unlimited Decisions</li>
            <li>✓ Advanced Decision Cards</li>
            <li>✓ Decision History</li>
            <li>✓ Detailed Analysis</li>
          </ul>

          <a href="/auth" className="pricing-btn">
            Choose Pro
          </a>
        </div>

        {/* Premium */}
        <div className="pricing-card">
          <p className="plan-name">Premium</p>

          <h3>
            ₹599<span>/month</span>
          </h3>

          <p className="plan-description">
            For deeper decision analysis and long-term tracking.
          </p>

          <ul>
            <li>✓ Everything in Pro</li>
            <li>✓ Advanced Insights</li>
            <li>✓ Priority Features</li>
            <li>✓ Decision Analytics</li>
          </ul>

          <a href="/auth" className="pricing-btn">
            Choose Premium
          </a>
        </div>

      </div>
    </section>
  );
}

export default Subscription;

