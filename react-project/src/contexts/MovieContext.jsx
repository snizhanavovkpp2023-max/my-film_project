import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();
const API = "http://localhost:5000/api";

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            
            const fetchFavorites = async (username) => {
                try {
                    const res = await fetch(`${API}/favorites/${username}`);
                    const data = await res.json();
                    setFavorites(data);
                } catch (err) {
                    console.error("Помилка завантаження фаворитів:", err);
                }
            };

            fetchFavorites(user.username);
        }
    }, []);

    const syncFavorites = async (newFavorites) => {
        if (!currentUser) return;
        try {
            await fetch(`${API}/favorites/${currentUser.username}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ favorites: newFavorites })
            });
        } catch (err) {
            console.error("Помилка синхронізації:", err);
        }
    };

    const login = async (formValues) => {
        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                setCurrentUser(data.user);
                setFavorites(data.user.favorites || []);
            }

            return data;
        } catch (err) {
            console.error("Помилка логіну:", err);
            return { success: false, message: "Помилка сервера" };
        }
    };

    const logout = () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        setFavorites([]);
    };

    const addToFavorites = async (movie) => {
        const newFavorites = [...favorites, movie];
        setFavorites(newFavorites);
        await syncFavorites(newFavorites);
    };

    const removeFromFavorites = async (movieId) => {
        const newFavorites = favorites.filter(m => m.id !== movieId);
        setFavorites(newFavorites);
        await syncFavorites(newFavorites);
    };

    const isFavorite = (movieId) => favorites.some(m => m.id === movieId);

    const value = { 
        favorites, 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite, 
        currentUser, 
        login, 
        logout 
    };

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => useContext(MovieContext);