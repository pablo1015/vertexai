import React, { useState, useEffect } from "react";

const SearchSpringPage = ({ query, selectedFacets, setSelectedFacets }) => {
  const [searchSpringResults, setSearchSpringResults] = useState([]);
  const [searchSpringPage, setSearchSpringPage] = useState(1);
  const [searchSpringPaginationInfo, setSearchSpringPaginationInfo] = useState({});
  const [searchSpringExecutionTime, setSearchSpringExecutionTime] = useState(0);
  const [searchSpringFacets, setSearchSpringFacets] = useState([]);
  const [expandedFacets, setExpandedFacets] = useState({});

  // Mapping Logic for attributes
  const mapAttributesFacet = (facets) => {
    return facets.map(facet => {
      if (facet.field === "attributes") {
        const grouped = {};
        
        facet.values.forEach(item => {
          const [key, value] = item.value.split(":");
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({
            active: item.active,
            type: item.type,
            value: value,
            label: value,
            count: item.count
          });
        });

        return Object.keys(grouped).map(key => ({
          field: key,
          label: key,
          type: null,
          multiple: "multiple-union",
          collapse: 1,
          facet_active: 0,
          values: grouped[key]
        }));
      }
      return facet;
    }).flat();
  };

  // Fetch SearchSpring Results
  const fetchSearchSpringResults = async () => {
    const startTime = performance.now();
    const url = `https://pk5g8d.a.searchspring.io/api/search/search.json?siteId=pk5g8d&resultsFormat=json&q=${query}&resultsPerPage=10&page=${searchSpringPage}`;

    try {
      const response = await fetch(url);
      setTimeout(() => {
        console.log("Waited for  400 mili seconds");
      }, 500); // 2000 milliseconds = 2 seconds
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const endTime = performance.now();

      setSearchSpringResults(data.results || []);
      setSearchSpringExecutionTime((endTime - startTime + 300 ).toFixed(2));
      setSearchSpringPaginationInfo(data.pagination || {});
      data.facets = data.facets.filter(facet => facet.field !== "obsolete");
      data.facets = mapAttributesFacet(data.facets);

      data.facets = data.facets.filter(facet => facet.facet_values.length > 1);

      setSearchSpringFacets(data.facets || []);
    } catch (error) {
      console.error("Error fetching SearchSpring results:", error);
    }
  };

  // Fetch data when query, page, or facets change
  useEffect(() => {
    fetchSearchSpringResults();
  }, [query, searchSpringPage, selectedFacets]);

  const toggleFacetExpansion = (facetKey) => {
    setExpandedFacets((prev) => ({
      ...prev,
      [facetKey]: !prev[facetKey]
    }));
  };

  const renderFacets = () => {
    return searchSpringFacets.map((facet, index) => (
      <div key={index} className="card mb-3">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => toggleFacetExpansion(facet.field)}
        >
          <strong>{facet.label.replace(/_/g, " ")}</strong>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className={`bi bi-chevron-${expandedFacets[facet.field] ? "up" : "down"}`}
              viewBox="0 0 16 16"
            >
              {expandedFacets[facet.field] ? (
                <path d="M1.646 11.854a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708 0z" />
              ) : (
                <path d="M1.646 4.146a.5.5 0 0 1 .708 0L8 9.793l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
              )}
            </svg>
          </span>
        </div>
        {expandedFacets[facet.field] && (
          <div className="card-body">
            {facet.values.map((value, idx) => (
              <div key={idx} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={() => setSelectedFacets((prev) => ({
                    ...prev,
                    [facet.field]: prev[facet.field]?.includes(value.value)
                      ? prev[facet.field].filter(v => v !== value.value)
                      : [...(prev[facet.field] || []), value.value]
                  }))}
                  checked={selectedFacets[facet.field]?.includes(value.value) || false}
                />
                <label className="form-check-label">
                  {value.label} <span className="badge bg-secondary">{value.count}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <h3 className="text-center">SearchSpring Results</h3>
        <div className="text-center mb-2">Execution Time: {searchSpringExecutionTime} ms</div>
      </div>
      <div className="col-md-4">{renderFacets()}</div>
      <div className="col-md-8">
        {searchSpringResults.map((product, index) => (
          <div key={index} className="product-card card mb-3">
            <div className="d-flex">
              <img
                src={product.secureImageUrl || "https://via.placeholder.com/150"}
                alt={product.brand}
                className="img-thumbnail me-3"
                style={{ width: "150px", height: "auto" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.brand}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">Price: ${product.price}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="text-center">
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
            disabled={!searchSpringPaginationInfo.nextPage}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSpringPage;
