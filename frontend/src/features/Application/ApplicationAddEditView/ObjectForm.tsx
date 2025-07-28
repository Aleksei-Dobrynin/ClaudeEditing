import React, { FC, useEffect, useRef } from "react";
import { Box, CircularProgress, Grid, IconButton, Paper, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./storeObject";
import applicationStore from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import { MapContainer, Marker, Polygon, Popup, TileLayer, LayersControl } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import MaskedAutocomplete from "../../../components/MaskedAutocomplete";
import GisSearch from "./2gisSearch";
import MtmLookup from "components/mtmLookup";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import PopupApplicationStore from "../PopupAplicationListView/store";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BadgeButton from "../../../components/BadgeButton";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const { BaseLayer } = LayersControl;

const ObjectFormView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
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

  useEffect(() => {
    if (store.ycoordinate && store.xcoordinate && mapRef.current) {
      const point = store.point = [store.xcoordinate, store.ycoordinate];
      mapRef.current.setView(point, 15, { animate: true });
    }
  }, [store.xcoordinate, store.ycoordinate]);

  return (
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
          {store.arch_objects.map((obj, i) => obj.geometry?.length > 0 && <Polygon positions={obj.geometry} color="blue">
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
                    {obj.addressInfo?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.address}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item?.propcode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Popup>
          </Polygon>)}


          {store.arch_objects.map((obj, i) => obj.xcoordinate !== null && obj.ycoordinate !== null
            && obj.xcoordinate !== 0 && obj.ycoordinate !== 0 && <Marker position={[obj.xcoordinate, obj.ycoordinate]}>
              <Popup>
                <div>
                  <strong>Адрес:</strong> {obj.address}
                </div>
              </Popup>
            </Marker>)}
        </MapContainer>
        <Box>
          {(() => {
            let obj = store.arch_objects[store.arch_objects.length - 1];
            return (
              <>
                {obj?.xcoordinate !== 0 && obj?.ycoordinate !== 0 &&
                  <a
                    style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                    target="_blank"
                    href={`https://2gis.kg/bishkek/geo/${obj?.ycoordinate}%2C${obj?.xcoordinate}?m=${obj?.ycoordinate}%2C${obj?.xcoordinate}%2F14.6`}>
                    {translate("common:openIn2GIS")}
                  </a>}
                {obj?.identifier == null && obj?.identifier?.length !== 0 &&
                  <a
                    style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                    target="_blank"
                    href={`/user/DarekView?eni=${obj?.identifier}`}>
                    {translate("common:openInDarekOnEni")}
                  </a>}
                {obj?.xcoordinate !== 0 && obj?.ycoordinate !== 0 &&
                  <a
                    style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                    target="_blank"
                    href={`/user/DarekView?coordinate=${obj?.xcoordinate},${obj?.ycoordinate}`}>
                    {translate("common:openInDarekOnLatLng")}
                  </a>}
              </>
            );
          })()}
        </Box>
      </Grid>
      <Grid item md={6}>
        <Box display={"flex"}>
          <Grid container spacing={2}>
            {store.arch_objects.map((obj, i) => <Grid item md={6} xs={12} sx={{ mb: 1 }}>
              <Paper elevation={1} sx={{ p: 2 }}>

                <Grid container spacing={1}>
                  <Grid item md={12} xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <div style={{ maxHeight: 30, minHeight: 30 }}>Адрес {i + 1}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}> {store.arch_objects[i] && store.arch_objects[i].address ? (
                      <BadgeButton
                        circular={<CircularProgress sx={{ display: "block" }} size="20px" />}
                        stateCircular={store.loading[i]}
                        count={store.counts[i]}
                        icon={<ContentPasteSearchIcon sx={{ color: "#FF652F" }} />}
                        onClick={() => {
                          PopupApplicationStore.handleChange({ target: { name: "openCustomerApplicationDialog", value: !PopupApplicationStore.openCustomerApplicationDialog } })
                          PopupApplicationStore.handleChange({ target: { name: "common_filter", value: store.arch_objects[i].address } }, "filter")
                          PopupApplicationStore.handleChange({ target: { name: "only_count", value: false } }, "filter")
                        }} />
                    ) : null}
                      {i === 0 ? <></> : <Tooltip title={"Удалить"}>
                        <IconButton sx={{ maxHeight: 30 }} size="small" onClick={() => store.deleteAddress(i)}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>}
                    </div>

                  </Grid>
                  <Grid item md={12} xs={12}>
                    <MaskedAutocomplete
                      data={obj.DarekSearchList ?? []}
                      disabled={applicationStore.is_application_read_only}
                      value={obj.identifier}
                      label={translate("label:ArchObjectAddEditView.identifier")}
                      name="darek_eni"
                      onChange={(newValue: any) => {
                        obj.identifier = newValue?.propcode;
                        if (newValue?.address) {
                          store.handleChange({ target: { value: newValue?.address, name: "address" } }, i)
                        }
                        store.handleChange({ target: { value: [], name: "DarekSearchList" } }, i)
                        store.searchFromDarek(newValue?.propcode ?? "", i);
                      }}
                      freeSolo={true}
                      fieldNameDisplay={(option) => option?.propcode}
                      onInputChange={(event, value) => {
                        // store.identifier = '';
                        const propCode = value?.replaceAll('-', '')
                        if (value.length > 12 && obj.identifier !== value && propCode !== obj.identifier) {
                          obj.identifier = value;
                          store.getSearchListFromDarek(value, i);
                        }
                      }}
                      mask="0-00-00-0000-0000-00-000"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>

                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={ store.legalRecords ? 11 : 12}>
                        <GisSearch
                          id="id_f_ArchObject_address"
                          index={i}
                          disabled={applicationStore.is_application_read_only}
                          label={translate("label:ArchObjectAddEditView.address")}
                          autocomplete={true}
                          onBlur={() => store.setBadgeConst(i)}
                        />
                      </Grid>
                      {
                        <Grid item xs={12} sm={ store.legalRecords ? 11 : 12}>
                          <CustomTextField
                            value={store.arch_objects[i]?.street || ""}
                            onChange={(event) => {}}
                            name="street"
                            id="id_f_arch_object_street"
                            data-testid="id_f_arch_object_street"
                            label={translate("label:ArchObjectAddEditView.street")}
                            disabled={applicationStore.is_application_read_only}
                          />
                        </Grid>
                      }
                      {
                        <Grid item xs={12} sm={ store.legalRecords ? 11 : 12}>
                          <CustomTextField
                            value={store.arch_objects[i]?.house || ""}
                            onChange={(event) => {}}
                            name="house"
                            id="id_f_arch_object_house"
                            data-testid="id_f_arch_object_house"
                            label={translate("label:ArchObjectAddEditView.house")}
                            disabled={applicationStore.is_application_read_only}
                          />
                        </Grid>
                      }
                      {
                        <Grid item xs={12} sm={ store.legalRecords ? 11 : 12}>
                          <CustomTextField
                            value={store.arch_objects[i]?.apartment || ""}
                            onChange={(event) => {}}
                            name="apartment"
                            id="id_f_arch_object_apartment"
                            data-testid="id_f_arch_object_apartment"
                            label={translate("label:ArchObjectAddEditView.apartment")}
                            disabled={applicationStore.is_application_read_only}
                          />
                        </Grid>
                      }
                      <Grid item xs={12} sm={1}>
                        {((obj.legalActs && obj.legalActs.length > 0) || (obj.legalRecords &&obj.legalRecords.length > 0))  && (
                          <Tooltip title={"Адрес фигурирует в правовой записи"}>
                            <IconButton
                              sx={{ maxHeight: 30 }}
                              size="small"
                              onClick={() => { }}
                            >
                              <ErrorOutlineIcon fontSize="small" sx={{ color: "#FF652F" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={obj.district_id}
                      disabled={applicationStore.is_application_read_only}
                      onChange={(event) => store.handleChange(event, i)}
                      name="district_id"
                      data={store.Districts}
                      id="id_f_district_id"
                      label={translate("label:ArchObjectAddEditView.district_id")}
                      helperText={obj.errordistrict_id}
                      error={!!obj.errordistrict_id}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>)}

            <Grid item md={12} xs={12}>
              <CustomTextField
                helperText={""}
                disabled={applicationStore.is_application_read_only}
                error={false}
                id="id_f_ArchObject_description"
                label={translate("label:ArchObjectAddEditView.description")}
                value={store.description}
                onChange={(event) => store.handleChangeField(event)}
                name="description"
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <MtmLookup
                disabled={applicationStore.is_application_read_only}
                value={store.tags}
                onChange={(name, value) => store.changeTags(value)}
                name="tags"
                data={store.Tags}
                label={translate("label:arch_object_tagAddEditView.tags")}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <LookUp
                value={applicationStore.object_tag_id}
                disabled={applicationStore.is_application_read_only}
                onChange={(event) => applicationStore.handleChange(event)}
                name="object_tag_id"
                data={applicationStore.ObjectTags}
                id="object_tag_id"
                label={translate("Тип объекта")}
                helperText={applicationStore.errorobject_tag_id}
                error={!!applicationStore.errorobject_tag_id}
              />
            </Grid>
          </Grid>
          <Box sx={{ ml: 1, mt: 10 }}>
            <Tooltip title={"Новый адрес"}>
              <IconButton
                disabled={applicationStore.is_application_read_only}
                onClick={() => store.newAddressClicked()}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
});


export default ObjectFormView;
