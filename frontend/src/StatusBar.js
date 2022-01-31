import("./StatusBar.css");

function StatusBar({ lastSavedTime, isLoading }) {
  return (
    <div className="status-bar">
      <div className="loader-container">
        <div
          className="loader"
          style={{ display: isLoading ? "block" : "none" }}
        >
          {isLoading ? "Loading" : "Loaded"}
        </div>
      </div>
      {/* <div className="status-bar-item">{isLoading ? "Saving" : ""}</div> */}
      {lastSavedTime ? <div>{`Last saved at: ${lastSavedTime}`}</div> : ""}
    </div>
  );
}

export default StatusBar;
