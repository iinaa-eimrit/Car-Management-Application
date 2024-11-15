import { createSlice } from "@reduxjs/toolkit";

// Safely parse the "name" value from localStorage
let name = "";
try {
  name = JSON.parse(localStorage.getItem("name")) || "";
} catch (error) {
  console.error("Failed to parse 'name' from localStorage:", error);
}

// Define the initial state
const initialState = {
  isLoggedIn: false,
  name,
  user: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
  },
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      // Update "name" in localStorage and state
      const newName = action.payload;
      try {
        localStorage.setItem("name", JSON.stringify(newName));
      } catch (error) {
        console.error("Failed to store 'name' in localStorage:", error);
      }
      state.name = newName;
    },
    SET_USER(state, action) {
      // Update user profile information in state
      const profile = action.payload;
      state.user.name = profile.name || "";
      state.user.email = profile.email || "";
      state.user.phone = profile.phone || "";
      state.user.bio = profile.bio || "";
      state.user.photo = profile.photo || "";
    },
  },
});

// Export actions
export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

// Export reducer
export default authSlice.reducer;
