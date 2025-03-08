import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import supercluster from "supercluster";

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

  // DEFAULT MAP POSITION
  const [mapPosition, setMapPosition] = useState([
    50.71733015526967, 1.8731689453125002,
  ]);

  //Geolocation state & function
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeoLocation();

  //Get map lat/lng from url params
  const [mapLat, mapLng] = useUrlPositon();

  //refs for markers, map & bounds
  const markerRefs = useRef({});
  const mapRef = useRef(null);
  const bounds = useRef(null);

  //Interaction tracking
  const [done, setDone] = useState(false);
  const [tempLat, setTempLat] = useState(null);
  const [tempLng, setTempLng] = useState(null);
  const [isMobile, setIsMobile] = useState(null);

  //Get active marker from url params
  const [searchParams] = useSearchParams();
  const activeMarkerId = searchParams.get("id");

  //Context for updating map bounds
  const { setCurrentBounds } = useCurrentBounds();

  //Initial view state
  const [viewState, setViewState] = useState({
    longitude: mapPosition[1],
    latitude: mapPosition[0],
    zoom: 3,
  });

  const [visibleRecordings, setVisibleRecordings] = useState([]);

  const cluster = useRef(
    new supercluster({
      radius: 60, // Distance in pixels to cluster points
      maxZoom: 16, // Don't cluster above this zoom level
    })
  );

  useEffect(() => {
    if (Array.isArray(recordings) && recordings.length > 0) {
      cluster.current.load(
        recordings.map((rec) => ({
          type: "Feature",
          properties: { cluster: false, recordingId: rec.id, title: rec.title },
          geometry: {
            type: "Point",
            coordinates: [rec.position.lng, rec.position.lat],
          },
        }))
      );
    }
  }, [recordings]);

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

  const getClusters = useCallback(() => {
    if (!mapRef.current || !cluster.current) return [];

    const mapBounds = mapRef.current.getBounds();
    const zoom = Math.floor(mapRef.current.getZoom());

    if (!mapBounds) return [];

    // Check if cluster.current is defined and has getClusters method
    if (!cluster.current.getClusters) {
      console.error("Supercluster instance is missing `getClusters` method.");
      return [];
    }

    // Try getting clusters and handle possible errors
    try {
      const clusters = cluster.current.getClusters(
        [
          mapBounds.getWest(),
          mapBounds.getSouth(),
          mapBounds.getEast(),
          mapBounds.getNorth(),
        ],
        zoom
      );

      // Check if range is accessible (indirectly, since it's internal)
      const tree = cluster.current.trees?.[cluster.current._limitZoom(zoom)];
      // console.log("Tree:", tree);
      // console.log(
      //   "Tree range method exists:",
      //   tree && typeof tree.range === "function"
      // );

      return clusters;
    } catch (error) {
      console.error("Error while getting clusters:", error);
      return [];
    }
  }, [mapRef.current]);

  const clusters = getClusters();

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
          {clusters.map((clusterData) => {
            const [longitude, latitude] = clusterData.geometry.coordinates;
            const {
              cluster: isCluster,
              cluster_id,
              recordingId,
              point_count,
            } = clusterData.properties;

            const markerKey = isCluster
              ? `cluster-${cluster_id}`
              : `recording-${recordingId}`;

            if (isCluster) {
              return (
                <Marker
                  key={markerKey}
                  longitude={longitude}
                  latitude={latitude}
                >
                  <div
                    style={{
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      borderRadius: "50%",
                      width: `${20 + (point_count / recordings.length) * 30}px`,
                      height: `${
                        20 + (point_count / recordings.length) * 30
                      }px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster_id),
                        16
                      );
                      setViewState({
                        ...viewState,
                        longitude,
                        latitude,
                        zoom: expansionZoom,
                      });
                    }}
                  >
                    {point_count}
                  </div>
                </Marker>
              );
            }

            // Render individual recording markers
            return (
              <Marker
                key={markerKey}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
              >
                <img
                  src="/mapMarker.svg"
                  alt="Marker"
                  style={{ width: 45, height: 60 }}
                />
                {activeMarkerId === String(recordingId) && (
                  <Popup
                    longitude={longitude}
                    latitude={latitude}
                    closeOnClick={false}
                    offset={[0, -60]}
                  >
                    <PopupContent>{clusterData.properties.title}</PopupContent>
                  </Popup>
                )}
              </Marker>
            );
          })}

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
