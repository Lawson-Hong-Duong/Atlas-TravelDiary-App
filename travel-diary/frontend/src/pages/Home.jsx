import {
  Container,
  SimpleGrid,
  Card,
  Text,
  Title,
  useMantineTheme,
  rem,
  Group,
} from "@mantine/core";
import {
  IconNotebook,
  IconMap,
  IconCalendar,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import homeHeroImage from "../assets/images/home-hero.jpg";

export default function Home() {
  const theme = useMantineTheme();
  const featuresData = [
    {
      title: "Create Diary Entries",
      description:
        "Document your journey with ease. Add geolocation and real-time weather information to each entry, and style it with your own photos and design.",
      icon: IconNotebook,
    },
    {
      title: "Plan Your Entire Trip",
      description:
        "Organise your trip with activities, flights, accommodation, and more. Track everything by date in a simple interface. Plus, set a budget and see a total of your trip expenses.",
      icon: IconCalendar,
    },
    {
      title: "Map View Interface",
      description:
        "See your adventures unfold on a map. All your diary entries are geotagged and can be easily viewed by pins, allowing you to revisit your journey visually.",
      icon: IconMap,
    },
    {
      title: "Event Finder",
      description:
        "Search for events in any city you're visiting. Filter by category—whether it’s music, sports, film, and discover exciting activities to enhance your trip.",
      icon: IconSearch,
    },
    {
      title: "Weather Forecasts",
      description:
        "Stay ahead of the weather with forecasts. Check current conditions or plan ahead with a 5-day forecast to make the most of your travel experience.",
      icon: IconSun,
    },
  ];

  return (
    <Container
      fluid
      style={{
        backgroundImage: `url(${homeHeroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        minHeight: "100vh",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container size="lg" py="xl">
        <Title
          order={1}
          align="center"
          size="h1"
          style={{
            fontSize: "3rem",
            lineHeight: "1.2",
          }}
        >
          Discover the world with{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "purple", to: "orange" }}
            weight={800}
            style={{
              display: "inline-block",
              fontSize: "3.5rem",
              lineHeight: "inherit",
              fontWeight: "bold",
            }}
          >
            ATLAS JOURNEYS
          </Text>
        </Title>

        <Text
          align="center"
          mt="lg"
          size="xl"
          style={{
            maxWidth: rem(600),
            margin: "0 auto",
            color: theme.colors.gray[7],
            fontSize: "1.5rem",
          }}
        >
          Welcome to your personalised travel companion. Our app helps you
          seamlessly capture memories, plan trips, and explore new destinations.
        </Text>

        <SimpleGrid
          cols={3}
          spacing="xl"
          mt={50}
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}
        >
          {featuresData.slice(0, 3).map((feature) => (
            <Card key={feature.title} shadow="md" radius="md" padding="lg">
              <Group align="flex-start" spacing="md">
                <feature.icon
                  style={{ width: rem(40), height: rem(40) }}
                  color={theme.colors.blue[6]}
                />
                <Text
                  size="lg"
                  weight={500}
                  mt="md"
                  style={{
                    marginBottom: rem(10),
                    fontSize: rem(20), // Increase font size
                  }}
                >
                  {feature.title}
                </Text>
              </Group>
              <Text size="md" c="dimmed" mt="sm">
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <SimpleGrid
          cols={2}
          spacing="xl"
          mt={30}
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}
          style={{ maxWidth: rem(680), margin: "0 auto" }}
        >
          {featuresData.slice(3).map((feature) => (
            <Card key={feature.title} shadow="md" radius="md" padding="lg">
              <Group align="flex-start" spacing="md">
                <feature.icon
                  style={{ width: rem(40), height: rem(40) }}
                  color={theme.colors.blue[6]}
                />
                <Text
                  size="lg"
                  weight={500}
                  mt="md"
                  style={{
                    marginBottom: rem(10),
                    fontSize: rem(20), // Increase font size
                  }}
                >
                  {feature.title}
                </Text>
              </Group>
              <Text size="md" c="dimmed" mt="sm">
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Container>
  );
}
