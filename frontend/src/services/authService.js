import axios from "axios";
import { toast } from "react-toastify";

// Remove trailing slash from BACKEND_URL if it exists
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '') : '';

// Email validation
export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data) {
      toast.success("Registration successful");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error; // Propagate error to component for proper handling
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      userData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data) {
      toast.success("Login successful");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/logout`, {
      withCredentials: true
    });
    toast.success("Logout successful");
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};

// Forgot Password
export const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/forgotpassword`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};

// Reset Password
export const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/users/resetpassword/${resetToken}`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};

// Get Login Status
export const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};

// Get User Profile
export const getUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/getuser`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};

// Update Profile
export const updateUser = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/updateuser`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};

// Change Password
export const changePassword = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/changepassword`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw error;
  }
};