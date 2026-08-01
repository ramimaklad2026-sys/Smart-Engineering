import LandingPage from "./Landingpage"; 
import LoginPage from "./LoginPage";
import RegisterPage from "./Registerpage";
import ProjectsPage from "./Projectspage"; 
import { Routes, Route } from "react-router";
import GeminiChat from "./GeminiChat";

export default function App() {

  return(
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/gemini" element={<GeminiChat />} />
    </Routes>
  )
}

