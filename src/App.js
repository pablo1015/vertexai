import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import VertexSearchspring from "./VertexSearchspring";
import VertexVersions from "./VertexVersions";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Top Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            <span className="navbar-brand">🔍 API Comparison</span>
            <div className="navbar-nav">
              <NavLink
                to="/vertex-searchspring"
                className="nav-link"
                activeClassName="active"
              >
                Vertex AI vs Searchspring
              </NavLink>
              <NavLink
                to="/vertexai-v1-v2"
                className="nav-link"
                activeClassName="active"
              >
                Vertex AI Search Versions
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Content Area - Full Width */}
        <div className="content-area">
          <Routes>
            <Route path="/vertex-searchspring" element={<VertexSearchspring />} />
            <Route path="/vertexai-v1-v2" element={<VertexVersions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
