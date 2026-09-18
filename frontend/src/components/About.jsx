function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <p className="eyebrow">DECISIONDECK</p>

        <h1>
          Make better decisions.
          <br />
          <span>With clarity.</span>
        </h1>

        <p className="about-description">
          Turn confusing choices into structured decisions.
          DecisionDeck helps you organize your options, compare
          possibilities, and understand the thinking behind every choice.
        </p>

        <div className="about-buttons">
          <a href="/auth" className="primary-btn">
            Free Trial
          </a>

          <a href="/sample-decision" className="secondary-btn">
            View Sample Decision Deck
          </a>
        </div>
      </div>

      <div className="decision-preview">
        <div className="preview-header">
          <span>Decision Overview</span>
          <span className="preview-status">Active</span>
        </div>

        <h3>Should I learn Full Stack Development?</h3>

        <div className="preview-row">
          <span>Options</span>
          <strong>3</strong>
        </div>

        <div className="preview-row">
          <span>Factors</span>
          <strong>5</strong>
        </div>

        <div className="preview-row">
          <span>Status</span>
          <strong>In Progress</strong>
        </div>

        <div className="preview-line">
          <span></span>
        </div>

        <p>Compare. Reflect. Decide.</p>
      </div>
    </section>
  );
}

export default About;

