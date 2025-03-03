import React, { useState, useRef } from "react";
import List from "./List";

const AddRecipeModal = (props) => {
  const { recipes, items } = props;

  const [typeOfRecipe, setTypeOfRecipe] = useState("");
  const [list, setList] = useState([]);
  const [listSteps, setListSteps] = useState([]);
  const [ingredient, setIngredient] = useState();
  const [recipeName, setRecipeName] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [comments, setComments] = useState();
  const [backgroundImg, setBackgroundImg] = useState("");

  const addRecipeRef = useRef(null);

  const handleFileClick = (event) => {
    event.target.value = null;
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputListChange = (event) => {
    setIngredient(event.target.value);
  };

  const inputListSteps = (event) => {
    setComments(event.target.value);
  };


  const addListIngredient = () => {
    if (ingredient && ingredient.trim() !== "") {
      setList([...list, ingredient.trim()]);
      setIngredient("");
    } else {
      alert("Add a list of ingridients");
    }
  };

  const addListOfSteps = () => {
    if (comments && comments.trim() !== "") {
      setListSteps([...listSteps, comments.trim()]);
      setComments("");
    } else {
      alert("Add a list of steps");
    }
  };

  const deleteItem = (indexToRemove) => {
    setList(list.filter((_, item) => item !== indexToRemove));
  };

  const deleteItemSteps = (indexToRemove) => {
    setListSteps(listSteps.filter((_, item) => item !== indexToRemove));
  };

  const addRecipe = () => {
    if (
      recipeName.trim() &&
      typeOfRecipe.trim() &&
      list.length &&
      cookingTime.trim()
    ) {
      const newItem = {
        name: recipeName,
        type: typeOfRecipe,
        ingredients: list,
        cookingTime,
        comments: listSteps,
        image: backgroundImg,
      };
      recipes.push(newItem);
      addRecipeRef.current = newItem;

      setRecipeName("");
      setTypeOfRecipe("Set type of recipe");
      setList([]);
      setCookingTime("");
      setComments([]);
      setBackgroundImg("");
      setListSteps([]);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Recipe
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="offcanvas-body">
              <div className="card card-body">
                <div className="input-group input-group-sm mb-3">
                  <select
                    value={typeOfRecipe}
                    className="form-select"
                    onChange={(e) => setTypeOfRecipe(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a type
                    </option>
                    {items.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="text"
                    placeholder="Add a recipe name"
                    className="form-control"
                    onChange={(e) => setRecipeName(e.target.value)}
                    value={recipeName}
                  />
                </div>
                <div className="container con">
                  <div className="input-group input-group-sm mb-3">
                    <input
                      value={ingredient || ""}
                      onChange={inputListChange}
                      type="text"
                      placeholder="Enter a new ingredient..."
                      className="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                    <button
                      onClick={addListIngredient}
                      className="input-group-text text-bg-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {list.map((item, index) => (
                      <li key={index}>
                        <label>{item}</label>
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
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="text"
                    value={cookingTime}
                    placeholder="Add a time for cooking"
                    className="form-control"
                    onChange={(e) => setCookingTime(e.target.value)}
                  />
                </div>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    onClick={handleFileClick}
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>

                <div className="container con">
                  <div className="input-group input-group-sm mb-3">
                    <input
                      value={comments || ""}
                      onChange={inputListSteps}
                      type="text"
                      placeholder="Enter a step of cooking..."
                      className="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                    <button
                      onClick={addListOfSteps}
                      className="input-group-text text-bg-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {listSteps.map((item, index) => (
                      <li key={index}>
                        <label>{item}</label>
                        <button
                          onClick={() => deleteItemSteps(index)}
                          type="button"
                          className="btn-close float-end"
                          aria-label="Close"
                        ></button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={addRecipe}
                  >
                    Add Recipe
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <List
                  recipes={recipes}
                  onAddEvent={() => addRecipeRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecipeModal;
