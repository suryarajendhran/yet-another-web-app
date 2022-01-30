import { useState } from "react";
import("./ImageWithSpinner.css");

function ImageWithSpinner({ imgUrl }) {
  const [loading, updateLoading] = useState(true);
  return (
    <div className="image-container">
      <img
        style={{ display: loading ? "none" : "block" }}
        alt={imgUrl}
        src={imgUrl}
        onLoad={() => {
          updateLoading(false);
        }}
      />
      <div className="loader" style={{ display: loading ? "block" : "none" }}>
        {loading ? "Loading" : "Loaded"}
      </div>
    </div>
  );
}

export default ImageWithSpinner;
