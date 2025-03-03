import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import background from "./assets/photo/pumpkin-curry-soup-recipe.jpg";
import background2 from "./assets/photo/download 2.png"
import AddRecipeModal from "./components/AddRecipeModal";
import SearchFilter from "./components/SearchFilter";
import List from "./components/List";
import IndexDb from "./utils/database";

function App() {
  const categories = ["soup", "salad", "sweet"];
  const dbWrapper = new IndexDb("recipe_app", "reciepts");
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState([]);
  const [isBackgroundGray, setBackgroundGray] = useState(false);

  const backgroundImageStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    height: "100vh",
    width: "100vw",
  };
  
  const  changeBackground = {
    backgroundImage: `url(${background2})`,
    height: "100vh",
    width: "100vw",
  };

  useEffect(() => {
    dbWrapper.open(function (db) {
      dbWrapper.getAllKeys(db, (result) => {
        setRecipes(result);
      });
    });

    return () => {
      dbWrapper.close();
    };
  }, []);

  const sendSearch = (searchValue) => {
    if (searchValue) {
      const currentList = recipes.filter(
        (item) =>
          item.type.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.ingredients.includes(searchValue.toLowerCase())
      );
      setBackgroundGray(true);
      setSearch(currentList);
    } else {
      setSearch([]);
      setBackgroundGray(false);
    }
  };

  const dropdown = (e) => {
    e.preventDefault();
    const type = e.target.getAttribute('data-type');

    const selectedRecipes = recipes.filter((item) => item.type === type || type === "All");
    setSearch(selectedRecipes);
    setBackgroundGray(type);
  };

  return (
    <div style={isBackgroundGray ? changeBackground :backgroundImageStyle}>
      <nav className="navbar bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Recipe World</span>
          <div className="btn-group">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </button>
            <ul className="dropdown-menu" onClick={dropdown}>
              {categories.map((item, index) => (
                <li key={index}>
                  <a 
                    className="dropdown-item" 
                    href="#" 
                    data-type={item}
                    onClick={dropdown}
                  >
                    {item[0].toUpperCase() + String(item).slice(1)}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  className="dropdown-item" 
                  href="#" 
                  data-type="All"
                  onClick={dropdown}
                >
                  All
                </a>
              </li>
            </ul>
          </div>
          <SearchFilter sendSearch={sendSearch} />
        </div>
      </nav>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        data-bs-whatever="@getbootstrap"
      >
        Add Recipe
      </button>
      <AddRecipeModal recipes={recipes} items={categories} />
      <List recipes={search} hideClose={true} />
    </div>
  );
}

export default App;
