import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box, Typography, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../application_taskListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type application_taskProps = {
  application_id: number;
  onAddTaskClicked: () => void;
};

const FastInputView: FC<application_taskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (props.application_id !== 0 && storeList.idMain !== props.application_id) {
      storeList.idMain = props.application_id;
      storeList.loadapplication_tasks();
    }
  }, [props.application_id]);

  useEffect(() => {
    return () => storeList.clearStore()
  }, []);


  return (
    <>
      {storeList.data.map(task => <Paper key={task.id} elevation={7} variant="outlined" sx={{ mt: 2 }}>
        <Card>
          <CardContent>

            <Box display={"flex"} justifyContent={"space-between"}>

              <CustomButton
                customColor={"#718fb8"}
                size="small"
                variant="contained"
                sx={{ mb: "5px", mr: 1 }}
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                {`${translate("Статус задачи: ")}${store.task_statuses.find(s => s.id === store.status_id)?.name}`}
              </CustomButton>

            </Box>
            <Chip size="small" label={task.status_idNavName} style={{ background: task.status_back_color, color: task.status_text_color }} />

          </CardContent>
        </Card>
      </Paper >)}

      <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
        <CustomButton
          variant="contained"
          size="small"
          id="id_application_taskAddButton"
          onClick={() => {
            props.onAddTaskClicked()
          }}
        >
          {translate("common:add")}
        </CustomButton>
      </Grid>
    </>
  );
});

export default FastInputView;
