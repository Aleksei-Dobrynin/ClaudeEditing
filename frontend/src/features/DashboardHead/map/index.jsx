import * as React from 'react';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Grid, Paper, Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from './store';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "./style.css";

import DateField from 'components/DateField';
import AutocompleteCustom from 'components/Autocomplete';

const { BaseLayer } = LayersControl;

const MapView = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  store.headStructure = props.headStructure

  React.useEffect(() => {
    store.doLoad();
  }, [])

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
            <AutocompleteCustom
              value={store.map_service_id}
              onChange={(event) => store.changeApplications(event)}
              name="map_service_id"
              data={store.Services}
              fieldNameDisplay={(f) => f.name}
              id="map_service_id"
              label={translate("label:Dashboard.service")}
              helperText={""}
              error={false}
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
            <AutocompleteCustom
              value={store.tag_id}
              onChange={(event) => store.changeApplications(event)}
              name="tag_id"
              data={store.Tags}
              fieldNameDisplay={(f) => f.name}
              id="tag_id"
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
                return <Marker key={element.app_id} position={[element.xcoordinate, element.ycoordinate]}>
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