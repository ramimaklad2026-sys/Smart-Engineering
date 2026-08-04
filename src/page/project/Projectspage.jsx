import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { SquarePlus, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_BASE_URL = "https://buildsphere-backend.onrender.com";

const STATUS_CONFIG = {
  "In Progress": { label: "In Progress", bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", bar: "bg-blue-500" },
  Completed: { label: "Completed", bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400", bar: "bg-green-500" },
  "On Hold": { label: "On Hold", bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400", bar: "bg-yellow-500" },
  Planning: { label: "Planning", bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400", bar: "bg-gray-500" },
  Pending: { label: "Pending", bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400", bar: "bg-purple-500" },
};

function ProjectCard({ project, onView, onDelete }) {
  const currentStatus = project.status || "Pending";
  const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG["Pending"];
  const progressPercent = project.progress !== undefined ? project.progress : 0;
  const projectId = project._id || project.id;

  return (
    <div className="group bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-xl p-5 transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-500 text-xs mt-1">Smart Engineering Project</p>
        </div>
        <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
        {project.description || "No description provided."}
      </p>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-gray-500 text-xs">Progress</span>
          <span className="text-white text-xs font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${status.bar}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-800">
        <span className="text-xs text-gray-500">
          ID: {projectId ? `${projectId.substring(0, 8)}...` : "Unknown"}
        </span>

        <div className="flex items-center gap-3">
          <Link to={`/projects/${projectId}`}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
          >
            View
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={() => onDelete(projectId)}
            className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors flex items-center gap-1 border border-red-500/20 hover:border-red-500/40 px-2 py-1 rounded bg-red-500/5"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateProjectModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Project Name (Title) is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await axios.post(
        `${API_BASE_URL}/api/projects`,
        { title, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdProject = response.data?.project || response.data?.data || response.data;
      onCreate(createdProject);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project. Please verify authentication.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-gray-950 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div>
            <h2 className="text-white font-bold text-lg">New Project</h2>
            <p className="text-gray-500 text-xs mt-0.5">Fill in the details to create a project on Render Server</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Project Name (Title) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sky Tower Residential"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm font-medium py-3 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { t, i18n } = useTranslation();


  const [activeProjectId, setActiveProjectId] = useState(null);

  const changeLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";

    i18n.changeLanguage(newLanguage);

    document.documentElement.dir =
      newLanguage === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = newLanguage;
  };

  const fetchProjects = async () => {
    try {
      setLoadingPage(true);
      setPageError("");
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token || token === "undefined" || token === "null") {
        throw new Error("No valid token found. Please log in again.");
      }

      const response = await axios.get(`${API_BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.data && Array.isArray(response.data.data.projects)) {
        setProjects(response.data.data.projects);
      } else if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else if (response.data && Array.isArray(response.data.projects)) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
      setPageError(err.response?.data?.message || err.message || "Failed to fetch projects.");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    let checkTimer;
    let fetchTimer;

    const attemptFetch = () => {
      const currentToken = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!currentToken && retryCount < 3) {
        checkTimer = setTimeout(() => setRetryCount(prev => prev + 1), 200);
      } else {
        fetchTimer = setTimeout(() => fetchProjects(), 50);
      }
    };

    attemptFetch();
    return () => {
      clearTimeout(checkTimer);
      clearTimeout(fetchTimer);
    };
  }, [retryCount]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      inProgress: projects.filter((p) => p.status === "In Progress").length,
      completed: projects.filter((p) => p.status === "Completed").length,
      onHold: projects.filter((p) => p.status === "On Hold").length,
    };
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const projectTitle = p.title || "";
      const projectDesc = p.description || "";
      const matchSearch = projectTitle.toLowerCase().includes(search.toLowerCase()) || projectDesc.toLowerCase().includes(search.toLowerCase());
      const currentStatus = p.status || "Pending";
      return (filterStatus === "All" || currentStatus === filterStatus) && matchSearch;
    });
  }, [projects, search, filterStatus]);

  const handleCreate = (newProject) => {
    if (newProject) setProjects((prev) => [newProject, ...prev]);
  };

  const handleDeleteProject = async (projectId) => {
    if (!projectId || !window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => (p._id || p.id) !== projectId));
      alert("Project deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project.");
    }
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading projects from BuildSphere Server...</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-none">Smart Projects</h1>
              <p className="text-gray-500 text-xs mt-0.5">Live Database Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => { localStorage.clear(); onNavigate("landing"); }}
                className="text-xs text-gray-400 hover:text-white border border-gray-800 px-3 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
            <button
              onClick={changeLanguage}
              className="text-gray-300 hover:text-white text-sm transition-colors px-4 py-2"
            >
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
            >
              <SquarePlus />
              <span className="hidden sm:inline">New Project</span>
            </button>
            <Link to="/profile">
              <div className="relative shrink-0">
                <div className="w-13 h-13 grid place-items-center overflow-hidden border-[5px] border-[#101a2d] rounded-3xl text-[#93c5fd] bg-gradient-to-br from-[#1e3a8a] to-[#172554] shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
                  <UserRound size={25} />
                </div>
                <span className="absolute -right-[1px] bottom-[9px] w-[20px] h-[20px] border-[4px] border-[#101a2d] rounded-full bg-[#22c55e]" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {pageError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex justify-between items-center">
            <span>{pageError}</span>
            <button onClick={fetchProjects} className="bg-red-500/20 text-red-300 px-3 py-1.5 rounded-lg text-xs font-semibold">Retry</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value={stats.total} accent="bg-blue-500/10" icon="📁" />
          <StatCard label="In Progress" value={stats.inProgress} accent="bg-blue-500/10" icon="⚡" />
          <StatCard label="Completed" value={stats.completed} accent="bg-green-500/10" icon="✓" />
          <StatCard label="On Hold" value={stats.onHold} accent="bg-yellow-500/10" icon="⏸" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 flex-wrap">
            {["All", "In Progress", "Completed", "On Hold"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? "bg-blue-600 text-white" : "bg-gray-900 border border-gray-700 text-gray-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No projects linked to this account</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project._id || project.id || index}
                project={project}
                onView={(id) => setActiveProjectId(id)}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${accent}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-gray-500 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}