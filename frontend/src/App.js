import "./App.css";
import data from "./data.json";
import React, { useState } from "react";
import ImageWithSpinner from "./ImageWithSpinner";
import ImageViewer from "./ImageViewer";

function App() {
  const [galleryItems, updateGalleryItems] = useState(
    data.sort((item1, item2) => item1.position - item2.position)
  );
  const openImage = (title, type) => {
    updateActiveImg(
      `https://fakeimg.pl/250x250/ff0000,128/333333,255/?text=${title}&font=lobster`
    );
  };
  const handleClose = () => {
    updateActiveImg(null);
  };
  const [activeImg, updateActiveImg] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        <div className="gallery">
          {galleryItems.map(({ title, position, type }, index) => {
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
                  gallery[index] = { ...drop, position: position };
                  gallery[drop.index] = {
                    title,
                    type,
                    position: drop.position,
                  };

                  updateGalleryItems(gallery);
                  console.log(`${drop.title} dropped on ${title}`);
                }}
              >
                <span>{title}</span>
                <ImageWithSpinner
                  imgUrl={`https://fakeimg.pl/250x250/ff0000,128/333333,255/?text=${title}&font=lobster`}
                />
              </div>
            );
          })}
        </div>
      </header>
      <ImageViewer activeImg={activeImg} handleEsc={handleClose}/>
    </div>
  );
}

export default App;
