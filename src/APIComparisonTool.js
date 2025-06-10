/* APIComparisonTool.js */
import React from "react";
import VertexAIPage from "./VertexAIPageV2";
import SearchSpringPage from "./SearchSpringPage";

const APIComparisonTool = ({ query="vem3546t", setQuery, selectedFacets, setSelectedFacets }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Section */}
        <div className="col-md-6" style={{ borderRight: "1px solid #ccc", padding: "20px" }}>
          <h3 className="text-center">Vertex AI Search</h3>
          <VertexAIPage
            query={query} // Pass updated query from parent
            setQuery={setQuery} // Pass the handler
            selectedFacets={selectedFacets || {}}
            setSelectedFacets={setSelectedFacets}
          />
        </div>

        {/* Right Section */}
        <div className="col-md-6" style={{ padding: "20px" }}>
          <h3 className="text-center">SearchSpring</h3>
          <SearchSpringPage
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

export default APIComparisonTool;
