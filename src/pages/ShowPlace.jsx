import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export default function ShowPlace() {
  const [place, setPlace] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/place/${id}`)
      .then((response) => {
        setPlace(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  return (
    <>
      <h1>{place.title}</h1>
      <p>{place.description}</p>
      <span className="block">{place.address}</span>
      <span className="block">Check IN : {place.checkIn}</span> -{" "}
      <span className="block">Check Out : {place.checkOut}</span>
      <span className="block">Gusts : {place.maxGuests}</span>
      <span className="block">${place.price}</span>
      <span>{place.image}</span>
    </>
  );
}
