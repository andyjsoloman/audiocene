import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useGeoLocation } from "../hooks/useGeolocation";

import useUrlPositon from "../hooks/useUrlPosition";
import { useRecordings } from "../features/recordings/useRecordings";
import useDebounce from "../hooks/useDebounce";
import { useCurrentBounds } from "../contexts/RecordingsByBoundsContext";
import { QUERIES } from "../constants";
import GeoLocateButton from "./GeoLocateButton";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_KEY;

const MapCont = styled.div`
  height: 70vh;
  width: 100%;
  flex: 1;
  z-index: 1;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--color-dkgrey);
  @media ${QUERIES.tablet} {
    height: 85vh;
  }
`;

const PopupContent = styled.span`
  padding: 8px;
  font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans",
    source-sans-pro, sans-serif;
  font-size: 10px;
  font-weight: 300;
`;

export default function MapGL() {
  const navigate = useNavigate();

  const { recordings } = useRecordings();

  const [mapPosition, setMapPosition] = useState([
    50.71733015526967, 1.8731689453125002,
  ]); // DEFAULT MAP POSITION
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeoLocation();
  const [mapLat, mapLng] = useUrlPositon();
  const markerRefs = useRef({});
  const mapRef = useRef(null);
  const bounds = useRef(null);
  const [done, setDone] = useState(false);
  const [tempLat, setTempLat] = useState(null);
  const [tempLng, setTempLng] = useState(null);
  const [isMobile, setIsMobile] = useState(null);
  const [searchParams] = useSearchParams();
  const activeMarkerId = searchParams.get("id");
  const { setCurrentBounds } = useCurrentBounds();

  const [viewState, setViewState] = useState({
    longitude: mapPosition[1],
    latitude: mapPosition[0],
    zoom: 3,
  });
  const [visibleRecordings, setVisibleRecordings] = useState([]);

  // THE FOLLOWING API CALL SEEMS TO TRIGGER CONSTANTLY AND ALSO DOES NOT RETURN THE EXPECTED RESULTS.
  // CHECK THE LNG & LAT? IT'S ALSO POSSIBLE THE THIS WON'T WORK IN GLOBE MAP
  // const {
  //   loadingRecordingsByBounds,
  //   recordingsByBounds,
  //   recordingsByBoundsError,
  // } = useRecordingsByMapBounds(bounds.current);

  // console.log("list", recordingsByBounds);

  useEffect(() => {
    // Check screen width when the component mounts
    setIsMobile(window.innerWidth <= 1100);
  }, []);

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
      setViewState({
        ...viewState,
        longitude: mapLng,
        latitude: mapLat,
      });
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      setViewState({
        ...viewState,
        longitude: geolocationPosition.lng,
        latitude: geolocationPosition.lat,
      });
      navigate(
        `?lat=${geolocationPosition.lat}&lng=${geolocationPosition.lng}`
      );
    }
  }, [geolocationPosition, navigate]);

  useEffect(() => {
    if (activeMarkerId && done) {
      const markerToOpen = markerRefs.current[activeMarkerId];
      if (markerToOpen) {
        markerToOpen.togglePopup();
      }
    }
  }, [activeMarkerId, done]);

  useEffect(() => {
    if (!location.pathname.includes("/add")) {
      setTempLat(null);
      setTempLng(null);
    }
  }, [searchParams]);

  const getBounds = useCallback(() => {
    const mapBounds = mapRef.current?.getBounds();
    if (mapBounds) {
      const newBounds = {
        _sw: mapBounds.getSouthWest(),
        _ne: mapBounds.getNorthEast(),
      };
      // Only update context if bounds are different
      if (
        !bounds.current ||
        bounds.current._sw.lat !== newBounds._sw.lat ||
        bounds.current._sw.lng !== newBounds._sw.lng ||
        bounds.current._ne.lat !== newBounds._ne.lat ||
        bounds.current._ne.lng !== newBounds._ne.lng
      ) {
        bounds.current = newBounds;
        setCurrentBounds(newBounds);
        console.log(newBounds);
      }
    }
  }, [setCurrentBounds]);

  const debouncedGetBounds = useDebounce(getBounds, 500);

  useEffect(() => {
    debouncedGetBounds();
  }, [viewState, debouncedGetBounds]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    // Set padding when the map is loaded
    map.setPadding({
      top: 50,
      bottom: 50,
      left: 50,
      right: isMobile ? 50 : 500,
    });
    map.setFog({
      "horizon-blend": 0.3,
      "high-color": "#a1d7e9",
      "space-color": "#0c3947",
      "star-intensity": 1.0,
    });
  };

  const handleMapClick = async (event) => {
    if (event.originalEvent.target.closest(".mapboxgl-marker")) {
      return; // Click target was a marker so do nothing…
    }
    const { lng, lat } = event.lngLat;

    setTempLng(lng);
    setTempLat(lat);
    navigate(`add?lat=${lat}&lng=${lng}`);
  };

  const getYourPosition = () => {
    getPosition();
    setViewState((prev) => ({
      ...prev,
      zoom: 6,
    }));
  };

  return (
    <>
      <MapCont>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/standard-satellite"
          projection="globe"
          showPlaceLabels={true}
          onLoad={(evt) => handleMapLoad(evt.target)}
          onClick={handleMapClick}
        >
          {Array.isArray(recordings) &&
            recordings.map((recording, index) => (
              <Marker
                key={recording.id}
                longitude={recording.position.lng}
                latitude={recording.position.lat}
                anchor="bottom"
                onClick={() =>
                  navigate(
                    `explore/${recording.id}?id=${recording.id}&lat=${recording.position.lat}&lng=${recording.position.lng}`
                  )
                }
              >
                <img
                  src="/mapMarker.svg"
                  alt="Marker"
                  style={{ width: 45, height: 60 }}
                />
                {activeMarkerId === String(recording.id) && (
                  <Popup
                    longitude={recording.position.lng}
                    latitude={recording.position.lat}
                    closeOnClick={false}
                    offset={[0, -60]}
                    // onClose={() => navigate(`/app/explore`)} ---> this will get triggered by (and override) any navigation away from activeMarker
                  >
                    <PopupContent>{recording.title}</PopupContent>
                  </Popup>
                )}
              </Marker>
            ))}

          {tempLat && (
            <Marker longitude={tempLng} latitude={tempLat} anchor="bottom">
              <img
                src="/mapMarkerAdd.svg"
                alt="New Recording Marker"
                style={{ width: 45, height: 60 }}
              />
            </Marker>
          )}
        </Map>

        <GeoLocateButton
          getYourPosition={getYourPosition}
          isLoadingPosition={isLoadingPosition}
        />
      </MapCont>
    </>
  );
}
