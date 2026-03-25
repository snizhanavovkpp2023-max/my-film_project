import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login"; 
import { Routes, Route, Navigate } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { useState } from "react"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <MovieProvider>
      <div className="app-container">
        {isLoggedIn && <NavBar />}
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={<Login onLogin={() => setIsLoggedIn(true)} />} 
            />

            <Route 
              path="/" 
              element={isLoggedIn ? <Home /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/favorites" 
              element={isLoggedIn ? <Favorites /> : <Navigate to="/login" />} 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {isLoggedIn && <Footer />}
        
      </div>
    </MovieProvider>
  );
}

export default App;