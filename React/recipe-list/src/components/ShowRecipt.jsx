import React, { useEffect, useState } from "react";

const ShowRecipt = ({ onShowEvent }) => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    if (onShowEvent) {
      const { current } = onShowEvent();
      if (current) {
        setRecipe(current);
      }
    }
  }, [onShowEvent]);

  return (
    <>
      {recipe && (
        <div
          className={`fade${recipe.name ? " modal show" : ""}`}
          id="showRecipe"
          aria-hidden="true"
          aria-labelledby="showRecipeLabel"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="showRecipeLabel">
                  {recipe.name} | {recipe.type}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={(event) => {
                    event.preventDefault();
                    setRecipe(null);
                    onShowEvent().current = null;
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="card">
                  <img
                    src={recipe.image}
                    className="card-img-top img-fluid"
                    alt="Recipe Image"
                    style={{
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body">
                    <p className="card-text">
                      <strong className="fs-5">Cooking Time:</strong>{" "}
                      {recipe.cookingTime}
                    </p>
                    <p>
                      <strong className="fs-5">Ingredients:</strong>
                    </p>
                    <ul id="ingredients" className="list-unstyled fs-6">
                      {recipe.ingredients &&
                        recipe.ingredients.map((item, index) => (
                          <li className="list-group-item" key={index}>
                            {item}
                            <div>
                              <hr className="w-100 ms-9" />
                            </div>
                          </li>
                        ))}
                    </ul>
                    <p>
                      <strong className="fs-5">Comments:</strong>
                    </p>
                    <ul id="comments" className="list-unstyled fs-6">
                      {recipe.comments &&
                        recipe.comments.map((item, index) => (
                          <li className="list-group-item" key={index}>
                            {item}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowRecipt;
