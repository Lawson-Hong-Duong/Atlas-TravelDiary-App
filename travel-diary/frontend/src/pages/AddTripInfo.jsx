import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { infoTypes } from "../data/infoTypes";
import api from "../api";
import {
  Container,
  Paper,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Checkbox,
  Title,
  Loader,
  Text,
  Stack,
} from "@mantine/core";

const AddTripInfo = () => {
  const { id, type, infoId } = useParams();
  const navigate = useNavigate();
  const editMode = Boolean(infoId);
  const [infoType, setInfoType] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        if (editMode) {
          const res = await api.get(`/trips/${id}/information/${infoId}`);
          const data = res.data;
          setFormData(data.data);
          setInfoType(infoTypes[data.type]);
        } else {
          const infoTypeFromParams = infoTypes[type];
          if (!infoTypeFromParams) {
            setLoading(false);
            return;
          }
          setInfoType(infoTypeFromParams);

          const initialState = {};
          infoTypeFromParams.fields.forEach((field) => {
            initialState[field.name] = field.type === "checkbox" ? false : "";
          });
          setFormData(initialState);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [editMode, id, infoId, type]);

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Loader size="lg" variant="dots" />
      </Container>
    );
  }

  if (!infoType) {
    return (
      <Container size="sm" py="xl">
        <Text>Invalid info type</Text>
      </Container>
    );
  }

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const saveInformation = async () => {
    try {
      const data = { ...formData, type: infoType.type || type };
      if (editMode) {
        await api.put(`/trips/${id}/information/${infoId}`, data);
      } else {
        await api.post(`/trips/${id}/information`, data);
      }
      navigate(`/trips/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="sm" p="xl">
        <Group position="apart" mb="xl">
          <Title order={2}>
            {editMode ? `Edit ${infoType.label}` : `Add ${infoType.label}`}
          </Title>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <Button onClick={saveInformation}>Save</Button>
        </div>
        </Group>
        <Stack spacing="md">
          {infoType.fields.map((field) => {
            let inputComponent = null;
            switch (field.type) {
              case "text":
                inputComponent = (
                  <TextInput
                    label={field.label}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                );
                break;
              case "number":
                inputComponent = (
                  <NumberInput
                    label={field.label}
                    value={formData[field.name] || ""}
                    onChange={(value) =>
                      handleInputChange(field.name, value)
                    }
                    required={field.required}
                  />
                );
                break;
              case "textarea":
                inputComponent = (
                  <Textarea
                    label={field.label}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                );
                break;
              case "select":
                inputComponent = (
                  <Select
                    label={field.label}
                    data={field.options || []}
                    value={formData[field.name] || ""}
                    onChange={(value) =>
                      handleInputChange(field.name, value)
                    }
                    required={field.required}
                  />
                );
                break;
              case "checkbox":
                inputComponent = (
                  <Checkbox
                    label={field.label}
                    checked={formData[field.name] || false}
                    onChange={(e) =>
                      handleInputChange(field.name, e.currentTarget.checked)
                    }
                  />
                );
                break;
              case "date":
                inputComponent = (
                  <TextInput
                    label={field.label}
                    type="date"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                );
                break;
              case "time":
                inputComponent = (
                  <TextInput
                    label={field.label}
                    type="time"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                );
                break;
              default:
                inputComponent = (
                  <TextInput
                    label={field.label}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                );
            }
            return <div key={field.name}>{inputComponent}</div>;
          })}
        </Stack>
      </Paper>
    </Container>
  );
};

export default AddTripInfo;
