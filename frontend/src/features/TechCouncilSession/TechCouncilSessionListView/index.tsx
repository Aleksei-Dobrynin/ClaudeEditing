import React, { FC, useEffect } from "react";
import {
  Card, CardContent,
  Container, Paper, Typography
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import TechCouncilSessionPopupForm from "./../TechCouncilSessionAddEditView/popupForm";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CustomButton from "../../../components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { API_URL } from "../../../constants/config";
import ReactPlayer from "react-player";
import DialogActions from "@mui/material/DialogActions";
import printJS from "print-js";

type TechCouncilSessionListViewProps = {
  isArchive?: boolean;
};

const TechCouncilSessionListView: FC<TechCouncilSessionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.isArchive == true) {
      store.loadTechCouncilArchiveSessions();
    } else {
      store.loadTechCouncilSessions();
    }
    return () => {
      store.clearStore();
    };
  }, [props.isArchive]);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: translate("label:TechCouncilSessionListView.date"),
      flex: 1,
      renderCell: (param) => (<div data-testid="TechCouncilSessionListView.date">
        {param.row.date ? dayjs(param.row.date).format("DD.MM.YYYY") : ""}
      </div>)
    },
    {
      field: "count_tech_council_case",
      headerName: translate("label:TechCouncilSessionListView.count_tech_council_case"),
      flex: 1
    },
    {
      field: "count_tech_council_department",
      headerName: translate("label:TechCouncilSessionListView.count_tech_council_department"),
      flex: 1
    },
    ...(props.isArchive
      ? [{
        field: "application_id",
        headerName: translate("common:view"),
        flex: 1,
        renderCell: (params) => (
          <CustomButton
            variant="contained"
            id="id_TechCouncilSaveButton"
            onClick={() => {
              store.loadTechCouncilSession(params.row.id);
              store.openDocumentView = true;
            }}
          >
            {translate("common:view")}
          </CustomButton>
        )
      }] : [])
  ];

  let type1: string = "form";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:TechCouncilSessionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTechCouncilSession(id)}
        columns={columns}
        data={store.data}
        hideAddButton={props.isArchive}
        hideActions={props.isArchive}
        tableName="TechCouncilSession" />;
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:TechCouncilSessionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTechCouncilSession(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TechCouncilSession" />;
      break;
  }


  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      {component}

      <TechCouncilSessionPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadTechCouncilSessions();
        }}
      />

      <Dialog
        open={store.openDocumentView}
        onClose={() => store.onCloseDocument()}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => store.onCloseDocument()}
            sx={{
              position: "absolute",
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <Box>
                  <Paper elevation={7} variant="outlined" sx={{ mb: 2 }}>
                    <Card>
                      <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: store.document ?? "" }} />
                        <br />
                        <br />
                      </CardContent>
                    </Card>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <CustomButton
            onClick={() => printJS({
              printable: store.document,
              type: "raw-html",
              targetStyles: ["*"]
            })}
            variant="contained"
          >
            {translate("print")}
          </CustomButton>
          <CustomButton
            onClick={() => store.onCloseDocument()}
            variant="contained"
          >
            {translate("close")}
          </CustomButton>
        </DialogActions>
      </Dialog>

    </Container>
  );
});


export default TechCouncilSessionListView;
