import { useEffect, useState } from "react";
import "../css/StarredDecisions.css";

function StarredDecisions() {
  const [decisions, setDecisions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStarredDecisions();
  }, []);

  const fetchStarredDecisions = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/decisions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load starred decisions");
        return;
      }

      // Only starred decisions
      const starred = data
        .filter((decision) => decision.isPinned)
        .sort(
          (a, b) =>
            new Date(b.pinnedAt) - new Date(a.pinnedAt)
        );

      setDecisions(starred);
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const handleUnstar = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://localhost:5000/api/decisions/${id}/pin`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Failed to unstar decision");
      return;
    }

    fetchStarredDecisions();

  } catch (error) {
    setMessage("Unable to connect to server");
  }
};

  return (
    <section className="dashboard-section starred-decisions">

      <header className="dashboard-topbar">
        <h1>⭐ Starred</h1>
        <p>View and manage your starred decisions.</p>
      </header>

      {message && (
        <p className="dashboard-message">
          {message}
        </p>
      )}

      {decisions.length === 0 ? (
        <div className="empty-decisions">
          <h3>No starred decisions yet</h3>
          <p>
            Star a decision from All My Decisions to see it here.
          </p>
        </div>
      ) : (
        <div className="starred-decisions-list">

          {decisions.map((decision) => (
            <div
              className="starred-decision-card"
              key={decision._id}
            >

              <div className="starred-card-header">
                <h3>{decision.title}</h3>

                <button
                  type="button"
                  className="star-button"
                  onClick={() => {
                    handleUnstar(decision._id);
                  }}
                  title="Remove from Starred"
                >
                  ⭐
                </button>
              </div>

              <p className="starred-description">
                {decision.description}
              </p>

              <div className="starred-meta">

                <span className="status-badge">
                  {decision.status}
                </span>

                <span className="priority-badge">
                  {decision.priority}
                </span>

                <span>
                  Created:{" "}
                  {new Date(
                    decision.createdAt
                  ).toLocaleDateString()}
                </span>

                <span>
                  Starred:{" "}
                  {new Date(
                    decision.pinnedAt
                  ).toLocaleDateString()}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default StarredDecisions;