import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout";
import CreateAccount from "./components/CreateAccount";
import Home from "./components/Home";
import Login from "./components/Login";
import AddItem from "./components/AddItem";
import RemoveItem from "./components/RemoveItem";
import CreateList from "./components/CreateList";
import RemoveList from "./components/RemoveList";
import ShareList from "./components/ShareList";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Logout from "./components/Logout";
import "./App.css";

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/remove-item" element={<RemoveItem />} />
        <Route path="/create-list" element={<CreateList />} />
        <Route path="/remove-list" element={<RemoveList />} />
        <Route path="/share-list" element={<ShareList />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
