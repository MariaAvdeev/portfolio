import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import SvgComponent from "./Icon";
import { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddToList = () => {
    if (inputValue.trim() !== "") {
      setList([
        ...list, 
        inputValue
      ]);
      setInputValue("");
    }
  };

  const clearItems = () => {
    setList([]);
  };

  const deleteItem = (indexToRemove) => {
setList(list.filter((_, item) => item !== indexToRemove));
  };

  return (
    <>
      <div className="container vh-100 d-flex justify-content-center align-items-center text-bg-secondary">
        <div className="text-bg-light p-4 m-4 rounded-3 fs-5">
          <h1>
            To-Do List
            <span className="note-icon">
              <SvgComponent />
            </span>
          </h1>

          <div className="container con">
            <div className="input-group mb-3">
              <input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter a new item..."
                type="text"
                id="add-new"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <button
                onClick={handleAddToList}
                className="input-group-text text-bg-secondary"
                id="inputGroup-sizing-default"
              >
                Add
              </button>
            </div>
            <ul>
              {list.map((item, index) => (
                <li key={index} className="form-check checkbox-1">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    value=""
                    id={"check-" + index}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={"check-" + index}
                  >
                    {item}
                  </label>

                  <button
                    onClick={() => deleteItem(index)}
                    type="button"
                    className="btn-close float-end"
                    aria-label="Close"
                  ></button>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center" onClick={clearItems}>
            <button type="button" className="btn btn-secondary">
              Clear Items
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
