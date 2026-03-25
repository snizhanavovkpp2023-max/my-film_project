import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import MovieDetails from "./pages/MovieDetails";
import { useMovieContext } from "./contexts/MovieContext";

function AppContent() {
  const { currentUser } = useMovieContext()
  const isLoggedIn = !!currentUser

  return (
    <div className="app-container">
      {isLoggedIn && <NavBar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/favorites" element={isLoggedIn ? <Favorites /> : <Navigate to="/login" />} />
          <Route path="/movie/:id" element={isLoggedIn ? <MovieDetails /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {isLoggedIn && <Footer />}
    </div>
  )
}

function App() {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
}

export default App;