import { FC, useEffect } from "react";
import { Container, TextField } from "@mui/material";
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
type ApplicationDocumentListViewProps = {

};
const ApplicationCommentsListView: FC<ApplicationDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.clearStore()
    store.loadAllComments(store.application_id);
    store.getUser();
  }, [store.application_id]);

  return (
    <Container maxWidth="lg" style={{ marginTop: 30 }}>
      <Typography sx={{ textAlign: "center", fontSize: "25px" }} >{store.data.length > 0 ? translate("label:ApplicationCommentsListView.EntityTitle") : translate("label:ApplicationCommentsListView.EntityNotComment")}</Typography>
      <Box sx={{ ml: "5%", display: "flex", justifyContent: "space-between" }}>
        <CommmentItem
          data={store.isOpenComment == true ? store.dataAll : store.data}
          onSaveClick={() => {
            store.loadAllComments(store.application_id);
          }}
        />
        <Box sx={{ flex: "end", }}>
          {!store.isOpenComment ? (
            <IconButton
              disableRipple
              disableFocusRipple
              color="primary"
              sx={{ p: "20px", ml: "auto", mt: "5px", mb: "15px", '&:hover': { backgroundColor: 'transparent' }, '&:active': { backgroundColor: 'transparent', boxShadow: 'none' } }}
              aria-label={translate("common:openPanel")}
              onClick={() => store.openPanel()}
            >
              <p style={{ padding: "0", marginRight: "5px", fontSize: "14px" }}>({store.dataAll?.length}) {translate("common:all")}</p>
              <KeyboardArrowRightIcon />
            </IconButton>
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
          <TextField
            fullWidth
            multiline
            rows={2}
            name="comment"
            value={store.comment}
            sx={{ whiteSpace: "pre-wrap" }}
            onChange={(e) => store.handleChange(e)}
          ></TextField>

          <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
            <DoneIcon
              onClick={() =>
                store.onSaveClick(() => { })
              }
            />
          </IconButton>

        </Paper>
      </Box>
    </Container>
  );
});

export default ApplicationCommentsListView;
