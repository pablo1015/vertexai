import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import APIComparisonTool from "./APIComparisonTool";

const App = () => {
  const [query, setQuery] = useState("vem3546t");
  const [squery, setSQuery] = useState("vem3546t");
  const [selectedFacets, setSelectedFacets] = useState({}); // ✅ Ensure it's always an object

  const handleInputChange = (e) => setSQuery(e.target.value);
  const handleClick = () => setQuery(squery);
  const clearSelectedFacets = () => setSelectedFacets({});

  return (
    <div className="App">
      <h1 className="text-center mt-4 mb-4">Search API Comparison Tool</h1>

      {/* Search Input */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Enter search query..."
            value={squery}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={handleClick}
            disabled={!squery.trim()}
          >
            Search
          </button>
        </div>
      </div>

      {/* Display Selected Facets */}
      {selectedFacets && Object.keys(selectedFacets).length > 0 && (
        <div className="row mb-4">
          <div className="col">
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <strong>Selected Facets</strong>
                <button
                  className="btn btn-sm btn-light float-end"
                  onClick={clearSelectedFacets}
                >
                  Clear All
                </button>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {Object.entries(selectedFacets).map(([key, values]) => (
                    <li key={key} className="list-group-item">
                      <strong>{key}:</strong> {Array.isArray(values) ? values.join(", ") : values}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* API Comparison Tool */}
      <APIComparisonTool
        query={squery}
        setQuery={setQuery}
        selectedFacets={selectedFacets || {}} // ✅ Ensure it's always an object
        setSelectedFacets={setSelectedFacets}
      />
    </div>
  );
};




export default App;
