import axios from "axios";
import { useEffect, useState } from "react";
export default function ShowPlaces() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios
      .get("/places")
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      {places.map((place) => (
        <div key={place._id}>
          <h2>{place.title}</h2>
          <p>{place.description}</p>
          <span className="block">{place.address}</span>
          <span className="block">Check IN : {place.checkIn}</span> -{" "}
          <span className="block">Check Out : {place.checkOut}</span>
          <span className="block">Gusts : {place.maxGuests}</span>
          <span className="block">${place.price}</span>
          <div className="flex flex-row">
            {place.image.map((i, index) => (
              <img src={i} key={index} style={{ width: "200px" }} />
            ))}
          </div>
          <hr />
        </div>
      ))}
    </>
  );
}
