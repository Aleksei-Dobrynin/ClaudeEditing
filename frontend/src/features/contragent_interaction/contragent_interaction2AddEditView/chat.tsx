import React, { useState, useEffect, FC } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  InputAdornment,
  Input, IconButton, Tooltip
} from "@mui/material";
import document_store from "../../contragent_interaction_doc/contragent_interaction_docListView/store";
import { observer } from "mobx-react";
import store from "../../contragent_interaction_doc/contragent_interaction_docListView/store";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import UploadIcon from "@mui/icons-material/Upload";
import ClearIcon from "@mui/icons-material/Clear";
import storeList from "../../contragent_interaction_doc/contragent_interaction_docListView/store";
import storeItem from "../../contragent_interaction_doc/contragent_interaction_docAddEditView/store";

type ChatProps = {
  interactionId: any;
  contragent: any;
};

const Chat: FC<ChatProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.interactionId != null && !isNaN(Number(props.interactionId.toString()))) {
      document_store.loadcontragent_interaction_docsByinteraction_id(Number(props.interactionId));
      storeItem.setInteractionId(Number(props.interactionId));
    }

    return () => {
      document_store.clearPollingTimeout()
    };
  }, [props.interactionId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "auto"
      }}
    >
      <Paper sx={{ padding: 2, overflow: "auto", flexGrow: 1 }}>
        <List sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
          {document_store.data.filter(d => d.for_customer !== true).map((msg, index) => (
            <ListItem key={index}
                      sx={{
                        display: "flex",
                        justifyContent: msg.type_org === "bga" ? "flex-end" : "flex-start",
                        maxWidth: "100%",
                        padding: 0.5
                      }}>

              <Box
                sx={{
                  maxWidth: "50%",
                  width: "50%",
                  backgroundColor: msg.type_org === "bga" ? "#DCF8C6" : "#c6f8e2",
                  color: "text.primary",
                  padding: 1,
                  borderRadius: 1,
                  boxShadow: 2,
                  wordBreak: "break-word",
                  margin: 1,
                  textAlign: msg.type_org === "bga" ? "right" : "left"
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  {msg.type_org === "bga" ? "БГА" : props.contragent?.name} - {msg.user_name} 
                </Typography>
                <Typography variant="body1" style={{marginTop: 10}}>
                  {msg.message}
                </Typography>
                {msg.file_id && (<>
                  <Typography variant="caption" color="primary">
                    {msg.file_name}
                  </Typography>
                  <Tooltip title={translate("downloadFile")}>
                    <IconButton size="small" onClick={() => store.downloadFile(msg.file_id, msg.file_name)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <br />
                </>)}
                <Typography variant="caption" color="textSecondary">
                  {dayjs(msg.sent_at).format("DD.MM.YYYY HH:mm")}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={translate("label:contragent_interaction_docListView.type_message")}
          value={storeItem.message}
          name={"message"}
          id={"message"}
          onChange={(e) => storeItem.handleChange(e)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={translate("label:contragent_interaction_docListView.upload_file")}>
                  <IconButton component="label">
                    <Input
                      type="file"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files.length == 0) return;
                        storeItem.handleChange({ target: { value: event.target.files[0], name: "File" } });
                        storeItem.handleChange({ target: { value: event.target.files[0].name, name: "fileName" } });
                      }}
                      sx={{ display: "none" }}
                    />
                    <UploadIcon />
                  </IconButton>
                </Tooltip>
                {storeItem.File && (
                  <Box sx={{ display: "flex", alignItems: "center", marginLeft: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      {storeItem.fileName}
                    </Typography>
                    <Tooltip title={translate("label:contragent_interaction_docListView.clear_file")}>
                      <IconButton
                        onClick={() => {
                          console.log(storeItem.File);
                          storeItem.handleChange({ target: { value: null, name: "File" } });
                          storeItem.handleChange({ target: { value: "", name: "fileName" } });
                          storeItem.changeDocInputKey();
                        }}
                        size="small" sx={{ marginLeft: 1 }}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            storeItem.setInteractionId(Number(props.interactionId));
            storeItem.onSaveClick((id: number) => {
              document_store.loadcontragent_interaction_docs();
              storeItem.clearStore();
            });
          }}
          sx={{ marginLeft: 1 }}
        >
          {translate("label:contragent_interaction_docListView.send")}
        </Button>
      </Box>
    </Box>
  );
});

export default Chat;
