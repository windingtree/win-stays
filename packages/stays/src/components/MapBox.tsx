import type { Map, LatLngExpression } from "leaflet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Logger from "../utils/logger";

const logger = Logger('Map');
const center: LatLngExpression = [51.505, -0.09]
const zoom = 13

const DisplayPosition = ({ map }: { map: Map }) => {
  const [position, setPosition] = useState(() => map.getCenter())
  const [zoom, setZoom] = useState(() => map.getZoom())

  // const onClick = useCallback(() => {
  //   map.setView(center, zoom)
  // }, [map])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  const onZoom = useCallback(() => {
    setZoom(map.getZoom())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  useEffect(() => {
    map.on('zoom', onZoom)
    return () => {
      map.off('zoom', onZoom)
    }
  }, [map, onZoom])

  useEffect(() => {
    logger.debug(`latitude: ${position.lat.toFixed(4)}, longitude: ${position.lng.toFixed(4)}`);
  }, [position])

  useEffect(() => {
    logger.debug(`zoom: ${zoom}`);
  }, [zoom])

  return null
}

export const MapBox = () => {
  const [map, setMap] = useState<Map | null>(null)

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          height: "70vh",
          // width: "100vw"
        }}
        scrollWheelZoom={false}
        // @ts-ignore
        ref={setMap}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    [],
  )

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  )
};
