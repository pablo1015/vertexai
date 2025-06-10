import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./APIComparisonTool.css";

const APIComparisonTool = () => {
  const [query, setQuery] = useState("shirt");
  const [vertexAIResults, setVertexAIResults] = useState([]);
  const [searchSpringResults, setSearchSpringResults] = useState([]);
  const [vertexAIPage, setVertexAIPage] = useState(1);
  const [searchSpringPage, setSearchSpringPage] = useState(1);
  const [vertexPaginationInfo, setVertexPaginationInfo] = useState({});
  const [searchSpringPaginationInfo, setSearchSpringPaginationInfo] = useState({});
  const [vertexExecutionTime, setVertexExecutionTime] = useState(0);
  const [searchSpringExecutionTime, setSearchSpringExecutionTime] = useState(0);
  const [vertexFacets, setVertexFacets] = useState([]);
  const [searchSpringFacets, setSearchSpringFacets] = useState([]);
  const [selectedFacets, setSelectedFacets] = useState({});
  const [expandedFacets, setExpandedFacets] = useState({});

  const handleQueryChange = (e) => setQuery(e.target.value);

  const buildFilterFromFacets = () => {
    let filterParts = [];
    Object.keys(selectedFacets).forEach((facetKey) => {
      const facetValues = selectedFacets[facetKey];
      if (facetValues && facetValues.length > 0) {
        const values = facetValues.map((value) => `"${value}"`).join(",");
        filterParts.push(`${facetKey}:ANY(${values})`);
      }
    });
    return filterParts.join(" AND ");
  };

  const handleFacetChange = (facetKey, value) => {
    setSelectedFacets((prev) => {
      const updatedFacets = { ...prev };
      if (!updatedFacets[facetKey]) {
        updatedFacets[facetKey] = [];
      }
      if (updatedFacets[facetKey].includes(value)) {
        updatedFacets[facetKey] = updatedFacets[facetKey].filter((v) => v !== value);
      } else {
        updatedFacets[facetKey].push(value);
      }
      return updatedFacets;
    });
    fetchVertexAIResults();
    fetchSearchSpringResults();
  };

  const toggleFacetExpansion = (facetKey) => {
    setExpandedFacets((prev) => ({
      ...prev,
      [facetKey]: !prev[facetKey]
    }));
  };

  const fetchVertexAIResults = async () => {
    const startTime = performance.now();
    const payload = {
      query,
      filter: buildFilterFromFacets()
    };
    const url = `https://main-pagination-dynamic-facet-demo-667662262430.us-central1.run.app/search?offset=${(vertexAIPage - 1) * 10}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Vertex AI API returned status ${response.status}`);
      }

      const data = await response.json();
      const endTime = performance.now();

      setVertexAIResults(data.results || []);
      setVertexExecutionTime((endTime - startTime).toFixed(2));
      setVertexPaginationInfo({
        totalProducts: data.total_products || 0,
        pageCount: data.page_count || 1
      });

      setVertexFacets(data.facets || []);
    } catch (error) {
      console.error("Error fetching Vertex AI results:", error);
      setVertexAIResults([]);
    }
  };

  const fetchSearchSpringResults = async () => {
    const startTime = performance.now();
    const url = `https://pk5g8d.a.searchspring.io/api/search/search.json?siteId=pk5g8d&resultsFormat=json&q=${query}&resultsPerPage=10&page=${searchSpringPage}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`SearchSpring API returned status ${response.status}`);
      }

      const data = await response.json();
      const endTime = performance.now();

      setSearchSpringResults(data.results || []);
      setSearchSpringExecutionTime((endTime - startTime).toFixed(2));
      setSearchSpringPaginationInfo({
        totalResults: data.pagination?.totalResults || 0,
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1
      });
      setSearchSpringFacets(data.facets || []);
    } catch (error) {
      console.error("Error fetching SearchSpring results:", error);
      setSearchSpringResults([]);
    }
  };

  useEffect(() => {
    fetchVertexAIResults();
    fetchSearchSpringResults();
  }, [ vertexAIPage, searchSpringPage, selectedFacets]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setVertexAIPage(1);
    setSearchSpringPage(1);
    fetchVertexAIResults();
    fetchSearchSpringResults();
  };

  const renderVertexFacets = (facets, type) => {
    if (!facets || facets.length === 0) {
      return <div>No facets available</div>;
    }
  
    return facets.map((facet, index) => (
      <div key={index} className="card mb-3">
        {/* Facet Header */}
        <div
          className="card-header cursor-pointer"
          onClick={() => toggleFacetExpansion(facet.facet_key)}
        >
          <strong>{facet.facet_key}</strong>
        </div>
  
        {/* Facet Values */}
        {expandedFacets[facet.facet_key] && (
          <div className="card-body">
            {facet.facet_values.map((facetValue, idx) => {
              // Check if it's an interval or a simple value
              const displayLabel = facetValue.interval
                ? `${facetValue.interval.min} - ${facetValue.interval.max}`
                : facetValue.value;
  
              return (
                <div key={idx} className="form-check">
                  {/* Checkbox Input */}
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${type}-${facet.facet_key}-${idx}`}
                    checked={
                      selectedFacets[facet.facet_key]?.includes(displayLabel) || false
                    }
                    onChange={() =>
                      handleFacetChange(facet.facet_key, displayLabel)
                    }
                  />
                  {/* Facet Label */}
                  <label
                    htmlFor={`${type}-${facet.facet_key}-${idx}`}
                    className="form-check-label"
                  >
                    {displayLabel}{" "}
                    <span className="badge bg-secondary">
                      {facetValue.count}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ));
  };
  
  const renderFacets = (facets, type) => {
    if (!facets || facets.length === 0) {
      return <div>No facets available</div>;
    }

    return facets.map((facet, index) => (
      <div key={index} className="card mb-3">
        <div
          className="card-header cursor-pointer"
          onClick={() => toggleFacetExpansion(facet.field)}
        >
          <strong>{facet.label || facet.facet_key}</strong>
        </div>
        {expandedFacets[facet.field] && (
          <div className="card-body">
            {facet.values?.map((facetValue, idx) => (
              <div key={idx} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`${type}-${facet.field}-${idx}`}
                  checked={
                    selectedFacets[facet.field]?.includes(facetValue.value) || false
                  }
                  onChange={() => handleFacetChange(facet.field, facetValue.value)}
                />
                <label
                  htmlFor={`${type}-${facet.field}-${idx}`}
                  className="form-check-label"
                >
                  {facetValue.label} <span className="badge bg-secondary">{facetValue.count}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">API Comparison: SearchSpring vs Vertex AI Search</h1>
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <label htmlFor="query" className="form-label">Search Query</label>
            <input
              type="text"
              className="form-control"
              id="query"
              value={query}
              onChange={handleQueryChange}
            />
          </div>
        </div>
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary">Compare APIs</button>
        </div>
      </form>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h3 className="text-center">Vertex AI Search Results</h3>
          <div className="text-center mb-2">Execution Time: {vertexExecutionTime} ms</div>
          <div className="row">
            <div className="col-md-4">{renderVertexFacets(vertexFacets, "vertex")}</div>          
            <div id="resultsVertexAI" className=" col-md-8 results-container">
            {vertexAIResults.length ? vertexAIResults.map((product, index) => (
              <div key={index} className="product-card card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{product.brand}</h5>
                  <p className="card-text">{product.name}</p>
                  <p className="card-text">Price: ${product.price}</p>
                </div>
              </div>
            )) : <div className="text-center">No results found</div>}
          </div></div>

          <div className="pagination-info text-center mt-3">
            <p>Total Products: {vertexPaginationInfo.totalProducts || 0}</p>
            <p>Page {vertexAIPage} of {vertexPaginationInfo.pageCount || 1}</p>
          </div>
          <div className="text-center mt-3">
            <button
              className="btn btn-secondary mx-2"
              onClick={() => setVertexAIPage(vertexAIPage - 1)}
              disabled={vertexAIPage <= 1}
            >
              Previous Page
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => setVertexAIPage(vertexAIPage + 1)}
              disabled={vertexAIPage >= (vertexPaginationInfo.pageCount || 1)}
            >
              Next Page
            </button>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <h3 className="text-center">SearchSpring Results</h3>
          <div className="text-center mb-2">Execution Time: {searchSpringExecutionTime} ms</div>
          <div>{renderFacets(searchSpringFacets, "searchspring")}</div>
          <div id="resultsSearchSpring" className="results-container">
            {searchSpringResults.length ? searchSpringResults.map((product, index) => (
              <div key={index} className="product-card card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{product.brand}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Price: ${product.price}</p>
                </div>
              </div>
            )) : <div className="text-center">No results found</div>}
          </div>
          <div className="pagination-info text-center mt-3">
            <p>Total Results: {searchSpringPaginationInfo.totalResults || 0}</p>
            <p>Page {searchSpringPaginationInfo.currentPage || 1} of {searchSpringPaginationInfo.totalPages || 1}</p>
          </div>
          <div className="text-center mt-3">
            <button
              className="btn btn-secondary mx-2"
              onClick={() => setSearchSpringPage(searchSpringPage - 1)}
              disabled={searchSpringPage <= 1}
            >
              Previous Page
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => setSearchSpringPage(searchSpringPage + 1)}
              disabled={searchSpringPage >= (searchSpringPaginationInfo.totalPages || 1)}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIComparisonTool;
