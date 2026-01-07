import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";

import RoleSelect from './pages/RoleSelect'
import TeacherCreatePoll from './pages/TeacherCreatePoll';
import PollResults from './pages/PollResult';
import PollHistory from './pages/PollHistory';
import StudentJoin from './pages/StudentJoin';
import LivePoll from './pages/LivePoll';
import RequireRole from './components/RequireRole';
import ChatWidget from './components/ChatWidget';


function App() {
  // useLocation causes re-render on navigation, allowing us to check sessionStorage
  const location = useLocation();
  const role = sessionStorage.getItem("role");

  // Show chat widget on all pages except home and student join
  const showChatWidget = role && location.pathname !== "/" && location.pathname !== "/student/join";

  return (
    <>
    <Routes>
      <Route path="/" element={<RoleSelect />} />

      {/* Teacher */}
       <Route
        path="/teacher/create"
        element={
          <RequireRole role="TEACHER">
            <TeacherCreatePoll />
          </RequireRole>
        }
      />
      <Route
        path="/poll/results"
        element={
          <RequireRole role="TEACHER">
            <PollResults />
          </RequireRole>
        }
      />
      <Route
        path="/poll/history"
        element={
          <RequireRole role="TEACHER">
            <PollHistory />
          </RequireRole>
        }
      />

      {/* Student */}
      <Route
        path="/student/join"
        element={
          <RequireRole role="STUDENT">
            <StudentJoin />
          </RequireRole>
        }
      />
      <Route
        path="/poll/live"
        element={
          <RequireRole role="STUDENT">
            <LivePoll />
          </RequireRole>
        }
      />
    </Routes>
    {showChatWidget && <ChatWidget />}
    </>
  )
}

export default App
