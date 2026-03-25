import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieDetails.css";

const API_KEY = "98138c63a861324b0f438a55809fb381";
const BASE_URL = "https://api.themoviedb.org/3";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { favorites, addToFavorites, removeFromFavorites } = useMovieContext();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [loading, setLoading] = useState(true);

    const isFavorite = favorites?.some(f => f.id === parseInt(id));

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // Деталі фільму
                const movieRes = await fetch(
                    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=uk-UA`
                );
                const movieData = await movieRes.json();
                setMovie(movieData);

                // Трейлер
                const videoRes = await fetch(
                    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
                );
                const videoData = await videoRes.json();
                const yt = videoData.results?.find(
                    v => v.site === "YouTube" && v.type === "Trailer"
                );
                setTrailer(yt || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) return <div className="details-loading">Завантаження...</div>;
    if (!movie) return <div className="details-loading">Фільм не знайдено</div>;

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    return (
        <div className="details-page">
            <button className="details-back-btn" onClick={() => navigate(-1)}>
                ← Назад
            </button>

            <div className="details-hero">
                <img
                    className="details-poster"
                    src={posterUrl}
                    alt={movie.title}
                />

                <div className="details-info">
                    <h1 className="details-title">{movie.title}</h1>

                    {movie.tagline && (
                        <p className="details-tagline">"{movie.tagline}"</p>
                    )}

                    <div className="details-meta">
                        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                        <span>📅 {movie.release_date?.slice(0, 4)}</span>
                        <span>⏱ {movie.runtime} хв</span>
                    </div>

                    <div className="details-genres">
                        {movie.genres?.map(g => (
                            <span key={g.id} className="details-genre-tag">
                                {g.name}
                            </span>
                        ))}
                    </div>

                    <p className="details-overview">{movie.overview}</p>

                    <button
                        className={`details-fav-btn ${isFavorite ? "active" : ""}`}
                        onClick={() =>
                            isFavorite
                                ? removeFromFavorites(movie.id)
                                : addToFavorites(movie)
                        }
                    >
                        {isFavorite ? "❤️ В улюблених" : "🤍 Додати в улюблені"}
                    </button>
                </div>
            </div>

            {trailer && (
                <div className="details-trailer">
                    <h2>Трейлер</h2>
                    <div className="details-video-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="Trailer"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; 
                                   encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;