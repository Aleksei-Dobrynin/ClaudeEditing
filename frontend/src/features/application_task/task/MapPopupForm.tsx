import React, { FC, useEffect, useRef, useState } from "react";
import {
  TextField,
  Slider,
  Grid,
  Box,
  Button,
  Dialog,
  CardHeader,
  Divider,
  Paper,
  Tooltip,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMapEvents, LayersControl } from "react-leaflet";
import L, { LatLngExpression, LatLngTuple } from "leaflet";
import CustomButton from "components/Button";
import { observer } from "mobx-react";
import MaskedAutocomplete from "../../../components/MaskedAutocomplete";
import GisSearch from "components/2gisSearch";
import CustomTextField from "components/TextField";

type ProjectsTableProps = {};

const { BaseLayer } = LayersControl;

const ObjectMapPopupView: FC<ProjectsTableProps> = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const mapRef = useRef(null);

  useEffect(() => {
  }, [store.mapLayers, store.mapDutyPlanObject]);

  const updateWmsParams = (e) => {
    if (store.coordsInEditing) {
      store.setCoords(e.latlng.lat, e.latlng.lng);
    }
  };

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



  return (
    <Dialog open={store.openPanelMap} fullWidth maxWidth={"lg"} onClose={() => store.onCancelClickMap()}>
      <DialogContent>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1, marginRight: 1 }}>
          {`${translate("label:ApplicationAddEditView.Object_address")}: `}
          <span style={{ fontWeight: "normal" }}>
            {store.arch_objects.map(x => x.address).join(", ")}
          </span>
        </Typography>
        {store.newCoordAddres !== "" &&
          <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1, marginRight: 1 }}>
            {`${translate("Новый адрес")}: `}
            <span style={{ fontWeight: "normal" }}>
            {store.newCoordAddres}
          </span>
          </Typography>}
        <Grid container spacing={3}>
          <Grid item md={9}>
            <MapContainer
              ref={(ref) => {
                if (ref && mapRef.current !== ref) {
                  mapRef.current = ref;
                  ref.on("click", updateWmsParams);
                }
              }}
              center={[42.87, 74.60] as LatLngExpression}
              zoom={12}
              style={{ height: "700px", width: "100%" }}>
              <LayersControl position="topright">
                <BaseLayer checked name="Схема">
              <TileLayer
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
              </LayersControl>
              {store.object_xcoord !== 0 && store.object_ycoord !== 0 &&
                <Marker position={[store.object_xcoord, store.object_ycoord]}>
                  <Popup>
                    <div>
                      <strong>Адрес:</strong> {store.object_address}
                    </div>
                  </Popup>
                </Marker>}

              {store.mapLayers?.length > 0 && store.mapLayers.map((layer, index) => {
                  const customIcon = createCustomIcon(layer.type);
                  if (!layer.point || !layer.address)
                  {
                    return ;
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

              {store.mapDutyPlanObject?.length > 0 && store.mapDutyPlanObject.map((layer, index) => {
                const customIcon = createCustomIcon(layer.number, "#0000FF");
                if (!layer.point || !layer.address)
                {
                  return ;
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
                          rel="noopener noreferrer">Открыть в 2gis</a><br />
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
                            {files.filter(item => item.folder_name && item.file_name).map((item, index) => (
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
          </Grid>
          <Grid item md={3}>
            <Grid container spacing={1}>
              <Grid item md={12}>
              <MaskedAutocomplete
                  data={store.DarekSearchList ?? []}
                  value={0}
                  label={translate("label:ArchObjectAddEditView.identifier")}
                  name="darek_eni"
                  onChange={(newValue: any) => {
                    store.darek_eni = newValue.propcode;
                    store.identifier = newValue.propcode;
                    store.searchFromDarek(newValue.propcode);
                  }}
                  freeSolo={true}
                  fieldNameDisplay={(option) => option?.propcode}
                  onInputChange={(event, value) => {
                    store.darek_eni = "";
                    if (value?.length > 12) {
                      store.identifier = value;
                      store.getSearchListFromDarek(value);
                    }
                  }}
                  mask="0-00-00-0000-0000-00-000"
                />
              </Grid>
              <Grid item md={12}>
                <GisSearch
                  id="id_f_ArchObject_address"
                  label={translate("label:ArchObjectAddEditView.address")}
                  onChange={store.handleAddressChange}
                  value={store.address}
                />
              </Grid>
              <Grid item md={12}>
                    <CustomTextField
                      helperText={store.errordutyPlanObjectNumber}
                      error={store.errordutyPlanObjectNumber != ""}
                      id="id_f_dutyPlanObjectNumber"
                      label={translate("Поиск по объектам дежурного плана")}
                      value={store.dutyPlanObjectNumber}
                      onChange={(event) => {
                        store.handleChange(event)
                        store.loadDutyPlanObjects();
                      }}
                      name="dutyPlanObjectNumber"
                    />
              </Grid>
                    <Grid item md={11}>
                    <Typography>Радиус поиска от точки (м): {store.radius} </Typography>
                    <Slider
                      value={store.radius}
                      onChange={(e, newValue) => {
                        store.radius = newValue as number;
                        store.loadDutyPlanObjects();
                      }}
                      disabled={store.object_xcoord == 0 && store.object_ycoord == 0}
                      valueLabelDisplay="auto"
                      min={100}
                      max={1000}
                      step={100}
                    />
              </Grid>
          </Grid>

        </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Box display="flex" justifyContent={"space-between"} sx={{ width: "100%" }}>
          <Box>
            {store.object_xcoord !== 0 && store.object_ycoord !== 0 &&
              <a
                style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                target="_blank"
                href={`https://2gis.kg/bishkek/geo/${store.object_ycoord}%2C${store.object_xcoord}?m=${store.object_ycoord}%2C${store.object_xcoord}%2F14.6`}>
                {translate("common:openIn2GIS")}
              </a>}
            {store.darek_eni?.length !== 0 &&
              <a
                style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                target="_blank"
                href={`/user/DarekView?eni=${store.darek_eni}`}>
                {translate("common:openInDarekOnEni")}
              </a>}
            {store.object_xcoord !== 0 && store.object_ycoord !== 0 &&
              <a
                style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                target="_blank"
                href={`/user/DarekView?coordinate=${store.object_xcoord},${store.object_ycoord}`}>
                {translate("common:openInDarekOnLatLng")}
              </a>}
          </Box>
          <Box>
            {store.coordsInEditing ? <CustomButton
                variant="contained"
                disabled={!store.coordsEdited}
                id="id_ApplicationSaveButton"
                onClick={() => {
                  store.saveCoords();
                }}
              >
                {translate("common:save")}
              </CustomButton> :
              <CustomButton
                variant="contained"
                id="id_ApplicationSaveButton"
                onClick={() => {
                  store.changeEditCoord(true);
                }}
              >
                {translate((store.object_xcoord !== 0 && store.object_ycoord !== 0) ? "Изменить точку" : "Поставить точку")}
              </CustomButton>}
            <CustomButton
              variant="contained"
              sx={{ ml: 1 }}
              id="id_ApplicationCancelButton"
              onClick={() => store.onCancelClickMap()}
            >
              {translate(store.coordsInEditing ? "common:cancel" : "common:close")}
            </CustomButton>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>

  );
});


export default ObjectMapPopupView;
