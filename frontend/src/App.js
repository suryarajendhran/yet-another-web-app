import "./App.css";
import data from "./data.json";
import React, { useState, useEffect, useRef } from "react";
import ImageWithSpinner from "./ImageWithSpinner";
import ImageViewer from "./ImageViewer";
import StatusBar from "./StatusBar";
import api, { updateItems } from "./api";

function App() {
  const [galleryItems, updateGalleryItems] = useState([]);
  const [latestRemoteState, setLatestRemoteState] = useState([]);
  const [isLoading, updateIsLoading] = useState(false);
  const [lastSavedTime, updateLastSavedTime] = useState(null);
  const remoteStateRef = useRef();
  const currentStateRef = useRef();
  remoteStateRef.current = latestRemoteState;
  currentStateRef.current = galleryItems;

  const getImgUrl = (title) =>
    `https://fakeimg.pl/250x250/ff0000,128/333333,255/?text=${title}&font=lobster`;
  const openImage = (title, type) => {
    updateActiveImg(getImgUrl(title));
  };
  const sortArrayByProperty = (array, property) =>
    array.sort((item1, item2) => item1[property] - item2[property]);

  const objectFromArray = (array) => {
    const objectMap = {};
    for (const item of array) {
      objectMap[item.id] = item;
    }
    return objectMap;
  };

  function saveData() {
    const latestRemote = objectFromArray(remoteStateRef.current);
    const currentState = objectFromArray(currentStateRef.current);

    const updates = [];

    for (const id of Object.keys(currentState)) {
      if (currentState[id].position !== latestRemote[id].position) {
        updates.push({ id: parseInt(id), position: currentState[id].position });
      }
    }

    if (updates.length > 0) {
      console.log("Updates detected: ", updates);
      try {
        updateIsLoading(true);
        updateItems(updates).then((status) => {
          if (status) {
            const lastSavedTimeString = new Date().toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            setLatestRemoteState(
              currentStateRef.current.map((item) => {
                return { ...item };
              })
            );
            setTimeout(() => {
              updateLastSavedTime(lastSavedTimeString);
              updateIsLoading(false);
            }, 2500);
          }
        });
      } catch (err) {
        console.error("Error while updating: ", err);
      }
    }
  }

  useEffect(() => {
    updateIsLoading(true);
    api.fetchItems().then((items) => {
      updateGalleryItems(items.map((item) => ({ ...item })));
      setLatestRemoteState(items.map((item) => ({ ...item })));
      updateIsLoading(false);
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
        <StatusBar lastSavedTime={lastSavedTime} isLoading={isLoading} />
        <div className="gallery">
          {sortArrayByProperty(galleryItems, "position").map(
            ({ title, position, type }, index) => {
              return (
                <div
                  key={title}
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

                    updateGalleryItems(gallery);
                    console.log(`${drop.title} dropped on ${title}`);
                  }}
                >
                  <div className="card-overlay"></div>
                  <span>{title}</span>
                  <ImageWithSpinner imgUrl={getImgUrl(title)} />
                </div>
              );
            }
          )}
        </div>
      </header>
      <ImageViewer activeImg={activeImg} handleEsc={handleClose} />
    </div>
  );
}

export default App;
