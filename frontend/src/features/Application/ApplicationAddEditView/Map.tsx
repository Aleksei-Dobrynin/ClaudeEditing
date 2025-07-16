import React, { FC, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  CardHeader,
  Divider
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./storeObject";
import applicationStore from "./store"
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomTextField from "components/TextField";
import CustomCheckbox from "../../../components/Checkbox";
import DateField from "components/DateField";
import dayjs from "dayjs";
import AutocompleteCustomer from "./AutocompleteCustomer";
import CloseIcon from '@mui/icons-material/Close';
import FastInputView from "./fastInput";
import { MapContainer, TileLayer, Polygon, Popup, Marker, LayersControl } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import MaskedAutocomplete from "../../../components/MaskedAutocomplete";
import GisSearch from "./2gisSearch";
import MtmLookup from "components/mtmLookup";

type MapViewProps = {
  geometry: [];
  point: any[];
  addressInfo: any[];
  xcoordinate: number;
  ycoordinate: number;
};

const { BaseLayer } = LayersControl;

const MapView: FC<MapViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const mapRef = useRef(null);

  // useEffect(() => {
  //   if (props.geometry?.length > 0 && mapRef.current) {
  //     const map = mapRef.current;
  //     const bounds = props.geometry;
  //     map.fitBounds(bounds);
  //   }
  //   if (props.point?.length > 0 && mapRef.current) {
  //     const point = props.point;
  //     mapRef.current.setView(point, mapRef.current.getZoom());
  //   }
  // }, [props.geometry, props.point]);

  // useEffect(() => {
  //   if (props.ycoordinate && props.xcoordinate && mapRef.current) {
  //     const point = [props.xcoordinate, props.ycoordinate];
  //     mapRef.current.setView(point, 15, { animate: true });
  //   }
  // }, [props.xcoordinate, props.ycoordinate]);


  return (
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
      {props.geometry?.length > 0 && (
        <Polygon positions={props.geometry} color="blue">
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
                  {props.addressInfo?.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.address}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item?.propcode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Popup>
          
        </Polygon>
      )}
      {props.point?.length > 0 && props.point[0] !== 0 && props.point[1] !== 0 && (
        <Marker position={props.point as LatLngExpression}>
          <Popup>
            <div>
              <strong>Точка:</strong> {props.point?.join(', ')}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
});


export default MapView;
