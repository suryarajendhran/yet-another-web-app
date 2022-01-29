import logo from "./logo.svg";
import "./App.css";
import data from "./data.json";
import React, { useState } from "react";

function App() {
  const [galleryItems, updateGalleryItems] = useState(
    data.sort((item1, item2) => item1.position - item2.position)
  );
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
                onDragStart={(event) => {
                  event.target.style.opacity = 0.4;

                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", title);
                }}
                onDragEnd={(event) => {
                  event.target.style.opacity = 1;

                  //TODO: Remove .over from all items
                }}
                onDragEnter={(event) => {
                  event.target.classList.add("over");
                }}
                onDragLeave={(event) => {
                  event.target.classList.remove("over");
                }}
                onDragOver={(event) => {
                  if (event.preventDefault) {
                    event.preventDefault();
                  }
                  return false;
                }}
                onDrop={(event) => {
                  event.stopPropagation();

                  const droppedItemTitle =
                    event.dataTransfer.getData("text/plain");
                  const droppedItem = galleryItems.find(
                    (galleryItem) => galleryItem.title === droppedItemTitle
                  );
                  

                  console.log(`${droppedItemTitle} dropped on ${title}`);
                }}
              >
                {title}
              </div>
            );
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
