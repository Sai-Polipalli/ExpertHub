
import { useState } from "react";
import "./App.css";

// 1. Expert data
const experts = [
  {
    id: 1,
    name: "Arun Kumar",
    role: "Frontend Developer",
    status: "available",
    skills: ["React", "JavaScript", "CSS"],
    github: "https://github.com/",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Full Stack Developer",
    status: "available",
    skills: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/",
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Backend Developer",
    status: "busy",
    skills: ["Java", "Spring Boot", "SQL"],
    github: "https://github.com/",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "UI/UX Engineer",
    status: "available",
    skills: ["Figma", "CSS", "React"],
    github: "https://github.com/",
  },
  {
    id: 5,
    name: "Vikram Patel",
    role: "Cloud Engineer",
    status: "left",
    skills: ["AWS", "Docker", "Kubernetes"],
    github: "https://github.com/",
  },
];

// 2. Expert card
function ExpertCard({ expert, onChat, onSchedule }) {
  const unavailable = expert.status !== "available";

  return (
    <div className="expert-card">
      <div className="card-top">
        <div className="avatar">
          {expert.name
            .split(" ")
            .map((word) => word[0])
            .join("")}
        </div>

        <span className={`status status-${expert.status}`}>
          {expert.status === "available"
            ? "Available"
            : expert.status === "busy"
            ? "Busy"
            : "Former employee"}
        </span>
      </div>

      <h3>{expert.name}</h3>
      <p className="expert-role">{expert.role}</p>

      <h4>Tech Stack</h4>

      <div className="tech-list">
        {expert.skills.map((skill) => (
          <span className="tech-tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>

      <a
        href={expert.github}
        target="_blank"
        rel="noreferrer"
        className="github-link"
      >
        GitHub Profile ↗
      </a>

      <div className="card-actions">
        {unavailable ? (
          <button
            className="primary-button full-button"
            onClick={() => onChat(expert, true)}
          >
            Chat with Clone
          </button>
        ) : (
          <>
            <button
              className="secondary-button"
              onClick={() => onChat(expert, false)}
            >
              Chat
            </button>

            <button
              className="primary-button"
              onClick={() => onSchedule(expert)}
            >
              Schedule
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// 3. Schedule popup
function ScheduleModal({ expert, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button
          className="close-button"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>

        <h2>Schedule with {expert.name}</h2>

        {confirmed ? (
          <>
            <h3>Meeting request created!</h3>
            <p>Date: {date}</p>
            <p>Time: {time}</p>

            <p className="demo-note">
              Demo only. No calendar invitation was sent.
            </p>

            <button
              className="primary-button"
              onClick={onClose}
              type="button"
            >
              Done
            </button>
          </>
        ) : (
          <form
            className="schedule-form"
            onSubmit={(event) => {
              event.preventDefault();
              setConfirmed(true);
            }}
          >
            <label htmlFor="meeting-date">
              Select date
            </label>

            <input
              id="meeting-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <label htmlFor="meeting-time">
              Select time
            </label>

            <select
              id="meeting-time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
            >
              <option value="">Choose a time</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
            </select>

            <button
              className="primary-button full-button"
              type="submit"
            >
              Confirm Schedule
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// 4. Main App component
export default function App() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [chatExpert, setChatExpert] = useState(null);
  const [scheduleExpert, setScheduleExpert] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const filteredExperts = experts.filter((expert) => {
    const query = search.toLowerCase();

    const matchesSearch =
      expert.name.toLowerCase().includes(query) ||
      expert.role.toLowerCase().includes(query) ||
      expert.skills.some((skill) =>
        skill.toLowerCase().includes(query)
      );

    const matchesFilter =
      filter === "all" ||
      (filter === "available" &&
        expert.status === "available") ||
      (filter === "clone" &&
        expert.status !== "available");

    return matchesSearch && matchesFilter;
  });

  function openChat(expert, isClone) {
    setChatExpert({ ...expert, isClone });

    setMessages([
      {
        from: "expert",
        text: isClone
          ? `Hello! This is the AI clone demo for ${expert.name}. How can I help?`
          : `Hello! I'm ${expert.name}. How can I help you?`,
      },
    ]);

    setMessage("");
  }

  function sendMessage(event) {
    event.preventDefault();

    if (!message.trim()) return;

    setMessages((previous) => [
      ...previous,
      { from: "you", text: message },
      {
        from: "expert",
        text: "This is a demo response. Connect a backend for real replies.",
      },
    ]);

    setMessage("");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h2>ExpertHub</h2>
        <span>Internal Knowledge Network</span>
      </header>

      <main className="page-container">
        <h1>Find an Expert</h1>

        <p>
          Connect with experts, explore their skills,
          and schedule a meeting.
        </p>

        <div className="directory-toolbar">
          <input
            className="search-box"
            type="search"
            placeholder="Search name, role, or skill..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All experts</option>
            <option value="available">Available</option>
            <option value="clone">AI Clone</option>
          </select>
        </div>

        <div className="expert-grid">
          {filteredExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onChat={openChat}
              onSchedule={setScheduleExpert}
            />
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <p>No experts found. Try another search.</p>
        )}
      </main>

      {/* Chat popup */}
      {chatExpert && (
        <div className="modal-backdrop">
          <div className="modal">
            <button
              className="close-button"
              type="button"
              onClick={() => setChatExpert(null)}
            >
              ✕
            </button>

            <h2>
              {chatExpert.isClone
                ? `${chatExpert.name}'s AI Clone`
                : `Chat with ${chatExpert.name}`}
            </h2>

            <div className="chat-messages">
              {messages.map((item, index) => (
                <p
                  key={index}
                  className={`message ${
                    item.from === "you" ? "message-you" : ""
                  }`}
                >
                  {item.text}
                </p>
              ))}
            </div>

            <form
              onSubmit={sendMessage}
              className="chat-input"
            >
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message..."
                aria-label="Type your message"
              />

              <button
                type="submit"
                className="primary-button"
              >
                Send
              </button>
            </form>

            <small>
              Demo only. Messages are not sent to a real employee.
            </small>
          </div>
        </div>
      )}

      {/* Schedule popup */}
      {scheduleExpert && (
        <ScheduleModal
          expert={scheduleExpert}
          onClose={() => setScheduleExpert(null)}
        />
      )}
    </div>
  );
}
