import "../styles/ErrorMessage.css";

function ErrorMessage({ message = "An unexpected error occurred."}) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;