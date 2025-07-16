import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container, 
  Box,
  IconButton,
  Typography
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth={false} sx={{ mt: 2 }}>
        <form id="ArchiveObjectForm" autoComplete="off">
          {/* Информация об исходном объекте */}
          <Paper elevation={7} sx={{ mb: 3 }}>
            <Card>
              <CardHeader 
                title={
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <span>Исходный объект</span>
                  </Box>
                } 
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      id="id_f_ArchiveObject_original_doc_number"
                      label="Номер документа исходного объекта"
                      value={store.doc_number}
                      onChange={() =>{}}
                      disabled
                      name="original_doc_number"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      id="id_f_ArchiveObject_original_address"
                      label="Адрес исходного объекта"
                      value={store.address}
                      disabled
                      onChange={() =>{}}
                      name="original_address"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>

          {/* Заголовок с кнопкой добавления */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Новые объекты после разделения ({store.divisionObjects.length})
            </Typography>
            <IconButton
              color="primary"
              onClick={store.addDivisionObject}
              size="large"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Карточки для новых объектов */}
          {store.divisionObjects.map((divisionObj, index) => (
            <Paper elevation={7} key={index} sx={{ mb: 2 }}>
              <Card>
                <CardHeader 
                  title={
                    <Box display={"flex"} justifyContent={"space-between"} alignItems="center">
                      <span>Объект #{index + 1}</span>
                      {store.divisionObjects.length > 2 && (
                        <IconButton
                          color="error"
                          onClick={() => store.removeDivisionObject(index)}
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Box>
                  } 
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <CustomTextField
                        helperText={divisionObj.errordoc_number}
                        error={divisionObj.errordoc_number !== ""}
                        id={`id_f_ArchiveObject_doc_number_${index}`}
                        label="Номер документа нового объекта"
                        value={divisionObj.doc_number}
                        onChange={(event) => store.handleDivisionChange(index, event)}
                        name="doc_number"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <CustomTextField
                        helperText={divisionObj.erroraddress}
                        error={divisionObj.erroraddress !== ""}
                        id={`id_f_ArchiveObject_address_${index}`}
                        label="Адрес нового объекта"
                        value={divisionObj.address}
                        onChange={(event) => store.handleDivisionChange(index, event)}
                        name="address"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Paper>
          ))}
        </form>
        {props.children}
      </Container>
    </>
  );
});

export default BaseView;