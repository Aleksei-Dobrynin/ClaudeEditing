import { FC, useEffect } from "react";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItem,
  List,
  IconButton,
  TextField,
} from "@mui/material";
import { ApplicationComments } from "../../../constants/ApplicationComments";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import dayjs from "dayjs";

type Props = {
  data: ApplicationComments[];
  onSaveClick: (id: number) => void;
};

const CommentItem: FC<Props> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const items = () => {
    return <>
    {props.data.length > 0 && props.data.map((item, index) => {
      return (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              secondary={
                <Box>
                  <Box style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                    <Typography
                      component="span"
                      variant={"body1"}
                      sx={{ color: "text.primary", display: "inline", marginRight: "20px" }}
                    >
                      {item.created_by && item.full_name}{' '}
                      {/* {store.userLocalStorage}  */}
                    </Typography>
                    <Box sx={{ml : "auto"}}>
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ color: "text.primary", display: "inline" }}
                      >
                        {item.created_at && (
                          <>
                            {<span style={{ opacity: "50%" }}>{store.formatDate(item.created_at)} </span>}
                          </>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box style={{ marginTop: "20px" }}>
                    {store.isEdit != item.id ? (
                      <Typography
                        component="span"
                        variant={"body2"}
                        sx={{ color: "grey", marginRight: "20px", wordWrap: "break-word" }}
                      >
                        {item.comment}
                      </Typography>
                    ) : (
                      <>
                        <TextField
                          value={store.comment}
                          name="comment"
                          onChange={(e) => store.handleChange(e)}
                          variant="outlined"
                          fullWidth
                          sx={{ marginBottom: "10px" }}
                        />
                        <IconButton size="small">
                          <DoneIcon
                            onClick={() =>
                              store.onSaveClick((id: number) => props.onSaveClick(item.id))
                            }
                          />
                        </IconButton>
                      </>
                    )}
                  </Box>
                  {store.userLocalStorage != "" && (
                    <Box sx={{ marginLeft: "100%", display: "flex" }}>
                      <IconButton size="small">
                        <EditIcon
                          onClick={() => {
                            store.onEditCustomerClicked(item);
                          }}
                        />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon
                        onClick={() => {
                          store.deleteComment(item.id);
                        }}
                        />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      );
    })}
    </> 
    
  };

  return <List sx={{ width: "100%", maxWidth: "900px", fontFamily: "fantasy" }}>{items()}</List>;
});

export default CommentItem;
