import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/smgh_website_logo.png";
import { Context } from "../../Context";

export default function Header() {
  const [user, setUser] = useState({});

  const { setSnackbar } = useContext(Context);

  useEffect(() => {
    let controller = new AbortController();
    axios
      .get("/api/user", { withCredentials: true, signal: controller.signal })
      .then((response) => {
        setUser(response.data);
      })
      .catch((_) => setSnackbar({ children: "Error occurred.", severity: "error" }));
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#fff !important" }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="logo" height={50} />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/pricing">
                Pricing
              </a>
            </li>
            {!!user.name && (
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-offset="10" aria-haspopup="true" aria-expanded="false" style={{ border: "none", background: "#fff" }}>
                  <Avatar
                    src={user.image}
                    alt={user.name?.trim()}
                    sx={{ display: "inline-flex", width: 20, height: 20, verticalAlign: "text-bottom", fontSize: "small", bgcolor: "#264c7e", fontWeight: 400 }}
                  />
                  &nbsp;{user.name}
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="/logout">
                    Logout
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
