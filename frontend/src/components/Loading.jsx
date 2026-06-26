import "../styles/Loading.css";

function Loading() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">Loading... Please wait.</p>
    </div>
  );
}

export default Loading;