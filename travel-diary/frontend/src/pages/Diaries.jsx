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
import defaultDiaryImage from "../assets/images/default-diary.jpg";

const baseURL = api.defaults.baseURL.replace("/api", "");

const Diaries = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    diaryName: "",
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const res = await api.get("/diaries");
        setDiaries(res.data);
        setAuthState((prevState) => ({
          ...prevState,
          diaries: res.data,
        }));
      } catch (err) {
        console.error(err.response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [setAuthState]);

  const createDiary = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("diaryName", formData.diaryName);
      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      const res = await api.post("/diaries", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newDiary = res.data;
      setDiaries((prevDiaries) => [...prevDiaries, newDiary]);
      setAuthState((prevState) => ({
        ...prevState,
        diaries: [...prevState.diaries, newDiary],
      }));
      setModalIsOpen(false);
      setFormData({
        diaryName: "",
        photo: null,
      });
      navigate(`/diaries/${newDiary._id}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const openDiary = (id) => {
    navigate(`/diaries/${id}`);
  };

  const handleDelete = async (diaryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await api.delete(`/diaries/${diaryId}`);
      setDiaries((prevDiaries) =>
        prevDiaries.filter((diary) => diary._id !== diaryId)
      );
      setAuthState((prevState) => ({
        ...prevState,
        diaries: prevState.diaries.filter((diary) => diary._id !== diaryId),
      }));
    } catch (err) {
      console.error("Error deleting diary:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Error deleting diary");
    }
  };

  return (
    <Box style={{ padding: "2rem" }}>
      <Button onClick={() => setModalIsOpen(true)} mb="1rem">
        Create New Diary
      </Button>
      <h2>Diaries</h2>
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
          {diaries.map((diary) => (
            <Card
              key={diary._id}
              shadow="sm"
              radius="md"
              style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
              onClick={() => openDiary(diary._id)}
            >
              <Card.Section>
                <Image
                  src={
                    diary.photoUrl
                      ? `${baseURL}${diary.photoUrl}`
                      : defaultDiaryImage
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
                  {diary.diaryName}
                </Text>
                <ActionIcon
                  color="red"
                  radius="md"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(diary._id);
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
        title="Create New Diary"
        centered
      >
        <form onSubmit={createDiary}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="diaryName"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Diary Name
            </label>
            <input
              type="text"
              name="diaryName"
              value={formData.diaryName}
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

export default Diaries;
