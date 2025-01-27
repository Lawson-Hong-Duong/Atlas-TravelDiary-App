import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Avatar,
  Text,
  Group,
  Button,
  Badge,
  Image,
  Progress,
  Container,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api";
import noDiaryGif from "../assets/images/rupert.gif";
import noTripGif from "../assets/images/sadpablo.gif";
import defaultDiaryImage from "../assets/images/default-diary.jpg";
import defaultTripImage from "../assets/images/default-trip.jpg";

const baseURL = api.defaults.baseURL.replace("/api", "");

const rankNames = [
  "Rookie",
  "Traveler",
  "Wanderer",
  "Voyager",
  "Adventurer",
  "Explorer",
  "Globetrotter",
];

export function Dashboard() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [closestTrip, setClosestTrip] = useState(null);
  const [mostRecentDiary, setMostRecentDiary] = useState(null);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState("Rookie");

  const calculateXpAndRank = (trips, diaries) => {
    const newXp = trips.length * 10 + diaries.length * 10;
    setXp(newXp);

    if (newXp >= 1000) {
      setRank("Globetrotter");
    } else if (newXp >= 800) {
      setRank("Explorer");
    } else if (newXp >= 600) {
      setRank("Adventurer");
    } else if (newXp >= 400) {
      setRank("Voyager");
    } else if (newXp >= 200) {
      setRank("Wanderer");
    } else if (newXp >= 100) {
      setRank("Traveler");
    } else {
      setRank("Rookie");
    }
  };

  const stats = [
    { value: authState.diaries.length || "0", label: "Diaries" },
    { value: authState.trips.length || "0", label: "Trips" },
  ];

  const items = stats.map((stat) => (
    <Box key={stat.label}>
      <Text>{stat.value}</Text>
      <Text c="dimmed">{stat.label}</Text>
    </Box>
  ));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripsRes = await api.get("/trips");
        const trips = tripsRes.data;
        const diariesRes = await api.get("/diaries");
        const diaries = diariesRes.data;

        setAuthState((prevState) => ({
          ...prevState,
          trips,
          diaries,
        }));

        calculateXpAndRank(trips, diaries);

        if (diaries.length > 0) {
          diaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMostRecentDiary(diaries[0]);
        } else {
          setMostRecentDiary(null);
        }

        const upcomingTrips = trips.filter(
          (trip) => new Date(trip.startDate) > new Date()
        );
        upcomingTrips.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setClosestTrip(upcomingTrips[0]);

        const tripsPerMonth = trips.reduce((acc, trip) => {
          const month = new Date(trip.startDate).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const diariesPerMonth = diaries.reduce((acc, diary) => {
          const month = new Date(diary.createdAt).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const allMonths = Array.from(
          new Set([
            ...Object.keys(tripsPerMonth),
            ...Object.keys(diariesPerMonth),
          ])
        );

        allMonths.sort((a, b) => new Date(a) - new Date(b));

        const chartData = allMonths.map((month) => ({
          month,
          trips: tripsPerMonth[month] || 0,
          diaries: diariesPerMonth[month] || 0,
        }));

        setChartData(chartData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch trips or diaries");
        setLoading(false);
      }
    };
    fetchData();
  }, [setAuthState]);

  const currentRankIndex = rankNames.indexOf(rank);
  const level = currentRankIndex + 1;

  return (
    <Container>
      <Card withBorder radius="md" p="xl" mt="xl" align="center">
        <Card.Section />
        <Avatar
          src={authState.avatar ? `${baseURL}${authState.avatar}` : undefined}
          size={100}
          mx="auto"
        />
        <Text mt="sm">{authState.username || "Username"}</Text>
        <Text c="dimmed">
          Level {level} {rank}
        </Text>
        <Group
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          p="xl"
        >
          {items}
        </Group>
        <Progress
          color="indigo"
          radius="xl"
          size="xl"
          value={xp % 100}
          striped
          animate
        />
        <Text c="dimmed" mt="sm">
          XP: {xp % 100} / 100
        </Text>
      </Card>

      <SimpleGrid pt="xl" cols={2}>
        {closestTrip ? (
          <Card align="center" withBorder key={closestTrip._id}>
            <Text style={{ fontWeight: "bold" }}>Next Trip</Text>
            <Card.Section>
              <Image
                src={
                  closestTrip.photoUrl
                    ? `${baseURL}${closestTrip.photoUrl}`
                    : defaultTripImage
                }
                height={200}
                p="md"
                radius="xl"
              />
            </Card.Section>
            <Group
              m="md"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Text>{closestTrip.tripName}</Text>
              <Badge color="pink" variant="light">
                {Math.ceil(
                  (new Date(closestTrip.startDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days left
              </Badge>
            </Group>
            <Text c="dimmed">
              {new Date(closestTrip.startDate).toLocaleDateString()} -{" "}
              {new Date(closestTrip.endDate).toLocaleDateString()}
            </Text>
            <Button
              color="blue"
              fullWidth
              mt="md"
              component={Link}
              to={`/trips/${closestTrip._id}`}
            >
              View Trip
            </Button>
          </Card>
        ) : (
          <Card withBorder>
            <Text align="center" style={{ fontWeight: "bold" }}>
              No Upcoming Trips
            </Text>
            <Card.Section>
              <Image src={noTripGif} height={200} p="md" radius="xl" />
            </Card.Section>
            <Button component={Link} to="/trips" color="blue" fullWidth mt="md">
              Add New Trip
            </Button>
          </Card>
        )}

        {mostRecentDiary ? (
          <Card align="center" withBorder key={mostRecentDiary._id}>
            <Text style={{ fontWeight: "bold" }}>Latest Diary</Text>
            <Card.Section>
              <Image
                src={
                  mostRecentDiary.photoUrl
                    ? `${baseURL}${mostRecentDiary.photoUrl}`
                    : defaultDiaryImage
                }
                height={200}
                p="md"
                radius="xl"
                alt={mostRecentDiary.diaryName}
              />
            </Card.Section>
            <Group
              m="md"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Text>{mostRecentDiary.diaryName}</Text>
              <Badge color="blue" variant="light">
                {new Date(mostRecentDiary.createdAt).toLocaleDateString()}
              </Badge>
            </Group>
            <Text c="dimmed">Chapters: {mostRecentDiary.chapters.length}</Text>
            <Button
              color="blue"
              fullWidth
              mt="md"
              component={Link}
              to={`/diaries/${mostRecentDiary._id}`}
            >
              View Diary
            </Button>
          </Card>
        ) : (
          <Card align="center" withBorder>
            <Text align="center" style={{ fontWeight: "bold" }}>
              No Recent Diaries
            </Text>
            <Card.Section>
              <Image
                src={noDiaryGif}
                height={200}
                p="md"
                radius="xl"
                alt="No Recent Entries"
              />
            </Card.Section>
            <Button
              component={Link}
              to="/diaries"
              color="blue"
              fullWidth
              mt="md"
            >
              Add New Diary
            </Button>
          </Card>
        )}
      </SimpleGrid>

      <Card withBorder mt="xl" mb="xl">
        <Text align="center" m="sm">
          Trips and Diaries Over Time
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, (dataMax) => Math.max(5, Math.ceil(dataMax))]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="trips" stroke="#8884d8" />
            <Line type="monotone" dataKey="diaries" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Container>
  );
}

export default Dashboard;
