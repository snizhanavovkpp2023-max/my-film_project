import React from 'react';
import "../css/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">Cineffy</div>
                <p>&copy; {new Date().getFullYear()} Усі права захищені</p>
            </div>
        </footer>
    );
}

export default Footer;