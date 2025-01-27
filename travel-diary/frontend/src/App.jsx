import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Diaries from "./pages/Diaries";
import Chapters from "./pages/Chapters";
import AddChapter from "./pages/AddChapter";
import Map from "./pages/Map";
import Trips from "./pages/Trips";
import TripInfo from "./pages/TripInfo";
import AddTripInfo from "./pages/AddTripInfo";
import Dashboard from "./pages/Dashboard";
import Weather from "./pages/Weather";
import Events from './pages/Events';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diaries"
          element={
            <ProtectedRoute>
              <Diaries />
            </ProtectedRoute>
          }
        />
        <Route path="/diaries/:id" element={<Chapters />} />
        <Route
          path="/diaries/:id/chapters/:chapterId/edit"
          element={
            <ProtectedRoute>
              <AddChapter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:id"
          element={
            <ProtectedRoute>
              <TripInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:id/add/:type"
          element={
            <ProtectedRoute>
              <AddTripInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:id/edit/:infoId"
          element={
            <ProtectedRoute>
              <AddTripInfo editMode={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        <Route path="/events" element={<Events />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
