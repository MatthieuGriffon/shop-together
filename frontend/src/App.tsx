import React from "react";
import { Routes, Route } from "react-router-dom";
import { Button } from "antd";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Hello, ShopTogether</h1>
      <Button type="primary">Ant Design Button</Button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

const Home: React.FC = () => {
  return <div>Home</div>;
};

const About: React.FC = () => {
  return <div>About</div>;
};

export default App;
