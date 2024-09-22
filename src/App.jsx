import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function SimpleApiFilter() {
  const [apiInput, setApiInput] = useState('{"data":["M","1","334","4","B"]}');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "AP21110010324"; // Replace with your actual roll number
  }, []);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(apiInput);
      setError("");
      const response = await axios.post(
        "http://localhost:3000/bfhl",
        parsedData
      );
      setResponseData(response.data);
      applyFilters(response.data, selectedFilters);
    } catch (error) {
      setError("Invalid JSON input or server error!");
      setResponseData(null);
      setFilteredResponses([]);
    }
  };

  const applyFilters = (data, filters) => {
    if (!data) return;

    const results = filters.map((filter) => {
      switch (filter) {
        case "numbers":
          return `Numbers: ${data.numbers.join(", ")}`;
        case "alphabets":
          return `Alphabets: ${data.alphabets.join(", ")}`;
        case "highest_lowercase_alphabet":
          return `Highest Lowercase Alphabet: ${data.highest_lowercase_alphabet}`;
        default:
          return `All: ${JSON.stringify(data)}`;
      }
    });

    setFilteredResponses(results);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value && !selectedFilters.includes(value)) {
      setSelectedFilters((prev) => [...prev, value]);
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    setFilteredResponses([]); // Clear previous responses
  };

  // Calculate the width based on the input length
  const calculateWidth = (input) => {
    const length = input.length;
    return `${Math.max(200, length * 8)}px`; // Minimum width of 200px and each character adds 8px
  };

  return (
    <div className="container">
      <div className="input-group">
        <label htmlFor="api-input">API Input</label>
        <input
          id="api-input"
          value={apiInput}
          onChange={(e) => setApiInput(e.target.value)}
          style={{ width: calculateWidth(apiInput) }}
          placeholder='{"data":["M","1","334","4","B"]}'
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      <div className="input-group">
        <label htmlFor="filter">Multi Filter</label>
        <select id="filter" onChange={handleFilterChange} defaultValue="">
          <option value="" disabled>
            Select a filter
          </option>
          <option value="numbers">Numbers</option>
          <option value="alphabets">Alphabets</option>
          <option value="highest_lowercase_alphabet">
            Highest Lowercase Alphabet
          </option>
          <option value="all">ALL</option>
        </select>
      </div>
      <div className="input-group">
        <label>Selected Filters</label>
        <div className="filtered-response">
          {selectedFilters.length > 0
            ? selectedFilters.map((filter, index) => (
                <span key={index} className="filter-tag">
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="remove-filter"
                  >
                    X
                  </button>
                </span>
              ))
            : "No filters selected"}
        </div>
      </div>
      <div className="input-group">
        <label>Filtered Responses</label>
        <div className="filtered-response">
          {filteredResponses.map((response, index) => (
            <div key={index}>{response}</div>
          ))}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
