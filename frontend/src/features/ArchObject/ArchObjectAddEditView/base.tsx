import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import MtmLookup from "components/mtmLookup";
import { MapContainer, TileLayer, Polygon, Popup, Marker, LayersControl } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import MapsView from "./maps";
import CustomButton from "../../../components/Button";
import { Map2Gis } from "./2gis"
import MaskedTextField from "../../../components/MaskedTextField";
import MaskedAutocomplete from "../../../components/MaskedAutocomplete";
import axios from "axios";
import GisSearch from "./2gisSearch";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const { BaseLayer } = LayersControl;

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const mapRef = useRef(null);

  useEffect(() => {
    if (store.geometry.length > 0 && mapRef.current) {
      const map = mapRef.current;
      const bounds = store.geometry;
      map.fitBounds(bounds);
    }
    if (store.point.length > 0 && mapRef.current) {
      const point = store.point;
      mapRef.current.setView(point, mapRef.current.getZoom());
    }
  }, [store.geometry, store.point]);

  return (

    <>
      <form id="ArchObjectForm" autoComplete="off">
          <Card>
            <CardHeader title={
              <span id="ArchObject_TitleName">
                {translate("label:ArchObjectAddEditView.entityTitle")}
              </span>
            } />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6}>
                    <MapContainer
                      ref={mapRef}
                      center={[42.87, 74.60] as LatLngExpression}
                      zoom={11}
                      style={{ height: "450px", width: "100%" }}>
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
                      {store.geometry.length > 0 && (
                        <Polygon positions={store.geometry} color="blue">
                          <Popup>
                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                              <table style={{ width: "auto", borderCollapse: "collapse" }}>
                                <thead>
                                  <tr>
                                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Адрес</th>
                                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Код ЕНИ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {store.addressInfo.map((item, index) => (
                                    <tr key={index}>
                                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.address}</td>
                                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.propcode}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Popup>
                        </Polygon>
                      )}
                      {store.point.length > 0 && (
                        <Marker position={store.point as LatLngExpression}>
                          <Popup>
                            <div>
                              <strong>Точка:</strong> {store.point.join(', ')}
                            </div>
                          </Popup>
                        </Marker>
                      )}
                    </MapContainer>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <MaskedAutocomplete
                        data={store.DarekSearchList}
                        value={store.darek_eni}
                        label={translate("label:ArchObjectAddEditView.identifier")}
                        name="darek_eni"
                        onChange={(newValue: any) => {
                          store.darek_eni = newValue.propcode;
                          store.address = newValue.address;
                          store.identifier = newValue.propcode;
                          store.searchFromDarek(newValue.propcode);
                        }}
                        freeSolo={true}
                        fieldNameDisplay={(option) => option.propcode}
                        onInputChange={(event, value) => {
                          store.darek_eni = '';
                          store.identifier = value;
                          if(value.length > 12)
                          {
                            store.getSearchListFromDarek(value);
                          }
                        }}
                        mask="0-00-00-0000-0000-00-000"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <GisSearch
                        id="id_f_ArchObject_address"
                        label={translate("label:ArchObjectAddEditView.address")}
                        multiline={true}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        helperText={store.errorname}
                        error={store.errorname != ""}
                        id="id_f_ArchObject_name"
                        label={translate("label:ArchObjectAddEditView.name")}
                        value={store.name}
                        onChange={(event) => store.handleChange(event)}
                        name="name"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <LookUp
                        value={store.district_id}
                        onChange={(event) => store.handleChange(event)}
                        name="district_id"
                        data={store.Districts}
                        id="id_f_district_id"
                        label={translate("label:ArchObjectAddEditView.district_id")}
                        helperText={store.errordistrict_id}
                        error={!!store.errordistrict_id}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        multiline={true}
                        helperText={store.errordescription}
                        error={store.errordescription != ""}
                        id="id_f_ArchObject_description"
                        label={translate("label:ArchObjectAddEditView.description")}
                        value={store.description}
                        onChange={(event) => store.handleChange(event)}
                        name="description"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <MtmLookup
                        value={store.id_tags}
                        onChange={(name, value) => store.changeTags(value)}
                        name="tags"
                        data={store.Tags}
                        label={translate("label:arch_object_tagAddEditView.tags")}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
      </form>
      {props.children}
    </>
  );
});

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default BaseView;
