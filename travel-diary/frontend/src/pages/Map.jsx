import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../api";
import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Link } from "react-router-dom";

const Map = () => {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    api
      .get("/diaries/chapters-with-location")
      .then((res) => setChapters(res.data))
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);

  return (
    <div className="map-page" style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; ..."
          url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
        />
        {chapters.map((chapter) => (
          <Marker
            key={chapter._id}
            position={[chapter.latitude, chapter.longitude]}
            icon={
              new L.Icon({
                iconUrl,
                iconRetinaUrl,
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })
            }
          >
            <Popup>
              <h3>{chapter.title}</h3>
              <p>{new Date(chapter.date).toLocaleDateString()}</p>
              <Link to={`/diaries/${chapter.diaryId}`}>View Chapter</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
