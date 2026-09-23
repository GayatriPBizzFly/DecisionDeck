import "../css/Dashboard.css";
import { useEffect, useState } from "react";
import MyDecision from "../components/MyDecision";
import AllMyDecisions from "../components/AllMyDecisions";
import StarredDecisions from "../components/StarredDecisions";

function Dashboard() {

  // Get user information from localStorage
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const [activeSection, setActiveSection] = useState("overview");
  const [decisions, setDecisions] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedDecision, setSelectedDecision] = useState(null);

  // Create decision
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");

  // Edit decision
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPriority, setEditPriority] = useState("Medium");

  // Account Settings
  const [settingsName, setSettingsName] = useState(
    user?.name || ""
  );

  const [settingsEmail, setSettingsEmail] = useState(
    user?.email || ""
  );

  const [settingsPassword, setSettingsPassword] = useState("");

  const [settingsMessage, setSettingsMessage] = useState("");

  // Get decisions
  useEffect(() => {
    fetchDecisions();
  }, []);

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

  // Create decision
  const handleCreateDecision = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

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
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create decision");
        return;
      }

      setMessage("Decision created successfully");

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");

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
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update decision");
        return;
      }

      setMessage("Decision updated successfully");
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
        setMessage(data.message || "Failed to delete decision");
        return;
      }

      setMessage("Decision deleted successfully");

      fetchDecisions();
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  // Update account settings
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: settingsName,
            email: settingsEmail,
            password: settingsPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSettingsMessage(
          data.message || "Failed to update account"
        );
        return;
      }

      // Update user information in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Clear password field
      setSettingsPassword("");

      setSettingsMessage(
        "Account updated successfully"
      );
    } catch (error) {
      setSettingsMessage(
        "Unable to connect to server"
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  // Decision statistics
  const totalDecisions = decisions.length;

  const pendingDecisions = decisions.filter(
    (decision) => decision.status === "Pending"
  ).length;

  const inProgressDecisions = decisions.filter(
    (decision) => decision.status === "In Progress"
  ).length;

  const completedDecisions = decisions.filter(
    (decision) => decision.status === "Completed"
  ).length;

  // Recent decisions
  const recentDecisions = [...decisions]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          <h2>DecisionDeck</h2>
        </div>

        <nav className="sidebar-menu">

          <button
            className={
              activeSection === "overview"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => {
              setActiveSection("overview");
              fetchDecisions();
            }}
          >
            <span>📊</span>
            <span>Decision Overview</span>
          </button>

          <button
            className={
              activeSection === "myDecision"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setActiveSection("myDecision")}
          >
            <span>📝</span>
            <span>My Decision</span>
          </button>

          <button
            className={
              activeSection === "starredDecisions"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setActiveSection("starredDecisions")}
            >
            <span>⭐</span>
            <span>Starred</span>
          </button>

          <button
            className={
              activeSection === "allMyDecisions"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setActiveSection("allMyDecisions")}
          >
            <span>📝</span>
            <span>All My Decisions</span>
          </button>

          <button
            className={
              activeSection === "subscription"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setActiveSection("subscription")}
          >
            <span>💳</span>
            <span>View Subscription Plan</span>
          </button>

          <button
            className={
              activeSection === "settings"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => {
              setActiveSection("settings");
              setSettingsMessage("");
            }}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>

        </nav>

        <div className="sidebar-bottom">


          <button
            className="sidebar-item logout-item"
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Log Out</span>
          </button>

        </div>

      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">

        {/* ========================= */}
        {/* DECISION OVERVIEW */}
        {/* ========================= */}

        {activeSection === "overview" && (
          <>

            <header className="dashboard-topbar">

              <h1>
                Welcome back, {user?.name || "there"}! 👋
              </h1>

              <p>
                Here's your decision overview. Let's make your next decision a little easier today.
              </p>

            </header>

            {message && (
              <p className="dashboard-message">
                {message}
              </p>
            )}

            {/* Statistics */}
            <section className="decision-stats">

              <div className="stat-card">
                <div className="stat-icon">📋</div>

                <div>
                  <p>Total Decisions</p>
                  <h2>{totalDecisions}</h2>
                </div>
              </div>

              <div className="stat-card pending">
                <div className="stat-icon">⏳</div>

                <div>
                  <p>Pending</p>
                  <h2>{pendingDecisions}</h2>
                </div>
              </div>

              <div className="stat-card progress">
                <div className="stat-icon">🔄</div>

                <div>
                  <p>In Progress</p>
                  <h2>{inProgressDecisions}</h2>
                </div>
              </div>

              <div className="stat-card completed">
                <div className="stat-icon">✅</div>

                <div>
                  <p>Completed</p>
                  <h2>{completedDecisions}</h2>
                </div>
              </div>

            </section>

            {/* Recent Decisions */}
            <section className="dashboard-section recent-decisions">

              <div className="section-header">

                <div>

                  <h2>Recent Decisions</h2>

                  <p>
                    Recently added decisions in your account.
                  </p>

                </div>

                <span className="decision-count">
                  {decisions.length} Total
                </span>

              </div>

              {recentDecisions.length === 0 ? (

                <div className="empty-decisions">

                  <div>📋</div>

                  <h3>No decisions yet</h3>

                  <p>
                    Create your first decision to see it here.
                  </p>

                </div>

              ) : (

                <div className="recent-decision-list">

                  {recentDecisions.map((decision) => (

                    <div
                      className="recent-decision-card"
                      key={decision._id}
                    >

                      <div className="decision-main-info">

                        <h3>{decision.title}</h3>

                        <p>
                          {decision.description}
                        </p>

                        <div className="decision-meta">

                          <span
                            className={`status-badge ${
                              decision.status
                                .toLowerCase()
                                .replace(" ", "-")
                            }`}
                          >
                            {decision.status}
                          </span>

                          <span
                            className={`priority-badge ${
                              decision.priority.toLowerCase()
                            }`}
                          >
                            {decision.priority} Priority
                          </span>

                          {decision.createdAt && (
                            <span className="decision-date">
                              {new Date(
                                decision.createdAt
                              ).toLocaleDateString()}
                            </span>
                          )}

                        </div>

                      </div>

                      <button
                        className="view-decision-button"
                        onClick={() =>
                          setSelectedDecision(decision)
                        }
                      >
                        View Decision →
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </>
        )}

        {/* My Decisions Section */}

        {activeSection === "myDecision" && (
          <MyDecision
            onDecisionCreated={fetchDecisions}
          />
        )}

        {/* All My Decisions */}

        {activeSection === "allMyDecisions" && (
          <AllMyDecisions
            decisions={decisions}
            onEdit={(decision) => {
              console.log("Edit decision:", decision);
            }}
            onDelete={handleDeleteDecision}
          />
        )}

        {/* Render The Starred Decisions */}
        {/* Starred Decisions */}

        {activeSection === "starredDecisions" && (
          <StarredDecisions />
        )}

        {/* ========================= */}
        {/* SUBSCRIPTION */}
        {/* ========================= */}

        {activeSection === "subscription" && (
          <section className="dashboard-section">

            <h1>Subscription Plans</h1>

            <p>
              Choose the plan that fits your needs.
            </p>

            <div className="dashboard-plans">

              <div className="dashboard-plan-card">

                <h2>Free</h2>

                <h3>₹0/month</h3>

                <p>✓ Up to 10 decisions</p>
                <p>✓ Basic decision tracking</p>
                <p>✓ Priority management</p>
                <p>✓ Status tracking</p>

                <button>
                  Current Plan
                </button>

              </div>

              <div className="dashboard-plan-card featured">

                <h2>Pro</h2>

                <h3>₹299/month</h3>

                <p>✓ Unlimited decisions</p>
                <p>✓ Advanced tracking</p>
                <p>✓ Decision history</p>
                <p>✓ Better organization</p>

                <button>
                  Start Pro
                </button>

              </div>

              <div className="dashboard-plan-card">

                <h2>Team</h2>

                <h3>₹799/month</h3>

                <p>✓ Everything in Pro</p>
                <p>✓ Shared decisions</p>
                <p>✓ Team management</p>
                <p>✓ Collaboration features</p>

                <button>
                  Choose Team
                </button>

              </div>

            </div>

          </section>
        )}

        {/* ========================= */}
        {/* SETTINGS */}
        {/* ========================= */}

        {activeSection === "settings" && (
          <section className="dashboard-section">

            <h1>Settings</h1>

            <p>
              Manage your DecisionDeck account settings.
            </p>

            <div className="settings-card">

              <h2>Account Settings</h2>

              <form onSubmit={handleUpdateProfile}>

                <label>Name</label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={settingsName}
                  onChange={(e) =>
                    setSettingsName(e.target.value)
                  }
                  required
                />

                <label>Email</label>

                <input
                  type="email"
                  placeholder="Your email"
                  value={settingsEmail}
                  onChange={(e) =>
                    setSettingsEmail(e.target.value)
                  }
                  required
                />

                <label>New Password</label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={settingsPassword}
                  onChange={(e) =>
                    setSettingsPassword(e.target.value)
                  }
                />

                <p className="settings-password-hint">
                  Leave password empty if you don't want to change it.
                </p>

                <button type="submit">
                  Save Changes
                </button>

              </form>

              {settingsMessage && (
                <p className="settings-message">
                  {settingsMessage}
                </p>
              )}

            </div>

          </section>
        )}

      </main>

      {/* ========================= */}
      {/* VIEW DECISION MODAL */}
      {/* ========================= */}

      {selectedDecision && (

        <div
          className="decision-modal-overlay"
          onClick={() =>
            setSelectedDecision(null)
          }
        >

          <div
            className="decision-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-modal"
              onClick={() =>
                setSelectedDecision(null)
              }
            >
              ×
            </button>

            <p className="modal-label">
              DECISION DETAILS
            </p>

            <h2>
              {selectedDecision.title}
            </h2>

            <p className="modal-description">
              {selectedDecision.description}
            </p>

            <div className="modal-details">

              <div>

                <span>Status</span>

                <strong>
                  {selectedDecision.status}
                </strong>

              </div>

              <div>

                <span>Priority</span>

                <strong>
                  {selectedDecision.priority}
                </strong>

              </div>

              <div>

                <span>Created</span>

                <strong>
                  {selectedDecision.createdAt
                    ? new Date(
                        selectedDecision.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>

              </div>

            </div>

            <button
              className="modal-close-button"
              onClick={() =>
                setSelectedDecision(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;