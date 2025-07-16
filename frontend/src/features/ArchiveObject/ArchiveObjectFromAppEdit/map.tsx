import React, { FC, useRef, useState, useEffect } from "react";
import { observer } from "mobx-react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap, Popup, Marker,
  LayersControl,
  WMSTileLayer
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { LatLngExpression } from "leaflet";
import drawLocales from "leaflet-draw-locales";
import L from "leaflet";
import store from "./store";
import proj4 from "proj4";
import { Grid, Slider, Typography } from "@mui/material";
import MaskedAutocomplete from "components/MaskedAutocomplete";
import { useTranslation } from "react-i18next";
import CustomTextField from "components/TextField";
import GisSearch from "components/2gisSearch";

const { BaseLayer, Overlay } = LayersControl;

type MapContainerViewProps = {};

proj4.defs(
  "EPSG:7694",
  "+proj=tmerc +lat_0=0 +lon_0=74.5166666666667 +k=1 +x_0=3300000 +y_0=14743.5 +datum=WGS84 +units=m +no_defs"
);

const MapContainerView: FC<MapContainerViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [isMapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const wmsUrl = 'http://map.darek.kg/qgis/qgis_mapserv.fcgi.exe?map=C:/OSGeo4W64/projects/ГИСАР/ГИСАР.qgz';

  const createCustomIcon = (text?: string, color?: string) => {
    const displayText = text || "";
    const displayColor = color || "#FF0000";
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" xml:space="preserve">
        <path d="M26 12c0 8-11 17-11 17S4 20 4 12C4 5.9 8.9 1 15 1s11 4.9 11 11" fill="${displayColor}"/>
        <circle cx="15" cy="12" r="10" fill="#FFFFFF"/>
        <text x="15" y="16" font-size="7" text-anchor="middle" fill="#000000" font-family="Arial">${displayText}</text>
      </svg>`;
    const encodedSvg = btoa(unescape(encodeURIComponent(svgIcon)));

    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
      iconSize: [40, 40],
      iconAnchor: [20, 60]
    });
  };


  const wmsBaseParams = {
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    LAYERS: 'Граница Кыргызстана,Границы областей,Границы районов,Границы айылных аймаков,Озера,Улицы,Жайыльский район,Участки ЕНИ,Здания ЕНИ',
    STYLES: '',
    FORMAT: 'image/png',
    TRANSPARENT: true,
    VERSION: '1.3.0',
    EXCEPTIONS: 'INIMAGE',
    CRS: 'EPSG:3857',
    DPI: 96,
    OPACITIES: '255,255,255,255,255,255,255,255,255,255,255,255',
  };

  const [wmsParams, setWmsParams] = useState<Record<string, string | number | boolean>>(wmsBaseParams);

  const updateWmsParams = () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const southWest = map.options.crs.project(bounds.getSouthWest());
    const northEast = map.options.crs.project(bounds.getNorthEast());

    const bbox = `${southWest.x},${southWest.y},${northEast.x},${northEast.y}`;
    console.log('BBOX:', bbox);

    const mapContainer = map.getContainer();
    const width = mapContainer.offsetWidth;
    const height = mapContainer.offsetHeight;

    const aspectRatio = width / height;

    const mapBoundsWidth = northEast.x - southWest.x;
    const mapBoundsHeight = northEast.y - southWest.y;
    const mapAspectRatio = mapBoundsWidth / mapBoundsHeight;

    let adjustedWidth = width;
    let adjustedHeight = height;

    if (aspectRatio > mapAspectRatio) {
      adjustedWidth = Math.round(height * mapAspectRatio);
    } else if (aspectRatio < mapAspectRatio) {
      adjustedHeight = Math.round(width / mapAspectRatio);
    }

    const newParams = {
      ...wmsBaseParams,
      BBOX: bbox,
      WIDTH: adjustedWidth,
      HEIGHT: adjustedHeight,
    };
    setWmsParams(newParams);
  };

  const constructWmsUrl = (baseUrl: string, params: Record<string, string | number | boolean>): string => {
    const query = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    return `${baseUrl}&${query}`;
  };

  useEffect(() => {
    if (!featureGroupRef.current) {
      featureGroupRef.current = new L.FeatureGroup();
    }
    drawLocales("ru");
    L.drawLocal.draw.toolbar.buttons.polygon = "Создать полигон";
    console.log(L.drawLocal);
    return () => {
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
      }
    };
  }, []);

  useEffect(() => {
    if (store.geometry.length > 0 && mapRef.current) {
      const map = mapRef.current;

      const bounds = store.geometry;

      const swappedBounds = bounds.map((point) => [point[1], point[0]]);

      if (bounds && bounds.length > 0) {
        const geoJson: GeoJSON.Feature = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [swappedBounds]
          },
          properties: {}
        };
        store.addLayerOne(geoJson);

        const leafletLayer = L.geoJSON(geoJson);
        featureGroupRef.current?.addLayer(leafletLayer);

        map.fitBounds(leafletLayer.getBounds());
      }
    }
    if (store.point.length > 0 && mapRef.current) {
      const map = mapRef.current;
      const point = store.point;

      const geoJsonPoint: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point[1], point[0]],
        },
        properties: {},
      };
      store.addLayerOne(geoJsonPoint);

      const marker = L.geoJSON(geoJsonPoint, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
      });

      featureGroupRef.current?.addLayer(marker);

      map.setView([point[0], point[1]], map.getZoom());
    }
  }, [store.geometry, store.point]);

  useEffect(() => {
    if (isMapReady && featureGroupRef.current && store.mapLayers) {
      featureGroupRef.current.clearLayers();
      store.mapLayers.forEach((layer) => {
        try {
          const leafletLayer = L.geoJSON(layer);
          leafletLayer.addTo(featureGroupRef.current!);
        } catch (error) {
          console.log("Invalid GeoJSON format", error, layer);
        }
      });
    }
  }, [isMapReady, store.mapLayers]);

  const MapHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (!isMapReady) {
        setMapReady(true);
        mapRef.current = map;

        // //TODO, поставить правильные координаты из поиска
        // const kyrg06Coords = [3298815.672286, 4761449.670162]; // Example input in EPSG:7694
        // // Direct conversion to EPSG:3857 (Web Mercator)
        // const webMercatorCoords = proj4("EPSG:7694", "EPSG:3857", kyrg06Coords);
        // const [x, y] = webMercatorCoords;
        // // Unproject the Web Mercator coordinates to lat/lng for Leaflet
        // const latLng = L.CRS.EPSG3857.unproject(L.point(x, y));
        // map.setView(latLng, 21); // Pan to the converted coordinates
      }
    }, [map]);

    return null;
  };

  const onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon" || layerType === "marker") {
      const geoJSON = layer.toGeoJSON();
      store.addLayerOne(geoJSON);

      if (featureGroupRef.current) {
        featureGroupRef.current.addLayer(layer);
      }
    }
  };

  const onDeleted = (e: any) => {
    const deletedLayers = e.layers.toGeoJSON().features;
    store.removeLayers(deletedLayers);
  };

  return (
    <>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item md={3}>
          <MaskedAutocomplete
            data={store.DarekSearchList ?? []}
            value={store.identifier}
            label={translate("label:ArchObjectAddEditView.identifier")}
            name="darek_eni"
            onChange={(newValue: any) => {
              store.identifier = newValue?.propcode;
              if (newValue?.address) {
                store.handleChange({ target: { value: newValue?.address, name: "address" } })
              }
              store.handleChange({ target: { value: [], name: "DarekSearchList" } })
              store.searchFromDarek(newValue?.propcode ?? "");

            }}
            freeSolo={true}
            fieldNameDisplay={(option) => option?.propcode}
            onInputChange={(event, value) => {
              store.darek_eni = "";
              const propCode = value?.replaceAll('-', '')
              if (value.length > 12 && store.identifier !== value) {
                store.identifier = value;
                store.getSearchListFromDarek(value);
              }
            }}
            mask="0-00-00-0000-0000-00-000"
          />
        </Grid>
        <Grid item md={3}>
          <GisSearch
            id="id_f_ArchObject_address"
            label={translate("label:ArchObjectAddEditView.address")}
            onChange={store.handleAddressChange}
            value={store.gis_address}
          />
        </Grid>
        <Grid item md={3}>
          <CustomTextField
            helperText={store.errordutyPlanObjectNumber}
            error={store.errordutyPlanObjectNumber != ""}
            id="id_f_dutyPlanObjectNumber"
            label={translate("Поиск по объектам дежурного плана")}
            value={store.dutyPlanObjectNumber}
            onChange={(event) => {
              store.handleChange(event)
              // store.loadDutyPlanObjects();
            }}
            name="dutyPlanObjectNumber"
          />
        </Grid>
        {/* <Grid item md={11}>
          <Typography>Радиус поиска (м): {store.radius} </Typography>
          <Slider
            value={store.radius}
            onChange={(e, newValue) => {
              store.radius = newValue as number;
              store.loadDutyPlanObjects();
            }}
            valueLabelDisplay="auto"
            min={100}
            max={1000}
            step={100}
          />
        </Grid> */}
      </Grid>
      <MapContainer
        ref={(ref) => {
          if (ref && mapRef.current !== ref) {
            mapRef.current = ref;
            ref.on("moveend", updateWmsParams);
            ref.on("zoomend", updateWmsParams);
          }
        }}
        center={[42.87, 74.60] as LatLngExpression}
        zoom={11}
        maxZoom={19}
        style={{ height: "70vh", width: "100%" }}>
        <MapHandler />
        <LayersControl position="topright">
          <BaseLayer checked name="2GIS">
            <TileLayer
              maxZoom={24}
              url="https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1"
              attribution='&copy; <a href="https://2gis.com">2GIS</a>'
            />
          </BaseLayer>
          <BaseLayer name="Схема">
            <TileLayer
              maxZoom={24}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="Спутник">
            <TileLayer
              maxZoom={24}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
            />
          </BaseLayer>
          <Overlay name="Darek.kg" checked>
            <WMSTileLayer
              url={wmsUrl}
              maxZoom={24}
              layers={wmsBaseParams.LAYERS as string}
              format="image/png"
              transparent={true}
              version="1.3.0"
              crs={L.CRS.EPSG3857}
              opacity={0.8}
            />
          </Overlay>
        </LayersControl>
        <FeatureGroup
          ref={(ref) => {
            if (ref && featureGroupRef.current !== ref) {
              featureGroupRef.current = ref;
            }
          }}
        >
          <EditControl
            position="topright"
            onCreated={onCreated}
            onDeleted={onDeleted}
            draw={{
              rectangle: false,
              polygon: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: true
            }}
            edit={{
              featureGroup: featureGroupRef.current!,
              remove: true
            }}
          />
        </FeatureGroup>

        {store.mapLayers.length > 0 && store.mapLayers.map((layer, index) => {
          const customIcon = createCustomIcon(layer.type);
          if (!layer.point || !layer.address) {
            return;
          }
          return (
            <Marker key={index} position={[layer.point[0], layer.point[1]]} icon={customIcon}>
              <Popup>
                <div>
                  <strong>Адрес:</strong> {`${layer.address}`}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {store.mapDutyPlanObject.length > 0 && store.mapDutyPlanObject.map((layer, index) => {
          const customIcon = createCustomIcon(layer.number, "#0000FF");
          if (!layer.point || !layer.address) {
            return;
          }
          const files = JSON.parse(layer.archive_folders);
          return (
            <Marker key={index} position={[layer.point[0], layer.point[1]]} icon={customIcon}>
              <Popup>
                <div>
                  <strong>Номер документа:</strong> {`${layer.number}`}<br />
                  <strong>Адрес:</strong> {`${layer.address}`}<br />
                  <a
                    href={`https://2gis.kg/bishkek/geo/${layer.point[1]}%2C${layer.point[0]}?m=${layer.point[1]}%2C${layer.point[0]}%2F14.6`}
                    target="_blank"
                    rel="noopener noreferrer">Открыть в 2gis</a>
                  <br />
                  <br />
                  {store.arch_obj_id !== layer.id && <a
                    rel="noopener noreferrer"
                    onClick={() => store.onClickDutyInMap(layer)}
                  >
                    Перекинуть сюда
                  </a>}
                  <br />


                  <br />
                  <div style={{ maxHeight: "200px", overflow: "auto", border: "1px solid black" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ border: "1px solid black", padding: "5px" }}>Имя папки</th>
                          <th style={{ border: "1px solid black", padding: "5px" }}>Имя файла</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files?.filter(item => item.folder_name && item.file_name).map((item, index) => (
                          <tr key={index}>
                            <td style={{ border: "1px solid black", padding: "5px" }}>{item.folder_name}</td>
                            <td style={{ border: "1px solid black", padding: "5px" }}>{item.file_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
    </>
  );
});

export default MapContainerView;