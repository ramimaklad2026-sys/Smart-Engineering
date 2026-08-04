import LandingPage from "./page/home/Landingpage";
import LoginPage from "./page/log-sign-in/LoginPage";
import RegisterPage from "./page/log-sign-in/Registerpage";
import ProjectsPage from "./page/project/Projectspage"; 
import Projectdetails from "./page/project/Projectdetails";
import GeminiChat from "./GeminiChat";
import { Routes, Route } from "react-router-dom";
import Profile from "./profile";

export default function App() {

  return(
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectId" element={<Projectdetails />} />
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/gemini" element={<GeminiChat />} />
    </Routes>
  )
}

