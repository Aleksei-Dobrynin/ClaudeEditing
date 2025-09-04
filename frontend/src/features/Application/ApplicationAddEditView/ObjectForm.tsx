import React, { FC, useEffect, useRef } from "react";
import { Box, CircularProgress, Grid, IconButton, Paper, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./storeObject";
import applicationStore from "./store";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
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
import CustomButton from "components/Button";
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField";
import CustomCheckbox from "components/Checkbox";

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
            {store.arch_objects.map((obj, i) => {
              const streetState = store.getTundukStreetState(i);

              return (<Grid item md={6} xs={12} sx={{ mb: 1 }}>
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
                      <Autocomplete
                        key={obj.tunduk_district_id}
                        value={store.TundukDistricts.find(x => x.id == obj.tunduk_district_id) || null}
                        disabled={applicationStore.is_application_read_only}
                        onChange={(event, newValue) => {
                          runInAction(() => {
                            // Используем новый метод для обработки изменения района
                            store.handleTundukDistrictChange(i, newValue?.id ?? 0);

                            // Сбрасываем микрорайон и улицу при изменении района
                            store.handleChange({ target: { name: "tunduk_address_unit_id", value: 0 } }, i);
                            store.handleChange({ target: { name: "tunduk_street_id", value: 0 } }, i);
                          const district = store.Districts.find(
                            x => x.address_unit_id === obj.tunduk_district_id);
                          store.handleChange({ target: { name: "district_id", value: district?.id ?? 0 } }, i);

                            // Сбрасываем состояние поиска улиц
                            store.handleTundukStreetChange(i, null, i);
                            store.clearTundukStreetState(i);
                            store.initTundukStreetState(i);

                            if (newValue?.id) {
                              // Загружаем микрорайоны для выбранного района
                              store.loadAteChildrens(newValue.id);
                            } else {
                              store.TundukResidentialAreas = [];
                            }
                          });
                        }}
                        getOptionLabel={(x) => x.name || ""}
                        options={store.TundukDistricts}
                        id="id_f_tunduk_district_id"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate("label:ArchObjectAddEditView.tunduk_district_id")}
                            helperText={obj.errortunduk_district_id}
                            error={!!obj.errortunduk_district_id}
                            size={"small"}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Autocomplete
                        key={obj.tunduk_address_unit_id}
                        value={store.TundukResidentialAreas.find(x => x.id == obj.tunduk_address_unit_id) || null}
                        disabled={applicationStore.is_application_read_only}
                        onChange={(event, newValue) => {
                          store.handleChange({ target: { name: "tunduk_address_unit_id", value: newValue?.id ?? 0 } }, i);
                          store.handleChange({ target: { name: "tunduk_street_id", value: 0 } }, i);

                          // Сбрасываем состояние поиска улиц при изменении микрорайона
                          store.handleTundukStreetChange(i, null, i);
                          store.clearTundukStreetState(i);
                          store.initTundukStreetState(i);
                        }}
                        getOptionLabel={(x) => x.name || ""}
                        options={store.TundukResidentialAreas}
                        id="id_f_tunduk_address_unit_id"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate("label:ArchObjectAddEditView.tunduk_address_unit_id")}
                            helperText={obj.errortunduk_address_unit_id}
                            error={!!obj.errortunduk_address_unit_id}
                            size={"small"}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Autocomplete
                        key={`${obj.tunduk_street_id}_${obj.tunduk_district_id}_${obj.tunduk_address_unit_id}`}
                        value={store.getTundukStreetState(i).selectedStreet}
                        inputValue={store.getTundukStreetState(i).inputValue}
                        disabled={applicationStore.is_application_read_only}
                        open={store.getTundukStreetState(i).isOpen}
                        onOpen={() => store.handleTundukStreetOpen(i)}
                        onClose={() => store.handleTundukStreetClose(i)}
                        onChange={(event, newValue) => {
                          store.handleTundukStreetChangeWithDistrictUpdate(i, newValue);
                        }}
                        onInputChange={(event, newInputValue, reason) => {
                          store.handleTundukStreetInputChange(i, newInputValue, reason, i);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        getOptionLabel={(x) => {
                          if (!x) return '';
                          if (typeof x === 'string') return x;
                          return (x.name || "") + ' (' + x.address_unit_name + ')';
                        }}
                        renderOption={(props, option) =>
                          <Box component="li" {...props}>
                            {(option.name || "") + ' (' + option.address_unit_name + ')'}
                          </Box>
                        }
                        options={store.getTundukStreetState(i).searchResults}
                        loading={store.getTundukStreetState(i).isLoading}
                        loadingText="Загрузка..."
                        noOptionsText={
                          (store.getTundukStreetState(i)?.inputValue?.length ?? 0) < 2
                            ? "Введите минимум 2 символа для поиска"
                            : "Ничего не найдено"
                        }
                        id="id_f_tunduk_str_id"
                        renderInput={(params) => {
                          const streetState = store.getTundukStreetState(i);
                          const selectedValue = streetState.selectedStreet;

                          if (selectedValue && params.inputProps.value) {
                            params.inputProps.value = (selectedValue.name || "") + ' (' + selectedValue.address_unit_name + ')';
                          }

                          return (
                            <TextField
                              {...params}
                              autoComplete="new-password"
                              label={translate("label:ArchObjectAddEditView.tunduk_street_id")}
                              helperText={
                                obj.errortunduk_street_id ||
                                (streetState.inputValue && streetState.inputValue.length > 0 && streetState.inputValue.length < 2
                                  ? "Минимум 2 символа"
                                  : "")
                              }
                              error={!!obj.errortunduk_street_id}
                              size={"small"}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {streetState.isLoading ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          );
                        }}
                      />
                    </Grid>
                    <input
                      type="hidden"
                      name={`district_id_${i}`}
                      value={obj.district_id || 6}
                    />
                    <Grid item xs={4}>
                      <CustomTextField
                        label="№ здания"
                        disabled={applicationStore.is_application_read_only}
                        value={obj.tunduk_building_num}
                        onChange={(e) => (obj.tunduk_building_num = e.target.value)}
                        id="id_f_building_number"
                        name="building_number"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="№ квартиры"
                        disabled={applicationStore.is_application_read_only}
                        value={obj.tunduk_flat_num}
                        onChange={(e) => (obj.tunduk_flat_num = e.target.value)}
                        id="id_f_apartment_number"
                        name="apartment_number"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="№ участка"
                        disabled={applicationStore.is_application_read_only}
                        value={obj.tunduk_uch_num}
                        onChange={(e) => (obj.tunduk_uch_num = e.target.value)}
                        id="id_f_uch_number"
                        name="uch_number"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomButton
                        variant="contained"
                        onClick={() => {
                          store.SearchResults = [];
                          store.findAddresses(i);
                          obj.tunduk_building_id = null;
                          store.handleChange({ target: { value: true, name: "open" } }, i)
                        }}>
                        Найти адрес
                      </CustomButton>
                    </Grid>

                    <Grid item xs={6}>
                      <CustomButton
                        variant="contained"
                        onClick={() => {
                          store.handleChange({ target: { name: "tunduk_district_id", value: 0 } }, i);
                          store.handleChange({ target: { name: "tunduk_address_unit_id", value: 0 } }, i);
                          store.handleChange({ target: { name: "tunduk_street_id", value: 0 } }, i);
                          store.handleChange({ target: { name: "district_id", value: 0 } }, i);
                          store.handleTundukStreetChange(i, null, i);
                          store.clearTundukStreetState(i);
                          store.initTundukStreetState(i);
                          store.handleChange({ target: { name: "tunduk_building_id", value: 0 } }, i);
                          obj.tunduk_building_num = '';
                          obj.tunduk_flat_num = '';
                          obj.tunduk_uch_num = '';
                          store.SearchResults = [];
                          store.TundukResidentialAreas = [];
                          store.handleChange({ target: { value: false, name: "open" } }, i)
                        }}>
                        Очистить
                      </CustomButton>
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        key={obj.tunduk_building_id}
                        value={store.SearchResults.find(x => x.id == obj.tunduk_building_id)}
                        open={obj.open}
                        onOpen={() => {
                          store.handleChange({ target: { value: true, name: "open" } }, i)
                        }}
                        onClose={() => {
                          store.handleChange({ target: { value: false, name: "open" } }, i)
                        }}
                        disabled={applicationStore.is_application_read_only}
                        onChange={(event, newValue) => {
                          if (!newValue) {
                            store.handleChange({ target: { value: '', name: "address" } }, i)
                            return;
                          }
                          store.handleChange(event, i);
                          let address = store.SearchResults.find(x => x.id == newValue.id);
                          obj.identifier = address?.code;
                          if (address?.address) {
                            store.handleChange({ target: { value: address?.address, name: "address" } }, i)
                          }
                          store.handleChange({ target: { value: [], name: "DarekSearchList" } }, i)
                          store.searchFromDarek(address?.code ?? "", i);
                        }}
                        getOptionLabel={(x) => x.address || ""}
                        options={store.SearchResults}
                        id="id_f_tunduk_building_id"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            autoComplete="new-password"
                            label={translate("label:ArchObjectAddEditView.tunduk_building_id")}
                            helperText={obj.errortunduk_building_id}
                            error={!!obj.errortunduk_building_id}
                            size={"small"}
                          />
                        )}
                        blurOnSelect={true}
                        disableCloseOnSelect={false}
                        clearOnBlur={false}
                        handleHomeEndKeys={false}
                        PaperComponent={({ children, ...props }) => (
                          <Paper
                            {...props}
                            elevation={8}
                            sx={{
                              border: '2px solid',
                              borderColor: 'primary.main',
                              mt: 1,
                            }}
                          >
                            {children}
                          </Paper>
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{
                              padding: '12px 16px !important',
                              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                              '&:last-child': {
                                borderBottom: 'none',
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                              },
                              '&[aria-selected="true"]': {
                                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                fontWeight: 'bold',
                              },
                            }}
                          >
                            {option.address}
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid item md={12} xs={12}>

                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={store.legalRecords ? 11 : 12}>
                          <GisSearch
                            id="id_f_ArchObject_address"
                            index={i}
                            disabled={applicationStore.is_application_read_only || !obj.is_manual}
                            label={translate("label:ArchObjectAddEditView.address")}
                            autocomplete={true}
                            onBlur={() => store.setBadgeConst(i)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          {((obj.legalActs && obj.legalActs.length > 0) || (obj.legalRecords && obj.legalRecords.length > 0)) && (
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
                      <CustomCheckbox
                        value={obj.is_manual}
                        disabled={applicationStore.is_application_read_only}
                        onChange={(event) => {
                          store.handleChange({ target: { name: "is_manual", value: event.target.value } }, i);
                        }}
                        name="id_f_is_manual"
                        label={"Ручной ввод"}
                        id="id_f_is_manual"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>);
            })}

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