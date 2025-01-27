import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Container,
  Card,
  Image,
  Text,
  Title,
  Loader,
  Box,
  Group,
  Stack,
  Flex,
} from "@mantine/core";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await api.get("/weather", {
          params: { lat, lon },
        });
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Error fetching weather data");
        setLoading(false);
      }
    };
  
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            setError("Error getting location");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser");
        setLoading(false);
      }
    };

    requestLocation();
  }, []);

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="xl" />
      </Container>
    );
  }

  // Function to get dynamic background based on the weather
  const getBackgroundStyle = (description) => {
    if (!description) {
      return { background: "linear-gradient(to bottom, #e0e0e0, #9e9e9e)" };
    }
    const lowerDescription = description.toLowerCase();
    if (lowerDescription.includes("rain")) {
      return { background: "linear-gradient(to bottom, #4a90e2, #145a8d)" };
    } else if (lowerDescription.includes("clear")) {
      return { background: "linear-gradient(to bottom, #fbc02d, #f57f17)" };
    } else if (lowerDescription.includes("cloud")) {
      return { background: "linear-gradient(to bottom, #8e9eab, #eef2f3)" };
    } else if (lowerDescription.includes("snow")) {
      return { background: "linear-gradient(to bottom, #b3e5fc, #81d4fa)" };
    } else {
      return { background: "linear-gradient(to bottom, #e0e0e0, #9e9e9e)" };
    }
  };
  
  // Function to get icon color based on the weather description
  const getIconColor = (description) => {
    const lowerDescription = description.toLowerCase();
    if (lowerDescription.includes("rain")) {
      return "#4a90e2";
    } else if (lowerDescription.includes("clear")) {
      return "#f57f17";
    } else if (lowerDescription.includes("cloud")) {
      return "#8e9eab";
    } else if (lowerDescription.includes("snow")) {
      return "#b3e5fc";
    } else {
      return "#9e9e9e";
    }
  };

  const backgroundStyle = weatherData && weatherData.current && weatherData.current.description
  ? getBackgroundStyle(weatherData.current.description)
  : { background: "linear-gradient(to bottom, #e0e0e0, #9e9e9e)" };

  // Function to suggest activities based on the weather
  const getActivitySuggestions = (weather) => {
    if (weather.includes("rain")) {
      return "Embrace the rain! It’s a great time to enjoy indoor activities like exploring art galleries or cozy up in a nearby coffee shop!";
    } else if (weather.includes("clear")) {
      return "The sun’s shining bright! why not explore the great outdoors? Head to a nearby hiking trail, beach, or park to make the most of the clear skies.";
    } else if (weather.includes("cloud")) {
      return "With cooler, cloudy skies, now's the time for a walking tour through historic neighborhoods or a visit to a famous landmark!";
    } else if (weather.includes("snow")) {
      return "How about some skiing or a visit to a nearby winter market?";
    } else {
      return "Explore the area at your own pace!";
    }
  };

  // Function to suggest packing tips based on the weather
  const getPackingTips = (weather) => {
    if (weather.includes("rain")) {
      return "Don't forget your rain essentials! pack an umbrella, waterproof shoes, and a light raincoat to stay dry while exploring.";
    } else if (weather.includes("clear")) {
      return "Sunscreen, sunglasses, and a hat are must-haves to protect you from those UV rays while you enjoy the beautiful day!";
    } else if (weather.includes("cloud")) {
      return "Pack A light jacket or sweater will keep you comfortable in case the temperature fluctuates.";
    } else if (weather.includes("snow")) {
      return "Stay warm with winter boots and a heavy coat.";
    } else {
      return "Pack for a variety of weather conditions!";
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "91.9vh",
        minWidth: "100vw",
        justifyContent: "center",
        ...backgroundStyle,
      }}
    >
      <Card shadow="md" padding="lg" style={{ textAlign: "center" }}>
        <Title order={3} style={{ color: getIconColor(weatherData.current.description) }}>Current Weather</Title>
        <Group justify="center" pb={"lg"}>
          <Image
            src={`http://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`}
            alt={weatherData.current.description}
            style={{
              filter: `drop-shadow(2px 4px 6px ${getIconColor(weatherData.current.description)})`,
            }}
          />
          <div>
            <Title order={3}>
              {Math.round(weatherData.current.temperature)}°C
            </Title>
            <Text>{weatherData.current.description}</Text>
          </div>
        </Group>

        <Title order={3} mb="sm">5-Day Forecast</Title>
        <Flex wrap="wrap" justify="center" gap="md" pb={"lg"}>
          {weatherData.forecast.map((day) => (
            <Card key={day.date} shadow="md">
              <Text>
                {new Date(day.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </Text>
              <Image
                src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt="forecast-icon"
                style={{
                  maxHeight: "5rem",
                  filter: `drop-shadow(2px 4px 6px ${getIconColor(day.description)})`,
                }}
              />
              <Text>{Math.round(day.temperature)}°C</Text>
              <Text>{day.description}</Text>
            </Card>
          ))}
        </Flex>

        <Stack mt="xl" px="md" pb={"lg"}>
          <Box>
            <Title order={4} mb="sm">Activity Suggestions</Title>
            <Text>
              {getActivitySuggestions(
                weatherData.current.description.toLowerCase()
              )}
            </Text>
          </Box>

          <Box>
            <Title order={4} mb="sm">Packing Tips</Title>
            <Text>
              {getPackingTips(weatherData.current.description.toLowerCase())}
            </Text>
          </Box>
        </Stack>
      </Card>
    </Container>
  );
};

export default Weather;
