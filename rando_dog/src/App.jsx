import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import FilterBar from "../components/FilterBar";

function App() {
  const removeFilter = (indexToRemove) => {
    setFilters((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  async function fetchDogWithDetails() {
    const headers = {
      "x-api-key":
        "live_g3P7lpMeevZvxyEyihMTLJMTaod4XKxBYV3ptsFO3ItprrqeRLpadbfEXnytsSIG",
    };

    try {
      // Step 1: Get all breeds that have reference_image_id
      const breedRes = await axios.get("https://api.thedogapi.com/v1/breeds", {
        headers,
      });

      const breedsWithImages = breedRes.data.filter(
        (b) => b.reference_image_id
      );

      let breed, referenceImageId;
      let count = 0;

      do {
        const randomIndex = Math.floor(Math.random() * breedsWithImages.length);
        breed = breedsWithImages[randomIndex];
        referenceImageId = breed.reference_image_id;
        count += 1;
      } while ((!referenceImageId || !dogMatchesFilters(breed)) && count < 10);

      // Step 2: Get the actual image URL
      const imageRes = await axios.get(
        `https://api.thedogapi.com/v1/images/${referenceImageId}`,
        { headers }
      );

      const imageUrl = imageRes.data.url;

      setImageUrl(imageUrl);
      setTemperament(breed.temperament);
      setBreed(breed.name);
      setLongevity(breed.life_span);
      setPurpose(breed.bred_for);

      return { imageUrl, breed };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const [filters, setFilters] = useState([]);

  function addFilter(newFilter) {
    setFilters((prev) => [...prev, newFilter]);
  }

  function clearFilters() {
    setFilters([]);
  }

  function dogMatchesFilters(dog) {
    return filters.every((filter) => {
      const field = dog[filter.type];
      if (!field) return false;

      return field.toLowerCase().includes(filter.value.toLowerCase());
    });
  }

  const [imageUrl, setImageUrl] = useState("");
  const [breed, setBreed] = useState("");
  const [temperament, setTemperament] = useState("");
  const [purpose, setPurpose] = useState("");
  const [longevity, setLongevity] = useState("");
  return (
    <>
      <div className="app-container">
        <div className="main-content">
          <h1>Puppy Pals</h1>

          <div className="attributes-list">
            <button onClick={() => addFilter({ type: "name", value: breed })}>
              {breed}
            </button>
            <button
              onClick={() =>
                addFilter({ type: "temperament", value: temperament })
              }
            >
              {temperament}
            </button>
            <button
              onClick={() => addFilter({ type: "life_span", value: longevity })}
            >
              {longevity}
            </button>
            <button
              onClick={() => addFilter({ type: "bred_for", value: purpose })}
            >
              {purpose}
            </button>
          </div>
          <div className="dog-photo">
            {imageUrl && <img src={imageUrl} alt="Random Dog" width="300" />}
          </div>
          <div className="card">
            <button onClick={fetchDogWithDetails}>Generate Random Photo</button>
          </div>
        </div>
        <FilterBar filters={filters} removeFilter={removeFilter} />
      </div>
    </>
  );
}

export default App;
