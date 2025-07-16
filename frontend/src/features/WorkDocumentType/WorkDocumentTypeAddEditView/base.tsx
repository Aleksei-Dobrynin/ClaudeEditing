import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import LookUp from "../../../components/LookUp";
import CustomButton from "../../../components/Button";
import CustomCheckbox from "../../../components/Checkbox";
import DateTimeField from "../../../components/DateTimeField";
import dayjs from "dayjs";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth="xl" style={{ marginTop: 20 }}>
      <Grid container>

        <form id="WorkDocumentTypeForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="WorkDocumentType_TitleName">
                  {translate("label:WorkDocumentTypeAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname != ""}
                      id="id_f_WorkDocumentType_name"
                      label={translate("label:WorkDocumentTypeAddEditView.name")}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode != ""}
                      id="id_f_WorkDocumentType_code"
                      label={translate("label:WorkDocumentTypeAddEditView.code")}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ""}
                      id="id_f_WorkDocumentType_description"
                      label={translate("label:WorkDocumentTypeAddEditView.description")}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  {store.metadata.length > 0 && <Grid item md={12} xs={12}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>{translate("label:WorkDocumentTypeAddEditView.id")}</TableCell>
                            <TableCell>{translate("label:WorkDocumentTypeAddEditView.type")}</TableCell>
                            <TableCell>{translate("label:WorkDocumentTypeAddEditView.label")}</TableCell>
                            <TableCell>{translate("label:WorkDocumentTypeAddEditView.value")}</TableCell>
                            <TableCell>{translate("label:WorkDocumentTypeAddEditView.action")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {store.metadata?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{translate(`label:WorkDocumentTypeAddEditView.${item.type}`)}</TableCell>
                              <TableCell>{item.label}</TableCell>
                              <TableCell>{item.value}</TableCell>
                              <TableCell>
                                <CustomButton
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => store.removeMetadataItem(item.id)}
                                >
                                  {translate("common:delete")}
                                </CustomButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>}
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.type_id}
                      onChange={(event) => store.handleChangeMetadata(event)}
                      name="type_id"
                      data={store.typesValue}
                      id="type_id"
                      label={translate("label:WorkDocumentTypeAddEditView.type_id")}
                      helperText={""}
                      error={false}
                    />
                  </Grid>
                  {store.type_id !== 0 && <Grid item md={3} xs={3}>
                    <CustomTextField
                      helperText={""}
                      error={false}
                      id="id_f_WorkDocumentType_label"
                      label={translate("label:WorkDocumentTypeAddEditView.label")}
                      value={store.label}
                      onChange={(event) => store.handleChangeMetadata(event)}
                      name="label"
                    />
                  </Grid>}
                  {store.type_id !== 0 && (() => {
                    const selectedType = store.typesValue.find(t => t.id == store.type_id);
                    switch (selectedType?.code) {
                      case "text":
                        return (
                          <Grid item md={7} xs={7}>
                            <CustomTextField
                              helperText={""}
                              error={false}
                              id="id_f_WorkDocumentvalue_value"
                              label={translate("label:WorkDocumentTypeAddEditView.value")}
                              value={store.value}
                              onChange={(event) => store.handleChangeMetadata(event)}
                              name="value"
                            />
                          </Grid>
                        );
                      case "boolean":
                        return (
                          <Grid item md={7} xs={7}>
                            <CustomCheckbox
                              onChange={(event) => store.handleChangeMetadata(event)}
                              name="value"
                              id="id_f_WorkDocumentvalue_value"
                              value={store.value}
                              label={translate("label:WorkDocumentTypeAddEditView.value")}
                            />
                          </Grid>
                        );
                      case "datetime":
                        return (
                          <Grid item md={7} xs={7}>
                            <DateTimeField
                              onChange={(event) => store.handleChangeMetadata(event)}
                              name="value"
                              id="id_f_WorkDocumentvalue_value"
                              value={store.value}
                              label={translate("label:WorkDocumentTypeAddEditView.value")}
                              helperText=""
                              error={false}
                            />
                          </Grid>
                        );
                      case "lookup":
                        return (
                          <>
                            <Grid item md={2} xs={2}>
                              <LookUp
                                value={store.value}
                                onChange={(event) => store.handleChangeMetadata(event)}
                                name="value"
                                id="id_f_WorkDocumentvalue_value"
                                fieldNameDisplay={(field) => field[`label`]}
                                data={store.lookupValues || []}
                                label={translate("label:WorkDocumentTypeAddEditView.value")}
                                helperText=""
                                error={false}
                              />
                            </Grid>
                            <Grid item md={3} xs={3}>
                              <CustomTextField
                                helperText=""
                                error={false}
                                id="id_f_WorkDocumentvalue_new_lookup"
                                label={translate("label:WorkDocumentTypeAddEditView.newLookupValue")}
                                value={store.newLookupValue}
                                onChange={(event) => store.handleChangeMetadata(event)}
                                name="newLookupValue"
                              />
                            </Grid>
                            <Grid item md={2} xs={2}>
                              <CustomButton
                                variant="contained"
                                id="id_AddLookupValueButton"
                                onClick={() => store.addLookupValue()}
                              >
                                {translate("Добавить значение")}
                              </CustomButton>
                            </Grid>
                          </>
                        );
                      case "geometry":
                        return (
                          <Grid item md={7} xs={7}>
                          </Grid>);
                      default:
                        return (
                          <Grid item md={7} xs={7}>
                          </Grid>);
                    }
                  })()}
                  {store.type_id !== 0 && <Grid item md={2} xs={2}>
                    <CustomButton
                      variant="contained"
                      id="id_WorkDocumentTypeCancelButton"
                      onClick={() => store.handleSave()}
                    >
                      {translate("common:add")}
                    </CustomButton>
                  </Grid>}
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
});


export default BaseView;
