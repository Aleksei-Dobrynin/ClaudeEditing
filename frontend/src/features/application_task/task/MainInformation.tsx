import React, { FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import styled from "styled-components";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CustomButton from "components/Button";
import MainStore from "MainStore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LayoutStore from "layouts/MainLayout/store";
import HistoryIcon from "@mui/icons-material/History";


type MainInformationProps = {
};

const MainInformation: FC<MainInformationProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  let filteredStatuses = store.Statuses.reduce((acc, s) => {
    let matchingRoad = store.ApplicationRoads.find(ar =>
      ar.from_status_id === store.Application.status_id &&
      ar.to_status_id === s.id &&
      ar.is_active === true
    );
    if (matchingRoad) {
      acc.push({
        ...s,
        is_allowed: matchingRoad.is_allowed
      });
    }
    return acc;
  }, []);


  const calculateBackUrl = () => {
    if (store.backUrl === "all") {
      return `/user/all_tasks`
    } else if (store.backUrl === "my") {
      return `/user/my_tasks`
    } else if (store.backUrl === "structure") {
      return `/user/structure_tasks`
    } else {
      return `/user/structure_tasks`
    }
  }

  return (
    <MainContent>

      <Paper elevation={7} variant="outlined">
        <Card>
          <CardContent>

            <Box sx={{ marginBottom: "5px", width: 10 }}>
              <CustomButton startIcon={<KeyboardBackspaceIcon />} onClick={() => navigate(calculateBackUrl())} variant="outlined">
                Назад
              </CustomButton>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mt: 1, mb: 1 }}>
                    {store.Customer?.full_name}, {store.Customer?.pin}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  <StyledRouterLink to={`/user/application/addedit?id=${store.application_id}`}>
                    Заявка # {store.application_number}
                  </StyledRouterLink>
                </Typography>
              </Box>

              <Box>
                <CustomButton
                  customColor={"#718fb8"}
                  size="small"
                  variant="contained"
                  sx={{ mb: "5px", mr: 1 }}
                  // disabled={!(store.is_done || (MainStore.isAdmin || store.task_assigneeIds.includes(LayoutStore.employee_id)))}
                  onClick={(event) => {
                    if (!store.isAssigned && !MainStore.isAdmin) { // если не назначены
                      MainStore.openErrorDialog("Вы не назначены на задачу")
                      return;
                    }
                    setAnchorEl(event.currentTarget);
                  }}
                  endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                >
                  {`${translate("label:ApplicationAddEditView.status")}${store.Statuses.find(s => s.id === store.Application.status_id)?.name}`}
                </CustomButton>
                {filteredStatuses?.length > 0 &&
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <Typography variant="h5" sx={{ textAlign: "center", width: "100%" }}>
                      {translate("common:Select_status")}
                    </Typography>
                    {store.id > 0 && store.Application.status_id > 0 && filteredStatuses.map(x => {
                      return <MenuItem
                        key={x.id}
                        onClick={() => {
                          store.changeToStatus(x.id, x.code)
                          handleClose()
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#718fb8",
                            color: "#FFFFFF"
                          },
                          "&:hover .MuiListItemText-root": {
                            color: "#FFFFFF"
                          }
                        }}
                        disabled={!x.is_allowed}
                      >
                        {x.name}
                      </MenuItem>
                        ;
                    })}
                  </Menu>
                }
                <Tooltip title={`${translate("label:HistoryTableListView.entityTitle")} `} arrow>
                  <IconButton
                    id="EmployeeList_Search_Btn"
                    onClick={() => { store.changeApplicationHistoryPanel(true) }}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

          </CardContent>
        </Card>
      </Paper>

    </MainContent >
  );
})

const MainContent = styled.div`
`

const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`

export default MainInformation