
function Cards() {
  return (
    <section className="cards-section" id="features">
      <div className="section-heading">
        <p className="eyebrow">WHY DECISIONDECK</p>

        <h2>
          More than just a place
          <br />
          to write things down.
        </h2>

        <p>
          Most tools help you store information.
          DecisionDeck helps you structure the decision itself.
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="card-number">01</div>

          <h3>Organize the thinking</h3>

          <p>
            Instead of keeping options, pros, cons and notes
            scattered across different tools, bring the complete
            decision into one structured space.
          </p>

          <div className="card-tag">
            <span>Options</span>
            <span>Factors</span>
            <span>Notes</span>
          </div>
        </div>

        <div className="feature-card">
          <div className="card-number">02</div>

          <h3>Understand your choices</h3>

          <p>
            DecisionDeck gives your decisions context. Review
            alternatives, track your reasoning and revisit previous
            decisions when circumstances change.
          </p>

          <div className="card-tag">
            <span>Compare</span>
            <span>Review</span>
            <span>Reflect</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cards;

