import LandingPage from "./Landingpage"; 
import LoginPage from "./LoginPage";
import RegisterPage from "./Registerpage";
import ProjectsPage from "./Projectspage"; 
import { Routes, Route } from "react-router";

export default function App() {

  return(
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  )
}

