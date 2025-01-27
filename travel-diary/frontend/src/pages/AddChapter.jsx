import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";
import {
  Container,
  Group,
  Button,
  TextInput,
  ColorInput,
  FileInput,
  Stack,
  Paper,
  Title,
  Loader,
  Text,
} from "@mantine/core";

const AddChapter = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();

  const [chapterData, setChapterData] = useState({
    title: "",
    date: "",
    content: "",
    photos: [],
    backgroundColor: "#ffffff",
    latitude: null,
    longitude: null,
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const fetchChapterAndLocation = async () => {
      await fetchChapter();
      fetchLocation();
    };
  
    const fetchChapter = async () => {
      try {
        const res = await api.get(`/diaries/${id}/chapters/${chapterId}`);
        setChapterData((prevData) => ({
          ...prevData,
          ...res.data,
          date: res.data.date ? res.data.date.split("T")[0] : prevData.date,
          backgroundColor: res.data.backgroundColor || prevData.backgroundColor || "#ffffff",
        }));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Error fetching chapter");
        setLoading(false);
      }
    };
  
    const fetchLocation = () => {
      console.log('Checking for geolocation support...');
      if (navigator.geolocation) {
        console.log('Geolocation is supported.');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Position obtained:', position.coords);
            setChapterData((prevData) => ({
              ...prevData,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }));
            setLocationLoading(false);
          },
          (error) => {
            console.error('Error fetching location:', error);
            setLocationLoading(false);
          }
        );
      } else {
        console.error('Geolocation not supported by browser.');
        setLocationLoading(false);
      }
    };
  
    fetchChapterAndLocation();
  }, [id, chapterId]);  

  const handleInputChange = (fieldName, value) => {
    setChapterData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Chapter data before save:', chapterData);
  
      const data = new FormData();
      data.append('title', chapterData.title);
      data.append('date', chapterData.date);
      data.append('content', chapterData.content);
      data.append('backgroundColor', chapterData.backgroundColor);
      data.append(
        'latitude',
        chapterData.latitude != null ? chapterData.latitude.toString() : ''
      );
      data.append(
        'longitude',
        chapterData.longitude != null ? chapterData.longitude.toString() : ''
      );
  
      for (let i = 0; i < selectedPhotos.length; i++) {
        data.append('photos', selectedPhotos[i]);
      }
  
      console.log('Sending data:', Array.from(data.entries()));
  
      await api.put(`/diaries/${id}/chapters/${chapterId}`, data);
  
      navigate(`/diaries/${id}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };  

  if (loading || locationLoading) {
    return (
      <Container size="md" py="xl">
        <Loader size="lg" variant="dots" />
        {locationLoading && <Text>Fetching location...</Text>}
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Text>{error}</Text>
      </Container>
    );
  }

  const toolbarOptions = [
    [{ font: ["serif", "sans-serif", "monospace"] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ];

  return (
    <Container size="md" py="xl">
      <Paper shadow="sm" p="xl">
        <Group position="apart" mb="xl">
          <Title order={2}>Edit Chapter</Title>
          <Button onClick={handleSave}>Save</Button>
        </Group>

        <Stack spacing="md">
          <TextInput
            label="Chapter Title"
            placeholder="Enter chapter title"
            value={chapterData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />

          <TextInput
            label="Date"
            type="date"
            value={chapterData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />

          <div>
            <Text style={{ fontWeight: "500" }}>Text</Text>
            <ReactQuill
              value={chapterData.content}
              onChange={(value) => handleInputChange("content", value)}
              modules={{
                toolbar: toolbarOptions,
              }}
            />
          </div>

          <ColorInput
            label="Background Color"
            value={chapterData.backgroundColor}
            onChange={(value) => handleInputChange("backgroundColor", value)}
          />

          <FileInput
            label="Upload Photos"
            placeholder="Select photos"
            multiple
            onChange={setSelectedPhotos}
          />
        </Stack>
      </Paper>
    </Container>
  );
};

export default AddChapter;
