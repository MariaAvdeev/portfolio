import React, { useState, useEffect, useRef } from "react";
import IndexDb from "../utils/database";
import ShowRecipt from "./ShowRecipt";

const List = ({ recipes, onAddEvent, hideClose = false }) => {
  const dbWrapper = new IndexDb("recipe_app", "reciepts");

  const [recipesList, setRecipesList] = useState(recipes || []);
  const [recipe, setRecipe] = useState(null);

  const showRecipeRef = useRef(null);

  useEffect(() => {
    setRecipesList(recipes || []);
  }, [recipes]);

  useEffect(() => {
    if (onAddEvent) {
      const { current } = onAddEvent();
      if (current) {
        dbWrapper.open(function (db) {
          dbWrapper.put(db, current, () => {
            setRecipesList({
              ...recipesList,
              current,
            });
          });
        });
      }
    }

    return dbWrapper.close();
  }, [onAddEvent]);

  const deleteLayoutItem = (indexToRemove, name) => {
    if (hideClose) {
      return;
    }
    dbWrapper.open((db) => {
      dbWrapper.delete(db, name, () => {
        const currentReceipts = recipesList.filter(
          (_, item) => item !== indexToRemove
        );
        setRecipesList(currentReceipts);
        dbWrapper.close();
      });
    });
  };

  return (
    <div className="d-flex flex-wrap mt-4">
      {recipesList.map((recipe, index) => (
        <a
          href="#"
          key={index}
          onClick={(event) => {
            event.preventDefault();
            showRecipeRef.current = recipe;
            setRecipe(recipe);
          }}
          className="border m-2 p-3 text-center position-relative"
          style={{
            backgroundImage: `url(${recipe.image || ""})`,
            backgroundSize: "cover",
            width: "135px",
            height: "135px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            zIndex: 1,
          }}
        >
          {!hideClose && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                deleteLayoutItem(index, recipe.name);
              }}
              type="button"
              className="btn-close"
              aria-label="Close"
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                zIndex: 10,
              }}
            ></button>
          )}
          <span
            style={{
              backgroundColor: "#cdd2d8",
              borderRadius: "3px",
              fontSize: "10px",
            }}
          >
            {recipe.name}
          </span>
        </a>
      ))}
      <ShowRecipt
        onShowEvent={() => {
          setRecipe(null);
          return showRecipeRef;
        }}
      />
    </div>
  );
};

export default List;
