import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { name, email, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Basic validation
    if (!name || !email || !password || !password2) {
      toast.error("All fields are required");
      return false;
    }
    if (name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (password !== password2) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const register = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      
      if (data) {
        // Update Redux store
        dispatch(SET_LOGIN(true));
        dispatch(SET_NAME(data.name));
        
        // Clear form
        setFormData(initialState);
        
        // Redirect to dashboard
        navigate("/dashboard");
        
        // Success message is already shown by the service
      }
    } catch (error) {
      // Error toast is already shown by the service
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2>Register</h2>

          <form onSubmit={register}>
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              value={name}
              onChange={handleInputChange}
              minLength={2}
              className={styles.input}
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
              className={styles.input}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
              minLength={6}
              className={styles.input}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
              minLength={6}
              className={styles.input}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="--btn --btn-primary --btn-block"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className={styles.register}>
            <Link to="/" className={styles.link}>
              Home
            </Link>
            <p className={styles.text}>&nbsp; Already have an account? &nbsp;</p>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;