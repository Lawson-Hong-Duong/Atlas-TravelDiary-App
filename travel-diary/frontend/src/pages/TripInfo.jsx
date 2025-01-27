import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { infoTypes } from "../data/infoTypes";
import {
  Container,
  Group,
  Stack,
  Button,
  Text,
  Title,
  Card,
  Modal,
  Divider,
  ActionIcon,
  Flex,
  Box,
  Progress,
  NumberInput,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconMapPin,
  IconCalendar,
  IconRun,
  IconHome,
  IconPlaneDeparture,
  IconTrain,
  IconShip,
  IconMicrophone,
  IconSoup,
  IconNote,
} from "@tabler/icons-react";

const TripInfo = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const infoTypeIcons = {
    activity: IconRun,
    accommodation: IconHome,
    flight: IconPlaneDeparture,
    train: IconTrain,
    ferry: IconShip,
    event: IconMicrophone,
    restaurant: IconSoup,
    note: IconNote,
  };

  const [budget, setBudget] = useState(1000);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/trips/${id}`);
        setTrip(res.data);
        setBudget(res.data.budget !== undefined ? res.data.budget : 1000);
      } catch (err) {
        setError("Failed to fetch trip data");
      }
    };
    fetchTrip();
  }, [id]);

  const openBudgetModal = () => setBudgetModalOpen(true);
  const closeBudgetModal = () => setBudgetModalOpen(false);

  const updateBudget = async (newBudget) => {
    if (newBudget === null || isNaN(newBudget)) {
      newBudget = 0;
    }
    try {
      await api.put(`/trips/${id}/budget`, { budget: newBudget });
      setBudget(newBudget);
    } catch (err) {
      console.error("Failed to update budget");
    }
  };

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!trip) {
    return <Text>Loading...</Text>;
  }

  // Calculate total cost
  const totalCost = trip.information.reduce((sum, infoItem) => {
    const cost = parseFloat(infoItem.data.cost);
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);

  const addInformation = () => {
    setInfoModalIsOpen(true);
  };

  const closeModal = () => {
    setInfoModalIsOpen(false);
  };

  const handleSelection = (type) => {
    setInfoModalIsOpen(false);
    navigate(`/trips/${id}/add/${type}`);
  };

  // Organise info by date
  const infoByDate = {};
  trip.information.forEach((info) => {
    const dateKey =
      info.data.date || info.data.departureDate || info.data.checkInDate;
    if (!dateKey) return;

    if (!infoByDate[dateKey]) {
      infoByDate[dateKey] = [];
    }
    infoByDate[dateKey].push(info);
  });

  // Sort dates
  const sortedDates = Object.keys(infoByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  Object.values(infoByDate).forEach((infoList) => {
    infoList.sort((a, b) => {
      const timeA = a.data.time || a.data.departureTime || "00:00";
      const timeB = b.data.time || b.data.departureTime || "00:00";
      return timeA.localeCompare(timeB);
    });
  });

  const deleteInformation = async (infoId) => {
    try {
      const res = await api.delete(`/trips/${trip._id}/information/${infoId}`);
      setTrip(res.data);
    } catch (err) {
      console.error("Failed to delete info");
    }
  };

  return (
    <Container size="1100" py="md">
      <Group position="apart" align="center" mb="md">
        <div>
          <Title order={2}>{trip.tripName}</Title>
          <Group spacing="xs">
            <IconMapPin size={20} />
            <Text>{trip.destination}</Text>
          </Group>
          <Group spacing="xs">
            <IconCalendar size={20} />
            <Text>
              {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
              {new Date(trip.endDate).toLocaleDateString("en-GB")}
            </Text>
          </Group>
        </div>

        <Card
          withBorder
          radius="md"
          padding="md"
          style={{ cursor: "pointer", marginLeft: "auto", textAlign: "right" }}
          onClick={openBudgetModal}
        >
          <Text size="xs" transform="uppercase" weight={700} color="dimmed">
            Budget
          </Text>
          <Text size="lg" weight={500}>
            ${totalCost.toFixed(2)} / ${Number(budget || 0).toFixed(2)}
          </Text>
          <Progress
            value={(totalCost / budget) * 100}
            mt="md"
            size="lg"
            radius="xl"
            color={(totalCost / budget) * 100 > 100 ? "red" : "blue"}
          />
        </Card>
      </Group>

      <Group mb="md" spacing="sm">
        <Button onClick={addInformation}>Add Information</Button>
        <Button variant="outline" onClick={() => navigate("/events")}>
          Explore Things to Do
        </Button>
      </Group>

      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: "2rem" }}>
          <Divider
            label={
              <Text size="lg">
                {new Date(date).toLocaleDateString("en-GB")}
              </Text>
            }
            labelPosition="center"
            mb="sm"
          />

          {infoByDate[date].map((infoItem, index) => {
            const infoDefinition = infoTypes[infoItem.type];
            const fields = infoDefinition ? infoDefinition.fields : [];
            const IconComponent = infoTypeIcons[infoItem.type];

            return (
              <Card
                key={index}
                shadow="sm"
                withBorder
                mb="sm"
                style={{ position: "relative" }}
              >
                <Group
                  spacing="xs"
                  style={{ position: "absolute", top: 10, right: 10 }}
                >
                  <ActionIcon
                    size="md"
                    variant="light"
                    onClick={() =>
                      navigate(`/trips/${id}/edit/${infoItem._id}`)
                    }
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="md"
                    variant="light"
                    color="red"
                    onClick={() => deleteInformation(infoItem._id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                <div style={{ flex: 1, paddingRight: "100px" }}>
                  <Group spacing="xs">
                    {IconComponent && <IconComponent size={20} />}
                    <Text style={{ fontWeight: "800" }}>
                      {infoDefinition
                        ? infoDefinition.label
                        : infoItem.type.charAt(0).toUpperCase() +
                          infoItem.type.slice(1)}
                    </Text>
                  </Group>
                  <Flex mt="xs" gap="xl" wrap="nowrap" justify="space-between">
                    {fields.map((field) => {
                      const value = infoItem.data[field.name];
                      if (value && field.type === "date") {
                        return (
                          <Box key={field.name} sx={{ flex: 1 }}>
                            <Text size="sm" style={{ fontWeight: "500" }}>
                              {field.label}
                            </Text>
                            <Text size="sm">
                              {new Date(value).toLocaleDateString("en-GB")}
                            </Text>
                          </Box>
                        );
                      }
                      if (value && field.name !== "cost") {
                        return (
                          <Box key={field.name} sx={{ flex: 1 }}>
                            <Text size="sm" style={{ fontWeight: "500" }}>
                              {field.label}
                            </Text>
                            {field.name === "website" ? (
                              <Text size="sm">
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Link
                                </a>
                              </Text>
                            ) : (
                              <Text size="sm">{value}</Text>
                            )}
                          </Box>
                        );
                      }
                      return null;
                    })}

                    {infoItem.data.cost !== undefined && (
                      <Box sx={{ flex: 1 }}>
                        <Text size="sm" style={{ fontWeight: "500" }}>
                          Cost
                        </Text>
                        <Text size="sm">
                          ${parseFloat(infoItem.data.cost).toFixed(2)}
                        </Text>
                      </Box>
                    )}
                  </Flex>
                </div>
              </Card>
            );
          })}
        </div>
      ))}

      <Modal
        opened={infoModalIsOpen}
        onClose={closeModal}
        title="Select Type"
        centered
      >
        <Stack spacing="sm">
          {[
            "activity",
            "accommodation",
            "flight",
            "train",
            "ferry",
            "event",
            "restaurant",
            "note",
          ].map((type) => (
            <Button
              key={type}
              variant="light"
              fullWidth
              onClick={() => handleSelection(type)}
              leftIcon={
                infoTypeIcons[type]
                  ? React.createElement(infoTypeIcons[type], { size: 20 })
                  : null
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </Stack>
      </Modal>

      <Modal
        opened={budgetModalOpen}
        onClose={closeBudgetModal}
        title="Edit Budget"
        centered
      >
        <NumberInput
          label="Budget"
          value={budget}
          onChange={(value) => setBudget(value !== null ? value : 0)}
          min={0}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
        />
        <Button
          mt="md"
          onClick={() => {
            updateBudget(budget);
            closeBudgetModal();
          }}
        >
          Save
        </Button>
      </Modal>
    </Container>
  );
};

export default TripInfo;
