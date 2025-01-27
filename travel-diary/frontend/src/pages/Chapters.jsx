import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import DOMPurify from "dompurify";
import "../styles/Chapters.css";
import { IconEdit, IconTrash, IconShare, IconPlus } from "@tabler/icons-react";
import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  Box,
  Card,
  ScrollArea,
  ActionIcon,
  Divider,
} from "@mantine/core";

const baseURL = api.defaults.baseURL.replace("/api", "");

const Chapters = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [diary, setDiary] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [locationData, setLocationData] = useState({
    country: "",
    state: "",
    city: "",
    suburb: "",
  });
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    description: "",
    icon: "",
  });
  const [isOwner, setIsOwner] = useState(false);

  const locationLines = [
    locationData.suburb,
    locationData.city,
    locationData.state,
    locationData.country,
  ].filter((part) => part);

  const addChapter = async () => {
    try {
      const res = await api.post(`/diaries/${id}/chapters/new`);
      const newChapter = res.data;
      setChapters((prevChapters) => [...prevChapters, newChapter]);
      navigate(`/diaries/${id}/chapters/${newChapter._id}/edit`);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchDiaryAndChapters = async () => {
      try {
        const diaryRes = await api.get(`/diaries/${id}`);
        setDiary(diaryRes.data);
        setIsOwner(diaryRes.data.isOwner);

        const chaptersRes = await api.get(`/diaries/${id}/chapters`);
        const sortedChapters = chaptersRes.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setChapters(sortedChapters);
      } catch (err) {
        const status = err.response?.status;
        if (status === 403) {
          setError("You do not have permission to view this diary.");
        } else if (status === 404) {
          setError("Diary not found.");
        } else {
          setError("Error fetching diary.");
        }
      }
    };

    fetchDiaryAndChapters();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!diary) {
    return <p>Loading diary...</p>;
  }

  const handleEdit = (chapterId) => {
    navigate(`/diaries/${id}/chapters/${chapterId}/edit`);
  };

  const handleChapterClick = async (chapter) => {
    try {
      const res = await api.get(`/diaries/${id}/chapters/${chapter._id}`);
      console.log('Chapter data:', res.data);
      setSelectedChapter(res.data);
      if (res.data.latitude && res.data.longitude) {
        const locationRes = await api.get("/geocode", {
          params: {
            lat: res.data.latitude,
            lng: res.data.longitude,
          },
        });
        setLocationData(locationRes.data);
      } else {
        setLocationData({ country: "", state: "", city: "", suburb: "" });
      }

      if (res.data.weather) {
        setWeatherData(res.data.weather);
      } else {
        setWeatherData({ temperature: null, description: "", icon: "" });
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async (chapterId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chapter?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await api.delete(`/diaries/${id}/chapters/${chapterId}`);
      setChapters((prevChapters) =>
        prevChapters.filter((ch) => ch._id !== chapterId)
      );
      if (selectedChapter && selectedChapter._id === chapterId) {
        setSelectedChapter(null);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleVisibilityChange = async (newVisibility) => {
    try {
      const res = await api.put(`/diaries/${id}/visibility`, {
        visibility: newVisibility,
      });
      setDiary((prevDiary) => ({
        ...prevDiary,
        visibility: res.data.visibility,
      }));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/diaries/${id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Diary link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Container size="1400" px={0}>
      <Group position="apart" mb="md" mt="md">
        <Title order={2}>{diary.diaryName}</Title>
        {isOwner && (
          <Group position="right" style={{ marginLeft: "auto" }}>
            {diary.visibility === "public" && (
              <Button variant="outline" onClick={handleShareLink}>
                <Group spacing="xs">
                  <IconShare size={16} />
                  Share Link
                </Group>
              </Button>
            )}
            <Select
              value={diary.visibility}
              onChange={handleVisibilityChange}
              data={[
                { value: "private", label: "Private" },
                { value: "public", label: "Public" },
              ]}
            />
          </Group>
        )}
      </Group>
      <Divider my="md" />

      <Grid gutter={0}>
        <Grid.Col span={3.3}>
          <Stack spacing="md" px="md">
            <Group position="apart">
              <Title order={3}>Chapters</Title>
              {isOwner && (
                <ActionIcon onClick={addChapter}>
                  <IconPlus size={20} />
                </ActionIcon>
              )}
            </Group>

            <ScrollArea style={{ height: "calc(100vh - 200px)" }}>
              <Stack spacing="xs">
                {chapters && chapters.length > 0 ? (
                  chapters.map((chapter) => (
                    <Card
                      key={chapter._id}
                      withBorder
                      shadow="sm"
                      onClick={() => handleChapterClick(chapter)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Group position="apart">
                        <Text
                          weight={500}
                          style={{ flex: 1, overflow: "hidden" }}
                        >
                          {chapter.title}
                        </Text>
                        <Text size="sm">
                          {new Date(chapter.date).toLocaleDateString()}
                        </Text>
                        {isOwner && (
                          <Group spacing="xs">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(chapter._id);
                              }}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(chapter._id);
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        )}
                      </Group>
                    </Card>
                  ))
                ) : (
                  <Text>No chapters available</Text>
                )}
              </Stack>
            </ScrollArea>
          </Stack>
        </Grid.Col>

        <Grid.Col span={8.5} pb="20">
          <Paper
            shadow="sm"
            p="md"
            style={{
              minHeight: "calc(100vh - 200px)",
              backgroundColor: selectedChapter?.backgroundColor || "#fff",
              position: "relative",
              border: "1px solid #ddd",
            }}
          >
            <Group
              style={{ position: "absolute", top: 30, right: 30 }}
              align="flex-start"
            >
              <Box
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  width: "150px",
                  height: "120px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #ddd",
                }}
              >
                <Text size="sm" weight={500} mb="xs">
                  Location
                </Text>
                {locationLines.length > 0 ? (
                  locationLines.map((line, index) => (
                    <Text size="xs" key={index}>
                      {line}
                    </Text>
                  ))
                ) : (
                  <Text size="xs">No location data</Text>
                )}
              </Box>

              <Box
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  width: "150px",
                  height: "120px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "1px solid #ddd",
                }}
              >
                <Text size="sm" weight={500} mb="xs">
                  Weather
                </Text>
                {weatherData.temperature !== null ? (
                  <>
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                      style={{ height: 30, width: 30 }}
                    />
                    <Text size="sm">{weatherData.temperature}°C</Text>
                    <Text size="xs">{weatherData.description}</Text>
                  </>
                ) : (
                  <Text size="xs">No weather data</Text>
                )}
              </Box>
            </Group>

            {selectedChapter ? (
              <Box pt={30}>
                <Title order={1}>{selectedChapter.title}</Title>
                <Text mb="md" pt={20} pb={30}>
                  {new Date(selectedChapter.date).toLocaleDateString()}
                </Text>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedChapter.content, {
                      ADD_ATTR: ["class", "style"],
                    }),
                  }}
                />
                {selectedChapter.photos &&
                  selectedChapter.photos.length > 0 && (
                    <Grid gutter="md" mt="md">
                      {selectedChapter.photos.map((photoUrl, index) => (
                        <Grid.Col key={index} span={6}>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`${baseURL}${photoUrl}`}
                              alt={`Chapter Photo ${index + 1}`}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "300px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                              }}
                            />
                          </Box>
                        </Grid.Col>
                      ))}
                    </Grid>
                  )}
              </Box>
            ) : (
              <Text>Select a chapter</Text>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Chapters;
