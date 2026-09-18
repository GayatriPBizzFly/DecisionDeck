import "../css/SampleDecision.css";
import { useNavigate } from "react-router-dom";

function SampleDecision() {
  const navigate = useNavigate();

  return (
    <div className="sample-page">

      {/* Header */}
      <header className="sample-header">
        <div className="sample-logo">
          DecisionDeck
        </div>

        <button
          className="sample-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </header>


      {/* Main Content */}
      <main className="sample-container">

        <div className="sample-heading">
          <p className="sample-label">
            SAMPLE DECISION
          </p>

          <h1>
            Should I learn Full Stack Development?
          </h1>

          <p>
            This is an example of how a decision can be
            structured and reviewed inside DecisionDeck.
          </p>
        </div>


        {/* Decision Card */}
        <div className="sample-decision-card">

          <div className="sample-card-top">
            <div>
              <p className="small-label">
                MY DECISION
              </p>

              <h2>
                Learn Full Stack Development
              </h2>
            </div>

            <span className="sample-status">
              In Progress
            </span>
          </div>


          {/* Description */}
          <div className="sample-block">
            <h3>Decision Context</h3>

            <p>
              I want to improve my development skills and
              decide whether learning full stack development
              is the right next step for my career.
            </p>
          </div>


          {/* Options */}
          <div className="sample-block">
            <h3>Options</h3>

            <div className="sample-options">

              <div className="sample-option">
                <span>01</span>
                <div>
                  <strong>Learn Full Stack Development</strong>
                  <p>Build frontend and backend skills.</p>
                </div>
              </div>

              <div className="sample-option">
                <span>02</span>
                <div>
                  <strong>Focus Only on Frontend</strong>
                  <p>Specialize in React and UI development.</p>
                </div>
              </div>

              <div className="sample-option">
                <span>03</span>
                <div>
                  <strong>Explore Another Specialization</strong>
                  <p>Consider another area of technology.</p>
                </div>
              </div>

            </div>
          </div>


          {/* Factors */}
          <div className="sample-block">
            <h3>Important Factors</h3>

            <div className="factor-grid">

              <div className="factor-card">
                <span>Career Growth</span>
                <strong>High</strong>
              </div>

              <div className="factor-card">
                <span>Learning Time</span>
                <strong>Medium</strong>
              </div>

              <div className="factor-card">
                <span>Job Opportunities</span>
                <strong>High</strong>
              </div>

              <div className="factor-card">
                <span>Difficulty</span>
                <strong>Medium</strong>
              </div>

            </div>
          </div>


          {/* Reflection */}
          <div className="sample-reflection">

            <div>
              <p className="small-label">
                CURRENT THOUGHT
              </p>

              <p>
                Full stack development provides broader
                exposure to modern application development
                and allows me to understand the complete
                frontend-to-database workflow.
              </p>
            </div>

          </div>


          {/* Footer of card */}
          <div className="sample-card-footer">

            <div>
              <span>Created</span>
              <strong>September 2026</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>In Progress</strong>
            </div>

          </div>

        </div>


        {/* CTA */}
        <div className="sample-cta">

          <h2>
            Create your own decision deck.
          </h2>

          <p>
            Turn your next important choice into a
            structured decision.
          </p>

          <button
            onClick={() => navigate("/auth")}
          >
            Start Free Trial
          </button>

        </div>

      </main>

    </div>
  );
}

export default SampleDecision;

