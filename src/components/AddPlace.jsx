import { useEffect, useState } from "react";
import axios from "axios";
import Perks from "./Perks";
import { useNavigate } from "react-router-dom";

export default function AddPlace() {
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [address, setAddress] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [maxGuests, setMaxGuests] = useState(null);
  const [price, setPrice] = useState(0);

  //   useEffect(() => {
  //     if (!action) {
  //       return;
  //     }
  //     axios.get(`/places/${id}`).then((response) => {
  //       setPlace(response.data);
  //     });
  //     setPlace({
  //       name: "My place",
  //       description: "This is my place",
  //     });
  //   }, [action]);

  function AddByLink() {
    if (imageLink === "" || imageLink === null) {
      return;
    } else {
      axios
        .post("/upload-by-link", {
          link: imageLink,
        })
        .then((response) => {
          const { image } = response.data;
          setImages((current) => {
            return [...current, image];
          });
        });
    }
  }

  function AddByFiles(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }
    axios
      .post("/uploads", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data } = response;
        setImages((current) => {
          return [...current, ...data];
        });
      });
  }

  function handleCbClick(current) {
    setSelected(current);
  }

  function handleSubmit() {
    axios
      .post("/places", {
        title,
        description,
        image: images,
        perks: selected,
        address,
        checkIn,
        checkOut,
        maxGuests,
        price,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/account/bookings");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div class="bg-white shadow p-4 py-8" x-data="{ images: [] }">
        <Perks onChange={handleCbClick} selected={selected} />
        <div class="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
          <input
            class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="Upload Image By Link"
            type="text"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
          />
          <div class="buttons flex justify-end">
            <div
              class="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
              onClick={AddByLink}
            >
              Add Image Link
            </div>
          </div>
          <textarea
            class="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
            spellcheck="false"
            placeholder="Describe everything about this post here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div class="icons flex text-gray-500 m-2">
            <label id="select-image">
              <svg
                class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <input hidden type="file" multiple onChange={AddByFiles} />
              <div class="images mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div className="image" key={index}>
                    <img src={image} alt="" />
                  </div>
                ))}
              </div>
            </label>
            <div class="count ml-auto text-gray-400 text-xs font-semibold">
              0/300
            </div>
          </div>
          <input
            class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="checkIn"
            type="text"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <input
            class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="checkOut"
            type="text"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
          <input
            class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="maxGuests"
            type="text"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
          />
          <input
            class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}
