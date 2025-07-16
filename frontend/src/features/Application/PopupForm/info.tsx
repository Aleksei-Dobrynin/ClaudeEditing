import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Box,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  DialogTitle,
  Tooltip
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import store from './store';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { APPLICATION_STATUSES } from 'constants/constant';
import CustomButton from "components/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ApplicationStatusHistoryListView from "features/HistoryTable/StatusHistoryTableListView"
import HistoryIcon from "@mui/icons-material/History";
// Функция для форматирования даты
const formatDate = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD.MM.YYYY HH:mm');
};

const ApplicationDetails = observer(() => {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Здесь можно получить id из query параметров, если требуется
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
      store.doLoad(parseInt(id));
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Загрузка данных...</Typography>
      </Box>
    );
  }

  const deadline = () => {
    let dealineColor = null;
    let deadlineTooltip = "";
    if (store.deadline) {
      const deadline = dayjs(store.deadline);
      if (store.status_code === APPLICATION_STATUSES.review
        || store.status_code === APPLICATION_STATUSES.draft
        || store.status_code === APPLICATION_STATUSES.service_requests
        || store.status_code === APPLICATION_STATUSES.preparation
        || store.status_code === APPLICATION_STATUSES.executor_assignment
      ) {
        if (deadline < dayjs()) {
          dealineColor = "red";
          deadlineTooltip = `Срок выполнения просрочен на ${dayjs().set('hour', 23).set('minute', 59).diff(deadline, 'day')} дней`
        } else if (deadline < dayjs().add(1, "day")) {
          dealineColor = "#0000FF";
        } else if (deadline < dayjs().add(3, "day")) {
          dealineColor = "#FF00FF";
        } else if (deadline < dayjs().add(7, "day")) {
          dealineColor = "#9105fc";
        }
      }
    }

    return <div>
      <Tooltip title={deadlineTooltip} placement="bottom">
        <span style={{ color: dealineColor, fontWeight: 700 }}>
          {store.deadline ? dayjs(store.deadline).format("DD.MM.YYYY") : ""}
        </span>
      </Tooltip>
    </div>;
  }

  let filteredStatuses = store.Statuses.reduce((acc, s) => {
    let matchingRoad = store.ApplicationRoads.find(ar =>
      ar.from_status_id === store.status_id &&
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

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h1" gutterBottom>
              Заявка #{store.number}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>

            <CustomButton
              customColor={"#718fb8"}
              size="small"
              variant="contained"
              sx={{ mb: "5px", mr: 1 }}
              onClick={handleClick}
              endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            >
              {`Статус: ${store.Statuses.find(s => s.id === store.status_id)?.name}`}
            </CustomButton>
            {filteredStatuses?.length > 0 &&
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <Typography variant="h5" sx={{ textAlign: "center", width: "100%" }}>
                  Выбрать статус:
                </Typography>
                {store.id > 0 && store.status_id > 0 && filteredStatuses.map(x => {
                  return <MenuItem
                    onClick={() => store.changeToStatus(x.id)}
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

            <Dialog
              open={store.openStatusHistoryPanel}
              maxWidth="lg"
              fullWidth
            >
              <DialogContent>
                <ApplicationStatusHistoryListView
                  ApplicationID={store.id}
                />
              </DialogContent>
              <DialogActions>
                <CustomButton
                  variant="contained"
                  id="id_application_subtask_assigneeCancelButton"
                  name={'application_subtask_assigneeAddEditView.cancel'}
                  onClick={() => store.changeApplicationHistoryPanel(false)} // Исправлено
                >
                  Закрыть
                </CustomButton>
              </DialogActions>
            </Dialog>

            <IconButton
              id="EmployeeList_Search_Btn"
              onClick={() => { store.changeApplicationHistoryPanel(true) }}
            >
              <HistoryIcon />
            </IconButton>


            {/* <Chip
            label={store.status_name}
            sx={{ fontWeight: 'bold', fontSize: '0.9rem', backgroundColor: store.status_color }}
          /> */}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Основная информация + Детали заявки */}


          <Grid container spacing={1} sx={{ p: 1 }}>


            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessCenterIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Услуга</Typography>
                  <Typography variant="body2">{store.service_name}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Тип работ</Typography>
                  <Typography variant="body2">{store.work_description}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Дата регистрации</Typography>
                  <Typography variant="body2">{formatDate(store.registration_date)}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Регистратор</Typography>
                  <Typography variant="body2">{store.created_by_name}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Дедлайн</Typography>
                  <Typography variant="body2">{deadline()}</Typography>
                </Box>
              </Box>
            </Grid>



            <Grid item xs={12} sm={6} md={3}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Вх. №</Typography>
                  <Typography variant="body2">{store.incoming_numbers || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Исх. №</Typography>
                  <Typography variant="body2">{store.outgoing_numbers || '-'}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Объекты */}
      {
        store.arch_objects && store.arch_objects.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Адрес объекта</Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />

              <Grid container spacing={2}>
                {store.arch_objects.map((obj, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2, pb: '8px !important' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <HomeWorkIcon sx={{ mr: 1, color: 'primary.main', fontSize: '1.2rem', mt: 0.3 }} />
                          <Typography variant="subtitle1" gutterBottom component="div" sx={{ fontWeight: 'medium' }}>
                            {obj.address}
                          </Typography>
                        </Box>

                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Район</Typography>
                            <Typography variant="body2">{obj.district_name || '-'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">ЕНИ</Typography>
                            <Typography variant="body2">{obj.addressInfo && obj.addressInfo.length > 0 ? obj.addressInfo[0].propcode || '-' : '-'}</Typography>
                          </Grid>
                          {/* <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Тип объекта</Typography>
                          <Typography variant="body2">{obj.district_name || '-'}</Typography>
                        </Grid> */}

                          {obj.tags && obj.tags.length > 0 && (
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Теги</Typography>
                              <Box sx={{ mt: 0.5 }}>
                                {obj.tags.map((tag, i) => {
                                  const t = store.Tags?.find(x => x.id == tag)
                                  return <Chip
                                    key={tag}
                                    label={t?.name}
                                    size="small"
                                    variant="outlined"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                })}
                              </Box>
                            </Grid>
                          )}

                          {obj.description && (
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Описание</Typography>
                              <Typography variant="body2">
                                {obj.description}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )
      }

      {/* Информация о заказчике */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Информация о заказчике</Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />

          {store.customer && store.customer.is_organization ? (
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ width: '40%', backgroundColor: 'action.hover' }}>
                          Полное название
                        </TableCell>
                        <TableCell>{store.customer.full_name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>ИНН</TableCell>
                        <TableCell>{store.customer.pin}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Адрес</TableCell>
                        <TableCell>{store.customer.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Директор</TableCell>
                        <TableCell>{store.customer.director}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Тип организации</TableCell>
                        <TableCell>{store.customer.organization_type_id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>УГНС</TableCell>
                        <TableCell>{store.customer.ugns}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ width: '40%', backgroundColor: 'action.hover' }}>
                          Счет
                        </TableCell>
                        <TableCell>{store.customer.payment_account}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Банк</TableCell>
                        <TableCell>{store.customer.bank}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>БИК</TableCell>
                        <TableCell>{store.customer.bik}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Рег. номер</TableCell>
                        <TableCell>{store.customer.registration_number}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Телефон
                          </Box>
                        </TableCell>
                        <TableCell>{store.customer.sms_1 || store.customer.sms_2 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Email
                          </Box>
                        </TableCell>
                        <TableCell>{store.customer.email_1 || store.customer.email_2 || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ width: '40%', backgroundColor: 'action.hover' }}>
                          ФИО
                        </TableCell>
                        <TableCell>
                          {`${store.customer?.individual_surname || ''} 
                          ${store.customer?.individual_name || ''} 
                          ${store.customer?.individual_secondname || ''}`.trim() || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Адрес</TableCell>
                        <TableCell>{store.customer?.address || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Тип документа</TableCell>
                        <TableCell>{store.customer?.identity_document_type_id || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Серия документа</TableCell>
                        <TableCell>{store.customer?.document_serie || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ width: '40%', backgroundColor: 'action.hover' }}>
                          Дата выдачи
                        </TableCell>
                        <TableCell>{formatDate(store.customer?.document_date_issue) || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>Кем выдан</TableCell>
                        <TableCell>{store.customer?.document_whom_issued || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Телефон
                          </Box>
                        </TableCell>
                        <TableCell>{store.customer?.sms_1 || store.customer?.sms_2 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: 'action.hover' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Email
                          </Box>
                        </TableCell>
                        <TableCell>{store.customer?.email_1 || store.customer?.email_2 || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Доверенные лица */}
      {
        store.customer && store.customer.customerRepresentatives && store.customer.customerRepresentatives.length > 0 && (
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Доверенные лица</Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />

              <Grid container spacing={2}>
                {store.customer.customerRepresentatives.map((rep, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="subtitle1" gutterBottom>{rep.last_name} {rep.first_name} {rep.second_name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{rep.contact || "-"}</Typography>
                      </Box>
                      {/* {rep.position && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Должность: {rep.position}
                      </Typography>
                    )} */}
                      {/* {rep.contact && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{rep.contact}</Typography>
                      </Box>
                    )} */}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )
      }
    </Box >
  );
});

export default ApplicationDetails;