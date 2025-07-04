import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  async function fetchDogWithDetails() {
    const url =
      "https://api.thedogapi.com/v1/images/search?has_breeds=true&limit=1";
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

      // ✅ Pick a random breed from the filtered list
      const randomIndex = Math.floor(Math.random() * breedsWithImages.length);
      const breed = breedsWithImages[randomIndex];
      const referenceImageId = breed.reference_image_id;

      // Step 2: Get the actual image URL
      const imageRes = await axios.get(
        `https://api.thedogapi.com/v1/images/${referenceImageId}`,
        { headers }
      );
      const imageUrl = imageRes.data.url;

      console.log("✅ Image URL:", imageUrl);
      console.log("🐶 Name:", breed.name);
      console.log("🧬 Temperament:", breed.temperament);

      setImageUrl(imageUrl); // assuming you're in React
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

  const [imageUrl, setImageUrl] = useState("");
  const [breed, setBreed] = useState("");
  const [temperament, setTemperament] = useState("");
  const [purpose, setPurpose] = useState("");
  const [longevity, setLongevity] = useState("");
  return (
    <>
      <h1>Puppy Pals</h1>

      <div className="attributes-list">
        <h4>Breed: {breed}</h4>
        <h4>Temperament: {temperament}</h4>
        <h4>Lifespan: {longevity}</h4>
        <h4>Purpose: {purpose}</h4>
      </div>
      <div className="dog-photo">
        {imageUrl && <img src={imageUrl} alt="Random Dog" width="300" />}
      </div>
      <div className="card">
        <button onClick={fetchDogWithDetails}>Generate Random Photo</button>
      </div>
    </>
  );
}

export default App;
