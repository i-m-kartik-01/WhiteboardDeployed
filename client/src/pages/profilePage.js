import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./profilePage.css";

function ProfilePage() {
  const [canvases, setCanvases] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [shareEmails, setShareEmails] = useState({});
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCanvases();
  }, []);

  const fetchCanvases = async () => {
    try {
      const res = await api.get("/canvas");
      setCanvases(res.data);
    } catch {
      alert("Failed to load canvases");
    }
  };

  const createCanvas = async () => {
    if (!newTitle.trim()) {
      alert("Please enter a canvas title");
      return;
    }

    try {
      const res = await api.post("/canvas/createCanvas", {
        title: newTitle,
      });
      navigate(`/canvas/${res.data._id}`);
    } catch {
      alert("Failed to create canvas");
    }
  };

  const shareCanvas = async (canvasId, email) => {
    if (!email?.trim()) {
      alert("Email required");
      return;
    }

    try {
      await api.put("/canvas/shareCanvas", { canvasId, email });
      alert("Team member added");

      setShareEmails((prev) => ({
        ...prev,
        [canvasId]: "",
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add team member");
    }
  };

  return (
    <div className={`profile-container ${theme}`}>
      <header className="profile-header">
        <h2>Your Canvases</h2>
        <button
          className="theme-btn"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
        >
          Switch Theme
        </button>
      </header>

      <div className="create-canvas">
        <input
          type="text"
          placeholder="New canvas title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={createCanvas}>Create Canvas</button>
      </div>

      <div className="canvas-grid">
        {canvases.map((c) => (
          <div className="canvas-card" key={c._id}>
            <h3>{c.title}</h3>

            <button
              className="primary-btn"
              onClick={() => navigate(`/canvas/${c._id}`)}
            >
              Start Collab
            </button>

            <div className="share-section">
              <input
                type="email"
                placeholder="Add team member email"
                value={shareEmails[c._id] || ""}
                onChange={(e) =>
                  setShareEmails((prev) => ({
                    ...prev,
                    [c._id]: e.target.value,
                  }))
                }
              />
              <button
                className="secondary-btn"
                onClick={() =>
                  shareCanvas(c._id, shareEmails[c._id])
                }
              >
                Add New Team Member
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
