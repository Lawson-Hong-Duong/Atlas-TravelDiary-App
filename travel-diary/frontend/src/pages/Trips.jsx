import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { IconTrash } from "@tabler/icons-react";
import {
  Card,
  Image,
  Text,
  Button,
  Overlay,
  Modal,
  ActionIcon,
  Group,
  Box,
  Loader,
} from "@mantine/core";
import defaultTripImage from "../assets/images/default-trip.jpg";

const baseURL = api.defaults.baseURL.replace("/api", "");

const Trips = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    photo: null,
  });

  const navigate = useNavigate();

  const calculateXpAndRank = (trips, diaries) => {
    const newXp = trips.length * 10 + diaries.length * 10;
    let newRank = "Rookie";

    if (newXp >= 1000) {
      newRank = "Globetrotter";
    } else if (newXp >= 800) {
      newRank = "Explorer";
    } else if (newXp >= 600) {
      newRank = "Adventurer";
    } else if (newXp >= 400) {
      newRank = "Voyager";
    } else if (newXp >= 200) {
      newRank = "Wanderer";
    } else if (newXp >= 100) {
      newRank = "Traveler";
    }

    return { newXp, newRank };
  };

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const res = await api.get("/trips");
        setTrips(res.data);
        setAuthState((prevState) => {
          const updatedState = {
            ...prevState,
            trips: res.data,
          };
          const { newXp, newRank } = calculateXpAndRank(
            res.data,
            prevState.diaries
          );
          return {
            ...updatedState,
            xp: newXp,
            rank: newRank,
          };
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [setAuthState]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const createTrip = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("tripName", formData.tripName);
      data.append("destination", formData.destination);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      if (formData.photo) {
        data.append("photo", formData.photo);
      }
      const res = await api.post("/trips", data);
      const newTrip = res.data;
      setTrips((prevTrips) => [...prevTrips, newTrip]);
      setAuthState((prevState) => {
        const updatedTrips = [...prevState.trips, newTrip];
        const { newXp, newRank } = calculateXpAndRank(
          updatedTrips,
          prevState.diaries
        );
        return {
          ...prevState,
          trips: updatedTrips,
          xp: newXp,
          rank: newRank,
        };
      });
      setModalIsOpen(false);
      setFormData({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
        photo: null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openTrip = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const handleDelete = async (tripId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
      setAuthState((prevState) => {
        const updatedTrips = prevState.trips.filter(
          (trip) => trip._id !== tripId
        );
        const { newXp, newRank } = calculateXpAndRank(
          updatedTrips,
          prevState.diaries
        );
        return {
          ...prevState,
          trips: updatedTrips,
          xp: newXp,
          rank: newRank,
        };
      });
    } catch (err) {
      console.error("Error deleting trip:", err.response?.data || err.message);
    }
  };

  return (
    <Box style={{ padding: "2rem" }}>
      <Button onClick={() => setModalIsOpen(true)} mb="1rem">
        Create New Trip
      </Button>
      <h2>Trips</h2>
      {loading ? (
        <Loader size="xl" />
      ) : (
        <Group
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {trips.map((trip) => (
            <Card
              key={trip._id}
              shadow="sm"
              radius="md"
              style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
              onClick={() => openTrip(trip._id)}
            >
              <Card.Section>
                <Image
                  src={
                    trip.photoUrl
                      ? `${baseURL}${trip.photoUrl}`
                      : defaultTripImage
                  }
                  height={200}
                  style={{ objectFit: "cover" }}
                />
                <Overlay
                  gradient="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)"
                  opacity={1}
                  zIndex={1}
                  height="100%"
                />
                <Text
                  size="xl"
                  weight={700}
                  style={{
                    color: "white",
                    position: "absolute",
                    bottom: 15,
                    left: 15,
                    zIndex: 2,
                  }}
                >
                  {trip.tripName}
                </Text>
                <ActionIcon
                  color="red"
                  radius="md"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 20,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(trip._id);
                  }}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Card.Section>
            </Card>
          ))}
        </Group>
      )}

      <Modal
        opened={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title="Create New Trip"
        centered
      >
        <form onSubmit={createTrip}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="tripName"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Trip Name
            </label>
            <input
              type="text"
              name="tripName"
              value={formData.tripName}
              onChange={handleInputChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="destination"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="startDate"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="endDate"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="photo"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Upload Photo
            </label>
            <Button variant="default" component="label" fullWidth>
              Choose File
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Button>
            {formData.photo && (
              <Text size="sm" mt="sm">
                Selected file: {formData.photo.name}
              </Text>
            )}
          </div>
          <Button type="submit" style={{ marginRight: "1rem" }}>
            Create
          </Button>
        </form>
      </Modal>
    </Box>
  );
};

export default Trips;
