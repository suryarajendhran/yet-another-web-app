import("./ImageViewer.css");

function ImageViewer({ activeImg, handleEsc }) {
  let modalBackgroundClass = `modal-background ${activeImg ? "" : "hidden"}`;
  const handleKeyPress = (event) => {
    if (event.keyCode === 27) {
      handleEsc();
    }
  };
  document.addEventListener("keydown", handleKeyPress, false);

  const handleClickOnBackground = (event) => {
      event.preventDefault();
      if(event.target === event.currentTarget) {
          handleEsc();
      }
  }

  return (
    <div className={modalBackgroundClass} onClick={handleClickOnBackground}>
      <div className="modal-container">
        <img src={activeImg} alt={activeImg} />
      </div>
    </div>
  );
}

export default ImageViewer;
