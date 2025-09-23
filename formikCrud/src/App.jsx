import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./signup";
import Login from "./login";
import DashBoard from "./dashboard";
import PrivateRoute from "./privateRoutes";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* Private Route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;
