/* APIComparisonVertexVersions.js */
import React from "react";
import VertexAIPage from "./VertexAIPage";
import VertexAIPageV2 from "./VertexAIPageV2";

const APIComparisonVertexVersions = ({ query, setQuery, selectedFacets, setSelectedFacets }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Section */}
        <div className="col-md-6" style={{ borderRight: "1px solid #ccc", padding: "20px" }}>
          <h3 className="text-center">Vertex AI Search V1</h3>
          <VertexAIPage
            query={query} // Pass updated query from parent
            setQuery={setQuery} // Pass the handler
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
          />
        </div>

        {/* Right Section */}
        <div className="col-md-6" style={{ padding: "20px" }}>
          <h3 className="text-center">Vertex AI Search V2 - with Cache & Category-Facet system</h3>
          <VertexAIPageV2
            query={query} // Pass updated query from parent
            setQuery={setQuery} // Pass the handler
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
          />
        </div>
      </div>
    </div>
  );
};

export default APIComparisonVertexVersions;
