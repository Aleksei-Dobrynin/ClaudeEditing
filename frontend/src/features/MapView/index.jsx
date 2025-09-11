import * as React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import store from "./store";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "./style.css";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { Box, Grid } from "@mui/material";
import MtmLookup from "../../components/mtmLookup";
import AutocompleteCustom from "../../components/Autocomplete";
import DateField from "../../components/DateField";

const { BaseLayer } = LayersControl;

const MapView = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [params] = useSearchParams();

  store.headStructure = props.headStructure;

  React.useEffect(() => {
    store.doLoad();
  }, []);

  React.useEffect(() => {
    const date_start = params.get("date_start");
    const date_end = params.get("date_end");
    const service_ids = params.get("service_ids");
    const tag_ids = params.get("tag_ids");
    const status_code = params.get("status_code");

    if (date_start) {
      store.map_date_start = dayjs(date_start);
    }
    if (date_end) {
      store.map_date_end = dayjs(date_end);
    }
    if (service_ids) {
      store.map_service_ids = service_ids.split(",").map(Number);
    }
    if (tag_ids) {
      store.tag_ids = tag_ids.split(",").map(Number);
    }
    if (status_code) {
      const status = store.Statuses.find(s => s.code === status_code);
      if (status) store.map_status_id = status.id;
    }

    store.loadApplications();
  }, [params]);

  return (
    <Box>
      <Grid container spacing={2} sx={{mt: 1}}>
        <Grid item md={3} xs={12}>
          <MtmLookup
            value={store.map_service_ids}
            onChange={(name, value) => store.changeServices(value)}
            name="map_service_ids"
            disabled={true}
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
            disabled={true}
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
            onChange={(name, value) => {}}
            name="tag_ids"
            disabled={true}
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
            disabled={true}
            id="map_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <DateField
            value={store.map_date_end}
            onChange={(event) => store.changeApplications(event)}
            name="map_date_end"
            disabled={true}
            id="id_f_date_start"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>
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
            </Marker>;
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </Box>
  );
});


export default MapView;