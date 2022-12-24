import { Alert, Snackbar } from "@mui/material";
import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./assets/css/bootstrap.min.css";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import Pricing from "./Components/Pricing/Pricing";
import { Context } from "./Context";
import Post from "./Components/Post/Post";

function App() {
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);
  const value = useMemo(() => ({ setSnackbar }), [setSnackbar]);

  return (
    <div className="App">
      <BrowserRouter>
        <Context.Provider value={value}>
          <Header />
          <div style={{ background: "whitesmoke" }}>
            <Routes>
              <Route index element={<Login />} />
              <Route
                path="dashboard"
                element={
                  <RequireAuth>
                    <p>Hemlo guys</p>
                  </RequireAuth>
                }
              />
              <Route path="post" element={<Post />} />
              <Route path="pricing" element={<Pricing />} />
            </Routes>
          </div>
        </Context.Provider>
        <Footer />
        {!snackbar && (
          <Snackbar open autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </BrowserRouter>
    </div>
  );
}

function RequireAuth({ children }) {
  const isAuthenticated = document.cookie.split(";").some((cookie) => {
    return cookie.split("=")[0].trim() === "user";
  });
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default App;
