import React, { FC, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import {
  MapContainer,
  useMap,
  WMSTileLayer,
  Marker,
  Popup,
  useMapEvents,
  TileLayer,
  LayersControl
} from "react-leaflet";
import L, { LatLng, LatLngExpression } from "leaflet";
import { getDarek } from "api/SearchMap/useGetDarek";
import { useSearchParams } from "react-router-dom";

const { BaseLayer, Overlay } = LayersControl;

type ArchiveObjectListViewProps = {};

const DarekView: FC<ArchiveObjectListViewProps> = observer(() => {
  const [searchParams] = useSearchParams();
  const eni = searchParams.get("eni");
  const coordinateParam = searchParams.get("coordinate");
  const [isMapReady, setMapReady] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const [popupData, setPopupData] = useState<Record<string, string> | null>(null);
  const [popupPosition, setPopupPosition] = useState<LatLngExpression | null>(null);
  const [popupPropsData, setPopupPropsData] = useState<Record<string, string> | null>(null);
  const [popupPropsPosition, setPopupPropsPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if(eni != null){
      handleMapEniSearch()
    }
  }, [eni]);

  useEffect(() => {
    if (coordinateParam) {
      const coordArray = coordinateParam.split(",").map(Number);
      if (coordArray.length === 2 && !isNaN(coordArray[0]) && !isNaN(coordArray[1])) {
        setPopupPropsPosition([coordArray[0], coordArray[1]]);
        console.log(popupPropsPosition);
      }
    }
  }, [coordinateParam]);

  const wmsUrl = "http://map.darek.kg/qgis/qgis_mapserv.fcgi.exe?map=C:/OSGeo4W64/projects/ГИСАР/ГИСАР.qgz";

  const wmsBaseParams = {
    SERVICE: "WMS",
    REQUEST: "GetMap",
    LAYERS: "Граница Кыргызстана,Границы областей,Границы районов,Границы айылных аймаков,Озера,Улицы,Жайыльский район,Участки ЕНИ,Здания ЕНИ",
    STYLES: "",
    FORMAT: "image/png",
    TRANSPARENT: true,
    VERSION: "1.3.0",
    EXCEPTIONS: "INIMAGE",
    CRS: "EPSG:3857",
    DPI: 96,
    OPACITIES: "255,255,255,255,255,255,255,255,255,255,255,255"
  };

  const convertToEPSG3857 = (lat: number, lng: number) => {
    const x = (lng * 20037508.34) / 180;
    const y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    return [x, (y * 20037508.34) / 180];
  };

  const parseXMLResponse = (xmlText: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const area = xmlDoc.querySelector("Layer[name='Участки ЕНИ']");
    const build = xmlDoc.querySelector("Layer[name='Здания ЕНИ']");
    let object = area;
    if (build.querySelector("Feature") != null) {
      object = build;
    }
    const attributes: Record<string, string> = {};
    attributes["Наименование"] = object.getAttribute("name");
    area.querySelectorAll("Attribute").forEach(attr => {
      let name = attr.getAttribute("name");
      let value = attr.getAttribute("value");
      if (name !== "oid" && name != null && value != null) {
        if (value === "NULL") {
          value = "";
        }
        if (value === "true" || value === "false") {
          value = value === "true" ? "Да" : "Нет";
        }
        attributes[name] = value;
      }
    });
    return attributes;
  };

  const handleMapEniSearch = async () => {
    const response = await getDarek(eni);
    if ((response.status === 201 || response.status === 200) && response?.data !== null) {
      const { geometry, address } = response.data;
      if (geometry && geometry[0]) {
        let coordinates = JSON.parse(geometry)[0];
        setPopupPropsPosition([coordinates[0], coordinates[1]]);
        setPopupPropsData({ 'Адрес': address });
      }
    }
  };

  const handleMapClick = async (event: L.LeafletMouseEvent) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const { lat, lng } = event.latlng;
    const bounds = map.getBounds();
    const size = map.getSize();

    const [west, south] = convertToEPSG3857(bounds.getSouth(), bounds.getWest());
    const [east, north] = convertToEPSG3857(bounds.getNorth(), bounds.getEast());
    const bbox = `${west},${south},${east},${north}`;

    const [x, y] = convertToEPSG3857(lat, lng);
    const I = Math.round((x - west) / (east - west) * size.x);
    const J = Math.round((north - y) / (north - south) * size.y);

    const queryUrl = `${wmsUrl}&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&EXCEPTIONS=INIMAGE&BBOX=${bbox}&FEATURE_COUNT=10&HEIGHT=${Math.round(size.y)}&WIDTH=${Math.round(size.x)}&INFO_FORMAT=text/xml&CRS=EPSG:3857&I=${I}&J=${J}&QUERY_LAYERS=${wmsBaseParams.LAYERS}`;

    try {
      const response = await fetch(queryUrl);
      if (!response.ok) throw new Error("Ошибка запроса");
      const text = await response.text();
      const parsedData = parseXMLResponse(text);
      setPopupPosition([lat, lng]);
      setPopupData(parsedData);
    } catch (error) {
      console.error("Ошибка запроса GetFeatureInfo:", error);
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click: handleMapClick
    });
    return null;
  }

  const MapHandler = () => {
    const map = useMap();
    useEffect(() => {
      if (!isMapReady) {
        setMapReady(true);
        mapRef.current = map;
      }
    }, [map]);
    return null;
  };

  return (
    <MapContainer
      center={[42.87, 74.60] as LatLngExpression}
      zoom={11}
      maxZoom={19}
      style={{ height: "89vh", width: "100%" }}>
      <MapHandler />
      <MapClickHandler />
      <LayersControl position="topright">
        <BaseLayer checked name="Darek.kg">
      <WMSTileLayer
        url={wmsUrl}
        maxZoom={24}
        layers={wmsBaseParams.LAYERS as string}
        format="image/png"
        transparent={true}
        version="1.3.0"
        crs={L.CRS.EPSG3857}
      />
        </BaseLayer>
          <BaseLayer name="Спутник">
            <TileLayer
              maxZoom={24}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
            />
          </BaseLayer>
      </LayersControl>
      {popupPropsPosition && (
          <Marker position={popupPropsPosition}>
            <Popup>
              {popupPropsData && <div>
                <strong>Адрес:</strong> {popupPropsData["Адрес"]}
              </div>}
            </Popup>
          </Marker>
      )}
      {popupPosition && popupData && (
        <Marker position={popupPosition}>
          <Popup>
            <div>
              {Object.entries(popupData).map(([key, value]) => (
                <div key={key}><strong>{key}:</strong> {value}</div>
              ))}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
});

export default DarekView;
