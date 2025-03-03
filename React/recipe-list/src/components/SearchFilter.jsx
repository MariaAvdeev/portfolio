import React, { useState } from "react";

const SearchFilter = ({ sendSearch }) => {
  const [searchValue, setSearchValue] = useState('')

  const submit = (event) => {
    event.preventDefault();
    sendSearch(searchValue);
  }

  return (
    <form className="d-flex" role="search" onSubmit={submit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        id="search-1"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchFilter;
