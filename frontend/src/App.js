import "./App.css";
import data from "./data.json";
import React, { useEffect, useRef, useState } from "react";
import ImageWithSpinner from "./ImageWithSpinner";
import ImageViewer from "./ImageViewer";
import StatusBar from "./StatusBar";
import { fetchItems, updateItems } from "./api";
import { isEqual } from "lodash";

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
          {galleryItems.map(({ title, position, type }, index) => {
            return (
              <div
                key={title}
                style={{ order: position }}
                className="card"
                draggable="true"
                onClick={() => {
                  openImage(title, type);
                }}
                onDragStart={(event) => {
                  event.target.style.opacity = 0.4;

                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({ title, type, position, index })
                  );
                }}
                onDragEnd={(event) => {
                  event.target.style.opacity = 1;
                }}
                onDragOver={(event) => {
                  if (event.preventDefault) {
                    event.preventDefault();
                  }
                  return false;
                }}
                onDrop={(event) => {
                  event.stopPropagation();

                  const drop = JSON.parse(
                    event.dataTransfer.getData("text/plain")
                  );
                  const gallery = Array.from(galleryItems);
                  gallery[index].position = drop.position;
                  gallery[drop.index].position = position;

                  setGalleryItems(gallery);
                  console.log(`${drop.title} dropped on ${title}`);
                }}
              >
                <div className="card-overlay"></div>
                <span>{title}</span>
                <ImageWithSpinner imgUrl={getImgUrl(title)} />
              </div>
            );
          })}
        </div>
      </header>
      <ImageViewer activeImg={activeImg} handleEsc={handleClose} />
    </div>
  );
}

export default App;
