import { useEffect, useState } from "react";
import "../css/MyDecision.css";

function MyDecision({ onDecisionCreated }) {
  const [decisions, setDecisions] = useState([]);
  const [message, setMessage] = useState("");

  // Create decision states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");

  // Priority descriptions
  const priorityDescriptions = {
    Low: "This decision can wait and does not require immediate attention.",
    Medium: "This decision is important but does not need immediate action.",
    High: "This decision is important or urgent and should be handled soon.",
  };

  // Status descriptions
  const statusDescriptions = {
    Pending: "You have not started making this decision yet.",
    "In Progress": "You are currently evaluating the options and criteria.",
    Completed:
      "You have finished evaluating the decision and made your choice.",
  };

  // Decision options
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  // Decision criteria
  const [criteria, setCriteria] = useState([]);
  const [newCriteria, setNewCriteria] = useState("");

  // Decision scoring
  const [scores, setScores] = useState([]);

  // Edit states
  const [editingId, setEditingId] = useState(null);

  // Viewing decision states - View More
  const [viewingId, setViewingId] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editOptions, setEditOptions] = useState([]);
  const [editCriteria, setEditCriteria] = useState([]);
  const [editScores, setEditScores] = useState([]);

  // Limits for decision options and criteria
  const MAX_OPTIONS = 3;
  const MAX_CRITERIA = 3;

  // Fetch decisions when page loads
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
        setMessage(data.message || "Failed to load decisions");
        return;
      }

      setDecisions(data);
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  // Add a new decision option
  const handleAddOption = () => {
    const optionName = newOption.trim();

    if (!optionName) return;

    // Check option limit
    if (options.length >= MAX_OPTIONS) {
      setMessage(
        `You can add a maximum of ${MAX_OPTIONS} options`
      );
      return;
    }

    // Check duplicate option
    const alreadyExists = options.some(
      (option) =>
        option.trim().toLowerCase() ===
        optionName.toLowerCase()
    );

    if (alreadyExists) {
      setMessage("This option is already added");
      return;
    }

    setOptions([...options, optionName]);
    setNewOption("");
    setMessage("");
  };

  // Remove a decision option
  const handleRemoveOption = (index) => {
    setOptions(
      options.filter(
        (_, optionIndex) => optionIndex !== index
      )
    );

    setMessage("");
  };

  // Add a new decision criterion
  const handleAddCriteria = () => {
    const criterionName = newCriteria.trim();

    if (!criterionName) return;

    // Check criteria limit
    if (criteria.length >= MAX_CRITERIA) {
      setMessage(
        `You can add a maximum of ${MAX_CRITERIA} criteria`
      );
      return;
    }

    // Check duplicate criterion
    const alreadyExists = criteria.some(
      (criterion) =>
        criterion.name.trim().toLowerCase() ===
        criterionName.toLowerCase()
    );

    if (alreadyExists) {
      setMessage("This criterion is already added");
      return;
    }

    setCriteria([
      ...criteria,
      {
        name: criterionName,
        weight: 1,
      },
    ]);

    setNewCriteria("");
    setMessage("");
  };

  // Remove a decision criterion
  const handleRemoveCriteria = (index) => {
    setCriteria(
      criteria.filter(
        (_, criteriaIndex) => criteriaIndex !== index
      )
    );

    setMessage("");
  };

  // Initialize scores for all options and criteria
  const initializeScores = () => {
    const newScores = options.map((option) => ({
      option,
      criteriaScores: criteria.map((criterion) => ({
        criterion: criterion.name,
        score: 1,
      })),
    }));

    setScores(newScores);
  };

  // Set score for a specific option and criterion
  const handleScoreChange = (
    optionIndex,
    criteriaIndex,
    value
  ) => {
    setScores((currentScores) =>
      currentScores.map(
        (optionScore, optionIndexValue) => {
          if (optionIndexValue !== optionIndex) {
            return optionScore;
          }

          return {
            ...optionScore,
            criteriaScores:
              optionScore.criteriaScores.map(
                (
                  criterionScore,
                  criteriaIndexValue
                ) => {
                  if (
                    criteriaIndexValue !==
                    criteriaIndex
                  ) {
                    return criterionScore;
                  }

                  return {
                    ...criterionScore,
                    score: Number(value),
                  };
                }
              ),
          };
        }
      )
    );
  };

  // Handle Score change using formula:
  // score = (weight / 100) * rating
  const calculateWeightedScores = () => {
    if (
      criteria.length === 0 ||
      scores.length === 0
    ) {
      return [];
    }

    const totalWeight = criteria.reduce(
      (total, criterion) =>
        total + criterion.weight,
      0
    );

    if (totalWeight === 0) {
      return [];
    }

    return scores.map((optionScore) => {
      const weightedScore =
        optionScore.criteriaScores.reduce(
          (total, criterionScore) => {
            const criterion = criteria.find(
              (item) =>
                item.name ===
                criterionScore.criterion
            );

            if (!criterion) {
              return total;
            }

            return (
              total +
              criterionScore.score *
                criterion.weight
            );
          },
          0
        );

      return {
        option: optionScore.option,
        weightedScore:
          weightedScore / totalWeight,
      };
    });
  };

  // Create decision
  const handleCreateDecision = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (scores.length === 0) {
      setMessage(
        "Please generate the scoring table before adding the decision"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/decisions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
            options,
            criteria,
            scores,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to create decision"
        );
        return;
      }

      setMessage("Decision created successfully");

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");

      setOptions([]);
      setNewOption("");

      setCriteria([]);
      setNewCriteria("");

      setScores([]);

      if (onDecisionCreated) {
        onDecisionCreated();
      }

      fetchDecisions();
    } catch (error) {
      setMessage("Unable to connect to server");
    }
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
    <section className="my-decision-page">

      {/* Header */}
      <div className="dashboard-topbar">
        <h1>My Decisions</h1>

        <p>
          Create, manage and review your personal decisions.
        </p>
      </div>

      {message && (
        <p className="dashboard-message">
          {message}
        </p>
      )}

      {/* ========================= */}
      {/* CREATE NEW DECISION */}
      {/* ========================= */}

      <section className="dashboard-section create-decision-section">

        <div className="section-header">
          <div>
            <h2>Create New Decision</h2>
          </div>
        </div>

        <form
          className="decision-form"
          onSubmit={handleCreateDecision}
        >

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter decision title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <textarea
              className="decision-description-input"
              placeholder="Describe your decision..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />
          </div>

          <div className="decision-form-row">

            {/* STATUS */}

            <div className="form-group decision-select-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
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

              <p className="field-helper-text">
                {statusDescriptions[status]}
              </p>

            </div>

            {/* PRIORITY */}

            <div className="form-group decision-select-group">

              <label>
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
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

              <p className="field-helper-text">
                {priorityDescriptions[priority]}
              </p>

            </div>

          </div>

          {/* DECISION OPTIONS */}

          <div className="form-group decision-options-group">

            <label>
              Decision Options
              <span className="input-limit">
                {" "}
                ({options.length}/{MAX_OPTIONS})
              </span>
            </label>

            <div className="option-input-row">

              <input
                type="text"
                placeholder="Enter an option"
                value={newOption}
                onChange={(e) =>
                  setNewOption(e.target.value)
                }
              />

              <button
                type="button"
                onClick={handleAddOption}
              >
                + Add
              </button>

            </div>

            {options.length > 0 && (
              <div className="decision-options-list">

                {options.map(
                  (option, index) => (

                    <div
                      className="decision-option-item"
                      key={index}
                    >

                      <span>
                        {option}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveOption(index)
                        }
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>
            )}

          </div>

          {/* DECISION CRITERIA */}

          <div className="form-group decision-criteria-group">

            <label>
              Decision Criteria
              <span className="input-limit">
                {" "}
                ({criteria.length}/{MAX_CRITERIA})
              </span>
            </label>

            <div className="criteria-input-row">

              <input
                type="text"
                placeholder="Example: Price, Performance, Battery"
                value={newCriteria}
                onChange={(e) =>
                  setNewCriteria(e.target.value)
                }
              />

              <button
                type="button"
                onClick={handleAddCriteria}
              >
                + Add
              </button>

            </div>

            {criteria.length > 0 && (
              <div className="decision-criteria-list">

                {criteria.map(
                  (criterion, index) => (

                    <div
                      className="decision-criteria-item"
                      key={index}
                    >

                      <div className="criteria-info">

                        <span>
                          {criterion.name}
                        </span>

                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={criterion.weight}
                          onChange={(e) => {
                            const updatedCriteria =
                              [...criteria];

                            updatedCriteria[index] = {
                              ...updatedCriteria[index],
                              weight: Number(
                                e.target.value
                              ),
                            };

                            setCriteria(
                              updatedCriteria
                            );
                          }}
                        />

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCriteria(index)
                        }
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>
            )}

            {criteria.length > 0 && (
              <div className="criteria-total-weight">

                Total Weight:{" "}

                {criteria.reduce(
                  (total, criterion) =>
                    total + criterion.weight,
                  0
                )}{" "}
                / 100

              </div>
            )}

          </div>

          {/* DECISION SCORING */}

          {options.length > 0 &&
            criteria.length > 0 && (

              <div className="form-group decision-scoring-group">

                <label>
                  Option Scoring
                </label>

                <button
                  type="button"
                  onClick={initializeScores}
                >
                  Generate Scoring Table
                </button>

                {scores.length > 0 && (
                  <div className="decision-scoring-table">

                    {scores.map(
                      (
                        optionScore,
                        optionIndex
                      ) => (

                        <div
                          className="scoring-option"
                          key={optionScore.option}
                        >

                          <h4>
                            {optionScore.option}
                          </h4>

                          {optionScore.criteriaScores.map(
                            (
                              criterionScore,
                              criteriaIndex
                            ) => (

                              <div
                                className="scoring-row"
                                key={criterionScore.criterion}
                              >

                                <span>
                                  {criterionScore.criterion}
                                </span>

                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={criterionScore.score}
                                  onChange={(e) =>
                                    handleScoreChange(
                                      optionIndex,
                                      criteriaIndex,
                                      e.target.value
                                    )
                                  }
                                />

                              </div>

                            )
                          )}

                        </div>

                      )
                    )}

                  </div>
                )}

                {scores.length > 0 && (
                  <div className="weighted-result-section">

                    <h4>
                      Weighted Decision Result
                    </h4>

                    {criteria.reduce(
                      (total, criterion) =>
                        total + criterion.weight,
                      0
                    ) !== 100 ? (

                      <p>
                        Please make the total
                        criteria weight equal
                        to 100 before
                        calculating the decision.
                      </p>

                    ) : (

                      <div className="weighted-result-list">

                        {calculateWeightedScores().map(
                          (result) => (

                            <div
                              className="weighted-result-item"
                              key={result.option}
                            >

                              <span>
                                {result.option}
                              </span>

                              <strong>
                                {result.weightedScore.toFixed(2)} / 10
                              </strong>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>
                )}

              </div>
            )}

          <button
            type="submit"
            className="create-decision-button"
          >
            + Add Decision
          </button>

        </form>

      </section>

      {/* ========================= */}
      {/* ALL DECISIONS */}
      {/* ========================= */}

      <section className="dashboard-section all-decisions-section">

        <div className="section-header">

          <div>

            <h2 className="recent-decisions-title">
              Recent Decisions
            </h2>

            

            <p>
              View your 3 most recent decisions.
            </p>

          </div>

          <span className="decision-count">
            {decisions.length} Total
          </span>

        </div>

        {decisions.length === 0 ? (

          <div className="empty-decisions">

            <div>📋</div>

            <h3>
              No decisions yet
            </h3>

            <p>
              Create your first decision using the form above.
            </p>

          </div>

        ) : (

          <div className="my-decision-list">

            {[...decisions]
              .sort(
                (a, b) =>
                  new Date(b.createdAt) - new Date(a.createdAt)
              )
              .slice(0, 3)
              .map((decision) => (

                <div
                  className="decision-card"
                  key={decision._id}
                >

                  {editingId === decision._id ? (

                    <div className="edit-decision-form">

                      <label>
                        Decision Title
                      </label>

                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                      />

                      <label>
                        Description
                      </label>

                      <textarea
                        className="edit-description-input"
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
                          setEditStatus(e.target.value)
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
                                value={criterion.name}
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
                                value={criterion.weight}
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

                                        const updatedScores =
                                          [...editScores];

                                        updatedScores[
                                          optionIndex
                                        ] = {
                                          ...updatedScores[
                                            optionIndex
                                          ],

                                          criteriaScores:
                                            updatedScores[
                                              optionIndex
                                            ].criteriaScores.map(
                                              (
                                                scoreItem,
                                                scoreIndex
                                              ) => {

                                                if (
                                                  scoreIndex ===
                                                  criteriaIndex
                                                ) {
                                                  return {
                                                    ...scoreItem,
                                                    score:
                                                      Number(
                                                        e.target.value
                                                      ),
                                                  };
                                                }

                                                return scoreItem;
                                              }
                                            ),
                                        };

                                        setEditScores(
                                          updatedScores
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

                    <>

                      <div className="decision-card-header">

                        <h3>
                          {decision.title}
                        </h3>

                        <span
                          className={`priority-badge ${decision.priority.toLowerCase()}`}
                        >
                          {decision.priority}
                        </span>

                      </div>

                      <div className="decision-description">
                        {decision.description}
                      </div>

                      <div className="decision-meta">

                        <span
                          className={`status-badge ${decision.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {decision.status}
                        </span>

                        {decision.createdAt && (
                          <span className="decision-date">
                            Created{" "}
                            {new Date(
                              decision.createdAt
                            ).toLocaleDateString()}
                          </span>
                        )}

                      </div>

                      {/* VIEW MORE DETAILS REMAINS */}
                      {viewingId === decision._id && (

                        <div className="decision-full-details">

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
                                      key={optionScore.option}
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

                        </div>

                      )}

                      {/* NO ACTION BUTTONS HERE */}

                    </>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </section>

    </section>
  );
}

export default MyDecision;