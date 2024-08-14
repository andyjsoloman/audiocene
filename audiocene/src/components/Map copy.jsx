import useMapPosition from "../hooks/useMapPosition";

function Map() {
  const navigate = useNavigate();
  const {
    isLoading,
    data: recordings = [],
    error,
  } = useQuery({
    queryKey: ["recordings"],
    queryFn: getRecordings,
  });

  return (
    <>
      <MapCont>
        <StyledMapContainer
          center={mapPosition}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {recordings.map((recording) => (
            <Marker
              position={[recording.position.lat, recording.position.lng]}
              key={recording.id}
              icon={mapIcon}
              eventHandlers={{
                click: () => {
                  navigate(
                    `favourites/${recording.id}?lat=${recording.position.lat}&lng=${recording.position.lng}`
                  );
                },
              }}
            >
              <Popup>
                <span>{recording.title}</span>
              </Popup>
            </Marker>
          ))}
          <ChangeLocation position={mapPosition} />
          <DetectClick />
        </StyledMapContainer>
      </MapCont>
      <Button onClick={getPosition} variant={"locate"}>
        {isLoading ? "Loading..." : "Get your position"}{" "}
      </Button>
    </>
  );
}
