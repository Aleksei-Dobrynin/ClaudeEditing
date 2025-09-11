import * as React from 'react';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Grid, Paper, Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from './store';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "./style.css";
import L from "leaflet";

import { useNavigate } from "react-router-dom";
import DateField from 'components/DateField';
import AutocompleteCustom from 'components/Autocomplete';
import MtmLookup from "components/mtmLookup";
import MainStore from "../../../MainStore";
import CustomButton from "../../../components/Button";
import { FRONT_URL } from "constants/config";

const { BaseLayer } = LayersControl;

const MapView = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  store.headStructure = props.headStructure

  React.useEffect(() => {
    store.doLoad();
  }, [])

  const handleExport = async () => {
    const params = new URLSearchParams({
      date_start: store.map_date_start.toISOString(),
      date_end: store.map_date_end.toISOString(),
      service_ids: store.map_service_ids.join(","),
      tag_ids: store.tag_ids.toString(),
      status_code: store.Statuses.find(x => x.id === store.map_status_id)?.code ?? ""
    });

    const link = `${FRONT_URL}/user/MapView?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(link);
      MainStore.setSnackbar("Ссылка скопирована в буфер обмена!", "success");
      window.open(link, "_blank");
    } catch (err) {
      MainStore.setSnackbar("Не удалось скопировать ссылку", "error");
    }
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
            <h2>
              {translate("label:Dashboard.Number_of_registered_applications")}
            </h2>
          </Grid>
          <Grid item md={3} xs={12}>
            <MtmLookup
              value={store.map_service_ids}
              onChange={(name, value) => store.changeServices(value)}
              name="map_service_ids"
              data={store.Services}
              fieldNameDisplay={(f) => f.name}
              id="map_service_ids"
              label={translate("label:Dashboard.service")}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <AutocompleteCustom
              value={store.map_status_id}
              onChange={(event) => store.changeApplications(event)}
              name="map_status_id"
              data={store.Statuses}
              fieldNameDisplay={(f) => f.name}
              id="map_status_id"
              label={translate("label:Dashboard.status")}
              helperText={""}
              error={false}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <MtmLookup
              value={store.tag_ids}
              onChange={(name, value) => store.changeTags(value)}
              name="tag_ids"
              data={store.Tags}
              fieldNameDisplay={(f) => f.name}
              id="tag_ids"
              label={translate("label:Dashboard.tag")}
              helperText={""}
              error={false}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <DateField
              value={store.map_date_start}
              onChange={(event) => store.changeApplications(event)}
              name="map_date_start"
              id="map_date_start"
              label={translate("label:Dashboard.startDate")}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <DateField
              value={store.map_date_end}
              onChange={(event) => store.changeApplications(event)}
              name="map_date_end"
              id="id_f_date_start"
              label={translate("label:Dashboard.endDate")}
            />
          </Grid>
        </Grid>
        <CustomButton onClick={handleExport}>Экспортировать ссылку</CustomButton>
        <Box sx={{ mt: 2 }}>
          <MapContainer
            className="markercluster-map"
            center={[42.87, 74.60]}
            zoom={12}
            maxZoom={18}
          >
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
            <MarkerClusterGroup>
              {store.data.map(element => {
                const color = element.tags_color ? element.tags_color.split(",")[0] : "#000000";
                const customIcon = L.divIcon({
                  className: "",
                  html: `
      <svg xmlns="http://www.w3.org/2000/svg" 
           viewBox="796 796 200 200" 
           width="50" height="50">
        <path 
          d="M970.135,870.134C970.135,829.191,936.943,796,896,796c-40.944,0-74.135,33.191-74.135,74.134 
             c0,16.217,5.221,31.206,14.055,43.41l-0.019,0.003L896,996l60.099-82.453l-0.019-0.003 
             C964.912,901.34,970.135,886.351,970.135,870.134z 
             M896,900.006c-16.497,0-29.871-13.374-29.871-29.872s13.374-29.871,29.871-29.871 
             s29.871,13.373,29.871,29.871S912.497,900.006,896,900.006z" 
          fill="${color}" stroke="white" stroke-width="5"
        />
      </svg>
    `,
                  iconSize: [50, 50],
                  iconAnchor: [25, 50],
                  popupAnchor: [0, -50],
                });
                return <Marker key={element.app_id} position={[element.xcoordinate, element.ycoordinate]} icon={customIcon}>
                  <Popup>
                    <div>
                      <strong>Адрес: </strong>{element.address}<br />
                      <strong>Номер заявки: </strong>{element.number}<br />
                      <strong>Услуга: </strong>{element.service_name} {element.work_description && `(${element.work_description})`}<br />
                      <strong>Заказчик: </strong>{element.customer}<br />
                      <strong>Статус заявки: </strong>{element.status}<br />
                      <strong>Тэги объекта: </strong>{element.tags}<br />
                      <p></p>
                    </div>
                  </Popup>
                </Marker>
              })}
            </MarkerClusterGroup>
          </MapContainer>
        </Box>
      </Paper>
    </>
  );

})


export default MapView