import React from "react";
import Homepage from "./pages/Homepage";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./styles/style.css";

function App() {
  return (
    <div>
      <Nav />
      <Homepage />
      <Footer />
    </div>
  );
}

export default App;
