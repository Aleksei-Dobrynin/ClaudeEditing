import React, { FC, useEffect } from "react";
import { Container, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { Box, Paper, Card, InputBase, IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import CommmentItem from "./commentItem";
import { Padding } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import AutocompleteCustom from "../../../components/Autocomplete";
import MtmLookup from "../../../components/mtmLookup";
import LookUp from "../../../components/LookUp";
import { SelectOrgStructureForWorklofw } from "../../../constants/constant";
import dayjs from "dayjs";
type ApplicationDocumentListViewProps = {

};
const ApplicationCommentsListView: FC<ApplicationDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.clearStore()
    store.loadEmployees();
    store.loadCommentType();
    store.loadAllComments(store.application_id);
    store.getUser();
  }, [store.application_id]);

  return (
    <Container maxWidth="lg" style={{ marginTop: 30 }}>
      {/* <Typography sx={{ textAlign: "center", fontSize: "25px" }} >{store.data.length > 0 ? translate("label:ApplicationCommentsListView.EntityTitle") : translate("label:ApplicationCommentsListView.EntityNotComment")}</Typography> */}
      <Box sx={{ ml: "5%", display: "flex", justifyContent: "space-between" }}>
        <CommmentItem
          data={store.isOpenComment == true ? store.dataAll : store.data}
          onSaveClick={() => {
            store.loadAllComments(store.application_id);
          }}
        />
        <Box sx={{ flex: "end", }}>
          {!store.isOpenComment ? (
            // <IconButton
            //   disableRipple
            //   disableFocusRipple
            //   color="primary"
            //   sx={{ p: "20px", ml: "auto", mt: "5px", mb: "15px", '&:hover': { backgroundColor: 'transparent' }, '&:active': { backgroundColor: 'transparent', boxShadow: 'none' } }}
            //   aria-label={translate("common:openPanel")}
            //   onClick={() => store.openPanel()}
            // >
            //   <p style={{ padding: "0", marginRight: "5px", fontSize: "14px" }}>({store.dataAll?.length}) {translate("common:all")}</p>
            //   <KeyboardArrowRightIcon />
            // </IconButton>
            <>  </>
          ) : (
            <IconButton
              disableRipple
              disableFocusRipple
              color="primary"
              sx={{ p: "20px", ml: "auto", mt: "5px", mb: "15px", '&:hover': { backgroundColor: 'transparent' }, '&:active': { backgroundColor: 'transparent', boxShadow: 'none' } }}
              onClick={() => store.closePanel()}
            >
              <p style={{ padding: "0", marginRight: "5px", fontSize: "14px" }}>{translate("common:hide")}</p>
              <KeyboardArrowDownIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box width="100%" sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>

        </Box>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", marginTop: "30px" }}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            name="comment"
            value={store.comment}
            sx={{ whiteSpace: "pre-wrap" }}
            onChange={(e) => store.handleChange(e)}
          ></TextField>
            </Grid>
              <Grid item md={5} xs={12}>
          <AutocompleteCustom
            value={store.comment_type_id ?? 0}
            onChange={(e) => store.comment_type_id = e.target.value}
            name="comment_type_id"
            data={store.comment_types}
            fieldNameDisplay={(e) => `${e.name}`}
            id="id_f_comment_type_id"
            label={translate("label:DutyPlanLogListView.search_employee")}
          />
              </Grid>
                <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.employee_id ?? 0}
            onChange={(e) => store.employee_id = e.target.value}
            name="employee_id"
            data={store.employees}
            fieldNameDisplay={(e) => `${e.last_name} ${e.first_name} ${e.second_name}`}
            id="id_f_employee_id"
            label={translate("label:DutyPlanLogListView.search_employee")}
          />
                </Grid>
                  <Grid item md={1} xs={12}>
          <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
            <DoneIcon
              onClick={() =>
                store.onSaveClick(() => { })
              }
            />
          </IconButton>
                  </Grid>
                </Grid>
        </Paper>
      </Box>
    </Container>
  );
});

export default ApplicationCommentsListView;
