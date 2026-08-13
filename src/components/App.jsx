import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // GET: Fetch all toys when the application loads.
  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch toys");
        }

        return response.json();
      })
      .then((data) => setToys(data))
      .catch((error) => console.error("Error fetching toys:", error));
  }, []);

  // Show or hide the add-toy form.
  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // POST: Create a new toy and add it to the toys state.
  function handleAddToy(newToy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newToy,
        likes: 0,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add toy");
        }

        return response.json();
      })
      .then((createdToy) => {
        setToys((currentToys) => [...currentToys, createdToy]);
      })
      .catch((error) => console.error("Error adding toy:", error));
  }

  // DELETE: Remove a toy from the backend and from the toys state.
  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete toy");
        }

        setToys((currentToys) =>
          currentToys.filter((toy) => toy.id !== id)
        );
      })
      .catch((error) => console.error("Error deleting toy:", error));
  }

  // PATCH: Increase a toy's likes by one.
  function handleLikeToy(id) {
    const toy = toys.find((toy) => toy.id === id);

    if (!toy) {
      return;
    }

    fetch(`http://localhost:3001/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: toy.likes + 1,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to like toy");
        }

        return response.json();
      })
      .then((updatedToy) => {
        // Replace only the updated toy so the original order is maintained.
        setToys((currentToys) =>
          currentToys.map((toy) =>
            toy.id === updatedToy.id ? updatedToy : toy
          )
        );
      })
      .catch((error) => console.error("Error liking toy:", error));
  }

  return (
    <>
      <Header />

      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;