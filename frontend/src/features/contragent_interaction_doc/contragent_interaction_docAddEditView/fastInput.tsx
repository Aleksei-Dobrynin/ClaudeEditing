import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, Box, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../contragent_interaction_docListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";
import FileField from "components/FileField";
import DownloadIcon from "@mui/icons-material/Download";

type contragent_interaction_docProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const ContragentInteractionFastInputView: FC<contragent_interaction_docProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      store.handleChange({ target: { value: props.idMain, name: "interaction_id" } })
      storeList.loadcontragent_interaction_docs();
    }
    return () => {
      store.clearStore()
      storeList.clearStore()
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'file_name',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interaction_docListView.file_id"),
    },
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="contragent_interaction_doc_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:contragent_interaction_docAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            <Grid item xs={1}></Grid>
          </Grid>
          <Divider />

          {storeList.data.map((entity) => {
            const style = { backgroundColor: entity.id === store.id && "#F0F0F0" };
            return (
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={style}
                  spacing={1}
                  id="id_EmployeeContact_row"
                >
                  {columns.map((col) => {
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}

                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    <Tooltip title={translate("downloadFile")}>
                      <IconButton size="small" onClick={() => storeList.downloadFile(entity.file_id, entity.file_name)}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>

                  </Grid>

                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <IconButton
                        id="id_EmployeeContactDeleteButton"
                        name="delete_button"
                        style={{ margin: 0, padding: 0 }}
                        onClick={() => storeList.deletecontragent_interaction_doc(entity.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
                <Divider />
              </>
            );
          })}

          {storeList.isEdit ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>

              <Grid item md={12} xs={12}>
                <FileField
                  value={store.fileName}
                  helperText={store.errors.fileName}
                  error={!!store.errors.fileName}
                  inputKey={store.idDocumentinputKey}
                  fieldName="fileName"
                  onChange={(event) => {
                    if (event.target.files.length == 0) return
                    store.handleChange({ target: { value: event.target.files[0], name: "File" } })
                    store.handleChange({ target: { value: event.target.files[0].name, name: "fileName" } })
                  }}
                  onClear={() => {
                    store.handleChange({ target: { value: null, name: "File" } })
                    store.handleChange({ target: { value: '', name: "fileName" } })
                    store.changeDocInputKey()
                  }}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_contragent_interaction_docSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadcontragent_interaction_docs();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_contragent_interaction_docCancelButton"
                  onClick={() => {
                    storeList.setFastInputIsEdit(false);
                    store.clearStore();
                  }}
                >
                  {translate("common:cancel")}
                </CustomButton>
              </Grid>
            </Grid>
          ) : (
            <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_contragent_interaction_docAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  store.interaction_id = props.idMain;
                }}
              >
                {translate("common:add")}
              </CustomButton>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
});

export default ContragentInteractionFastInputView;
