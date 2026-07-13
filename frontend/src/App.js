import React from "react";
import { Routes, Route } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes> 
      </header>
    </div>
  );
}

export default App;
