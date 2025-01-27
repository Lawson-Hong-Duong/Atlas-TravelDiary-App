import React, { useState } from "react";
import api from "../api";
import {
  Container,
  TextInput,
  Select,
  Button,
  Loader,
  Text,
  Title,
  Card,
  Flex,
  Stack,
  Image,
  Anchor,
} from "@mantine/core";

const Events = () => {
  const [formData, setFormData] = useState({
    city: "",
    date: null,
    eventType: "",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const eventTypes = ["Music", "Sports", "Arts & Theatre", "Film"];

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const fetchEvents = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          params[key] = formData[key];
        }
      });

      const res = await api.get('/events', { params });
      setEvents(res.data);
    } catch (err) {
      console.error('Error getting events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="md">
        Find Events
      </Title>

      <form onSubmit={fetchEvents}>
        <Stack spacing="md">
          <TextInput
            label="City"
            placeholder="Enter city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
          <TextInput
            label="Date"
            type="date"
            placeholder="Select date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
          <Select
            label="Event Type"
            placeholder="All Types"
            value={formData.eventType}
            onChange={(value) => handleInputChange("eventType", value)}
            data={[
              { value: "", label: "All Types" },
              ...eventTypes.map((type) => ({ value: type, label: type })),
            ]}
          />
          <Button mb="xl" type="submit">
            Search
          </Button>
        </Stack>
      </form>

      {loading ? (
        <Loader size="lg" variant="dots" />
      ) : events.length > 0 ? (
        <Stack spacing="md">
          {events.map((event) => (
            <Card key={event.id} shadow="sm" withBorder>
              <Flex justify="space-between" align="flex-start">
                <div>
                  <Title order={4}>
                    <Anchor href={event.url} target="_blank">
                      {event.name}
                    </Anchor>
                  </Title>
                  <Text size="sm">
                    <strong>Date:</strong>{" "}
                    {event.start
                      ? new Date(event.start).toLocaleString()
                      : "Date unavailable"}
                  </Text>
                  <Text size="sm">
                    <strong>Location:</strong>{" "}
                    {event.venue || "Venue unavailable"}
                  </Text>
                  <Text size="sm">
                    <strong>City:</strong> {event.city || "City unavailable"}
                  </Text>
                  {event.priceRanges && event.priceRanges.length > 0 && (
                    <Text size="sm">
                      <strong>Price Range:</strong> ${event.priceRanges[0].min}{" "}
                      - ${event.priceRanges[0].max}{" "}
                      {event.priceRanges[0].currency}
                    </Text>
                  )}
                </div>

                {event.images && event.images[0] && (
                  <Image
                    src={event.images[0].url}
                    alt={event.name}
                    width={120}
                    height={120}
                    radius="sm"
                    fit="cover"
                  />
                )}
              </Flex>
            </Card>
          ))}
        </Stack>
      ) : (
        <Text>No events found</Text>
      )}
    </Container>
  );
};

export default Events;
