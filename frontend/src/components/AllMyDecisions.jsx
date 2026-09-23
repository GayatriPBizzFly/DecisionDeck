import { useEffect, useState } from "react";
import "../css/AllMyDecisions.css";

function AllMyDecisions() {
  const [decisions, setDecisions] = useState([]);
  const [message, setMessage] = useState("");

  // View More
  const [viewingId, setViewingId] = useState(null);

  // Edit
  const [editingId, setEditingId] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editOptions, setEditOptions] = useState([]);
  const [editCriteria, setEditCriteria] = useState([]);
  const [editScores, setEditScores] = useState([]);

  useEffect(() => {
    fetchDecisions();
  }, []);

  // Get user's decisions
  const fetchDecisions = async () => {
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
        setMessage(
          data.message || "Failed to load decisions"
        );
        return;
      }

      setDecisions(data);
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };


  //Pinned and UnPinned Decision
const handleTogglePin = async (id) => {
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
      setMessage(
        data.message || "Failed to update pin"
      );
      return;
    }

    setMessage(data.message);

    // Refresh decisions so UI gets latest pin state
    fetchDecisions();

  } catch (error) {
    setMessage("Unable to connect to server");
  }
};

  // Calculate overall decision score
  const calculateDecisionScore = (decision) => {
    if (
      !decision.criteria ||
      decision.criteria.length === 0 ||
      !decision.scores ||
      decision.scores.length === 0
    ) {
      return null;
    }

    const totalWeight = decision.criteria.reduce(
      (total, criterion) =>
        total + Number(criterion.weight || 0),
      0
    );

    if (totalWeight === 0) {
      return null;
    }

    const weightedScores = decision.scores.map(
      (optionScore) => {
        const weightedScore =
          optionScore.criteriaScores.reduce(
            (total, criterionScore) => {
              const criterion = decision.criteria.find(
                (item) =>
                  item.name === criterionScore.criterion
              );

              if (!criterion) {
                return total;
              }

              return (
                total +
                Number(criterionScore.score || 0) *
                  Number(criterion.weight || 0)
              );
            },
            0
          );

        return weightedScore / totalWeight;
      }
    );

    if (weightedScores.length === 0) {
      return null;
    }

    // Highest weighted option score
    return Math.max(...weightedScores);
  };

  // Calculate score for every option
  const calculateOptionScores = (decision) => {
    if (
      !decision.criteria ||
      decision.criteria.length === 0 ||
      !decision.scores ||
      decision.scores.length === 0
    ) {
      return [];
    }

    const totalWeight = decision.criteria.reduce(
      (total, criterion) =>
        total + Number(criterion.weight || 0),
      0
    );

    if (totalWeight === 0) {
      return [];
    }

    return decision.scores.map((optionScore) => {
      const weightedScore =
        optionScore.criteriaScores.reduce(
          (total, criterionScore) => {
            const criterion = decision.criteria.find(
              (item) =>
                item.name === criterionScore.criterion
            );

            if (!criterion) {
              return total;
            }

            return (
              total +
              Number(criterionScore.score || 0) *
                Number(criterion.weight || 0)
            );
          },
          0
        );

      return {
        option: optionScore.option,
        score: weightedScore / totalWeight,
      };
    });
  };

  // Edit decision
  const handleEdit = (decision) => {
    setEditingId(decision._id);

    setEditTitle(decision.title);
    setEditDescription(decision.description);
    setEditStatus(decision.status);
    setEditPriority(decision.priority);

    setEditOptions(decision.options || []);
    setEditCriteria(decision.criteria || []);
    setEditScores(decision.scores || []);
  };

  // Update decision
  const handleUpdateDecision = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/decisions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            status: editStatus,
            priority: editPriority,
            options: editOptions,
            criteria: editCriteria,
            scores: editScores,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to update decision"
        );
        return;
      }

      setMessage(
        "Decision updated successfully"
      );

      setEditingId(null);

      fetchDecisions();
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  // Delete decision
  const handleDeleteDecision = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/decisions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to delete decision"
        );
        return;
      }

      setMessage(
        "Decision deleted successfully"
      );

      fetchDecisions();
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <section className="dashboard-section all-my-decisions">

      {/* Header */}

      <header className="dashboard-topbar">

        <h1>
          All My Decisions
        </h1>

        <p>
          View and manage decisions created by you.
        </p>

      </header>

      {message && (
        <p className="dashboard-message">
          {message}
        </p>
      )}

      {decisions.length === 0 ? (

        <div className="empty-decisions">

          <div>
            📋
          </div>

          <h3>
            No decisions yet
          </h3>

          <p>
            Create your first decision to see it here.
          </p>

        </div>

      ) : (

        <div className="all-decisions-list">

          {decisions.map((decision) => (

            <div
              className="all-decision-card"
              key={decision._id}
            >

              {editingId === decision._id ? (

                /* ========================= */
                /* EDIT FORM */
                /* ========================= */

                <div className="edit-decision-form">

                  <label>
                    Decision Title
                  </label>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(
                        e.target.value
                      )
                    }
                  />

                  <label>
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(
                        e.target.value
                      )
                    }
                  />

                  <label>
                    Status
                  </label>

                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                  <label>
                    Priority
                  </label>

                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(
                        e.target.value
                      )
                    }
                  >

                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                  </select>

                  {/* OPTIONS */}

                  <div className="edit-section">

                    <h4>
                      Options
                    </h4>

                    {editOptions.map(
                      (option, index) => (

                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => {

                            const updatedOptions =
                              [...editOptions];

                            updatedOptions[index] =
                              e.target.value;

                            const updatedScores =
                              editScores.map(
                                (optionScore) => {

                                  if (
                                    optionScore.option ===
                                    option
                                  ) {

                                    return {
                                      ...optionScore,
                                      option:
                                        e.target.value,
                                    };

                                  }

                                  return optionScore;

                                }
                              );

                            setEditOptions(
                              updatedOptions
                            );

                            setEditScores(
                              updatedScores
                            );

                          }}
                        />

                      )
                    )}

                  </div>

                  {/* CRITERIA */}

                  <div className="edit-section">

                    <h4>
                      Criteria & Weights
                    </h4>

                    {editCriteria.map(
                      (criterion, index) => (

                        <div
                          className="edit-criteria-row"
                          key={index}
                        >

                          <input
                            type="text"
                            value={
                              criterion.name
                            }
                            onChange={(e) => {

                              const oldName =
                                criterion.name;

                              const newName =
                                e.target.value;

                              const updatedCriteria =
                                [...editCriteria];

                              updatedCriteria[index] =
                                {
                                  ...updatedCriteria[index],
                                  name: newName,
                                };

                              const updatedScores =
                                editScores.map(
                                  (optionScore) => ({
                                    ...optionScore,

                                    criteriaScores:
                                      optionScore.criteriaScores.map(
                                        (criterionScore) => {

                                          if (
                                            criterionScore.criterion ===
                                            oldName
                                          ) {

                                            return {
                                              ...criterionScore,
                                              criterion:
                                                newName,
                                            };

                                          }

                                          return criterionScore;

                                        }
                                      ),
                                  })
                                );

                              setEditCriteria(
                                updatedCriteria
                              );

                              setEditScores(
                                updatedScores
                              );

                            }}
                          />

                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={
                              criterion.weight
                            }
                            onChange={(e) => {

                              const updatedCriteria =
                                [...editCriteria];

                              updatedCriteria[index] =
                                {
                                  ...updatedCriteria[index],
                                  weight: Number(
                                    e.target.value
                                  ),
                                };

                              setEditCriteria(
                                updatedCriteria
                              );

                            }}
                          />

                        </div>

                      )
                    )}

                  </div>

                  {/* SCORES */}

                  <div className="edit-section">

                    <h4>
                      Option Scores
                    </h4>

                    {editScores.map(
                      (
                        optionScore,
                        optionIndex
                      ) => (

                        <div
                          className="edit-score-option"
                          key={optionIndex}
                        >

                          <h5>
                            {optionScore.option}
                          </h5>

                          {optionScore.criteriaScores.map(
                            (
                              criterionScore,
                              criteriaIndex
                            ) => (

                              <div
                                className="edit-score-row"
                                key={criteriaIndex}
                              >

                                <span>
                                  {
                                    criterionScore.criterion
                                  }
                                </span>

                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={
                                    criterionScore.score
                                  }
                                  onChange={(e) => {
                                    const newScore =
                                      Number(
                                        e.target.value
                                      );

                                    setEditScores(
                                      (currentScores) =>
                                        currentScores.map(
                                          (
                                            currentOptionScore,
                                            currentOptionIndex
                                          ) => {

                                            if (
                                              currentOptionIndex !==
                                              optionIndex
                                            ) {
                                              return currentOptionScore;
                                            }

                                            return {
                                              ...currentOptionScore,

                                              criteriaScores:
                                                currentOptionScore.criteriaScores.map(
                                                  (
                                                    scoreItem,
                                                    currentCriteriaIndex
                                                  ) => {

                                                    if (
                                                      currentCriteriaIndex !==
                                                      criteriaIndex
                                                    ) {
                                                      return scoreItem;
                                                    }

                                                    return {
                                                      ...scoreItem,
                                                      score:
                                                        newScore,
                                                    };
                                                  }
                                                ),
                                            };
                                          }
                                        )
                                    );
                                  }}
                                />

                              </div>

                            )
                          )}

                        </div>

                      )
                    )}

                  </div>

                  {/* SAVE / CANCEL */}

                  <div className="decision-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateDecision(
                          decision._id
                        )
                      }
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingId(null)
                      }
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              ) : (

                /* ========================= */
                /* NORMAL DECISION CARD */
                /* ========================= */

                <>

                 <div className="decision-card-header">
                    <h3>{decision.title}</h3>

                    <button
                      type="button"
                      className="pin-decision-button"
                      onClick={() => handleTogglePin(decision._id)}
                    >
                      {decision.isPinned ? "⭐" : "✰"}
                    </button>
                  </div>

                  <p className="decision-description">
                    {decision.description}
                  </p>

                  <div className="decision-meta">

                    <span
                      className={`status-badge ${decision.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {decision.status}
                    </span>

                    <span
                      className={`priority-badge ${decision.priority.toLowerCase()}`}
                    >
                      {decision.priority} Priority
                    </span>

                    {calculateDecisionScore(decision) !== null && (
                      <span className="decision-score-badge">
                        {(() => {
                          const optionScores =
                            calculateOptionScores(
                              decision
                            );

                          if (
                            optionScores.length === 0
                          ) {
                            return null;
                          }

                          const bestOption =
                            optionScores.reduce(
                              (best, current) =>
                                current.score >
                                best.score
                                  ? current
                                  : best,
                              optionScores[0]
                            );

                          return (
                            <>
                              Score:{" "}
                              {bestOption.score.toFixed(
                                2
                              )}
                              /10 (
                              {bestOption.option})
                            </>
                          );
                        })()}
                      </span>
                    )}

                    {decision.createdAt && (
                      <span className="decision-date">
                        Created{" "}
                        {new Date(
                          decision.createdAt
                        ).toLocaleDateString()}
                      </span>
                    )}

                  </div>

                  {/* ========================= */}
                  {/* VIEW MORE DETAILS */}
                  {/* ========================= */}

                  {viewingId === decision._id && (

                    <div className="decision-full-details">

                      {/* OPTIONS */}

                      {decision.options &&
                        decision.options.length > 0 && (

                          <div className="decision-options-display">

                            <h4>
                              Options
                            </h4>

                            <ul>

                              {decision.options.map(
                                (option, index) => (

                                  <li key={index}>
                                    {option}
                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        )}

                      {/* CRITERIA */}

                      {decision.criteria &&
                        decision.criteria.length > 0 && (

                          <div className="decision-criteria-display">

                            <h4>
                              Criteria & Weights
                            </h4>

                            <ul>

                              {decision.criteria.map(
                                (criterion, index) => (

                                  <li key={index}>

                                    <span>
                                      {criterion.name}
                                    </span>

                                    <span>
                                      {criterion.weight}%
                                    </span>

                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        )}

                      {/* SCORES */}

                      {decision.scores &&
                        decision.scores.length > 0 && (

                          <div className="decision-scores-display">

                            <h4>
                              Option Scores
                            </h4>

                            {decision.scores.map(
                              (optionScore) => (

                                <div
                                  className="decision-score-option"
                                  key={
                                    optionScore.option
                                  }
                                >

                                  <h5>
                                    {optionScore.option}
                                  </h5>

                                  {optionScore.criteriaScores.map(
                                    (criterionScore) => (

                                      <div
                                        className="scoring-display-row"
                                        key={
                                          criterionScore.criterion
                                        }
                                      >

                                        <span>
                                          {
                                            criterionScore.criterion
                                          }
                                        </span>

                                        <span>
                                          {
                                            criterionScore.score
                                          }
                                          /10
                                        </span>

                                      </div>

                                    )
                                  )}

                                </div>

                              )
                            )}

                          </div>

                        )}

                      {/* FINAL SCORE BY OPTION */}

                      {calculateOptionScores(decision).length > 0 && (

                        <div className="decision-option-total-scores">

                          <h4>
                            Final Score by Option
                          </h4>

                          <div className="option-total-score-list">

                            {calculateOptionScores(
                              decision
                            ).map(
                              (optionScore, index) => (

                                <div
                                  className="option-total-score-row"
                                  key={index}
                                >

                                  <span>
                                    {optionScore.option}
                                  </span>

                                  <span>
                                    {optionScore.score.toFixed(
                                      2
                                    )}{" "}
                                    / 10
                                  </span>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )}

                    </div>

                  )}

                  {/* ========================= */}
                  {/* THREE ACTION BUTTONS */}
                  {/* ========================= */}

                  <div className="decision-card-actions">

                    {/* VIEW MORE */}

                    <button
                      type="button"
                      className="view-more-button"
                      onClick={() =>
                        setViewingId(
                          viewingId === decision._id
                            ? null
                            : decision._id
                        )
                      }
                    >
                      {viewingId === decision._id
                        ? "View Less"
                        : "View More"}
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(decision)
                      }
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteDecision(
                          decision._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </>

              )}

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default AllMyDecisions;