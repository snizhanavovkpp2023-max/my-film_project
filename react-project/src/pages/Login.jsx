import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login({ onLogin }) {
    const initialValues = { username: "", email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            onLogin();
            navigate("/");
        }
    }, [formErrors]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.username) errors.username = "Username is required!";
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "Invalid email format!";
        }
        if (!values.password) {
            errors.password = "Password is required!";
        } else if (values.password.length < 4) {
            errors.password = "Min 4 characters!";
        }
        return errors;
    };

    return (
        <div className="login-page"> {/* Унікальний клас */}
            {Object.keys(formErrors).length === 0 && isSubmit && (
                <div className="login-success-msg">Signed in successfully</div>
            )}
            
            <form className="login-form-card" onSubmit={handleSubmit}>
                <h1 className="login-title">Login Form</h1>
                
                <div className="login-field-group">
                    <label>Username</label>
                    <input 
                        className="login-input" 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={formValues.username} 
                        onChange={handleChange}
                    />
                    <p className="login-error-text">{formErrors.username}</p>
                </div>

                <div className="login-field-group">
                    <label>Email</label>
                    <input 
                        className="login-input" 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formValues.email} 
                        onChange={handleChange}
                    />
                    <p className="login-error-text">{formErrors.email}</p>
                </div>

                <div className="login-field-group">
                    <label>Password</label>
                    <input 
                        className="login-input" 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={formValues.password} 
                        onChange={handleChange}
                    />
                    <p className="login-error-text">{formErrors.password}</p>
                </div>

                <button className="login-submit-btn">Submit</button>
            </form>
        </div>
    );
}

export default Login;