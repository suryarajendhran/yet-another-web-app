import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import ImageWithSpinner from "./ImageWithSpinner";
import ImageViewer from "./ImageViewer";
import StatusBar from "./StatusBar";
import { fetchItems, updateItems } from "./api";
import { isEqual } from "lodash";
import Card from "./Card";

function App() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const galleryItemsRef = useRef();
  galleryItemsRef.current = galleryItems;

  const getImgUrl = (title) =>
    `https://fakeimg.pl/250x250/ff0000,128/333333,255/?text=${title}&font=lobster`;

  const openImage = (title, type) => {
    updateActiveImg(getImgUrl(title));
  };

  const switchPositions = (index1, position1, index2, position2) => {
    const gallery = Array.from(galleryItems);
    gallery[index1].position = position2;
    gallery[index2].position = position1;

    setGalleryItems(gallery);
  };

  const saveData = () => {
    const lastSavedItems = JSON.parse(localStorage.getItem("lastSavedItems"));
    const currentGalleryItems = Array.from(galleryItemsRef.current);
    if (!isEqual(lastSavedItems, currentGalleryItems)) {
      console.log("Update required!");
      setLoading(true);
      const itemsToBeUpdated = currentGalleryItems.map((item) => {
        return {
          id: item.id,
          position: item.position,
        };
      });
      updateItems(itemsToBeUpdated).then((res) => {
        if (res) {
          localStorage.setItem(
            "lastSavedItems",
            JSON.stringify(currentGalleryItems)
          );
          setLastSavedTime(
            new Date().toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          );
        } else {
          console.error("Something went wrong while updating");
        }
        setLoading(false);
      });
    }
  };
  useEffect(() => {
    fetchItems().then((items) => {
      localStorage.setItem("lastSavedItems", JSON.stringify(items));
      setGalleryItems(items);
      setInterval(saveData, 5000);
    });
  }, []);
  const handleClose = () => {
    updateActiveImg(null);
  };
  const [activeImg, updateActiveImg] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        <StatusBar lastSavedTime={lastSavedTime} isLoading={loading} />
        <div className="gallery">
          {galleryItems.map(({ title, position, id, type }, index) => {
            return (
              <Card
                title={title}
                type={type}
                position={position}
                id={id}
                index={index}
                openImage={openImage}
                switchPositions={switchPositions}
              />
            );
          })}
        </div>
      </header>
      <ImageViewer activeImg={activeImg} handleEsc={handleClose} />
    </div>
  );
}

export default App;
