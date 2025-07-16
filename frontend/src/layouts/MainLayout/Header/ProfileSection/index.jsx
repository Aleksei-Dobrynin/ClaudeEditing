import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconLogout, IconSettings } from '@tabler/icons-react';
import { observer } from 'mobx-react';
import store from 'layouts/MainLayout/store'
import MainStore from 'MainStore';
import dayjs from 'dayjs';
// Assuming you have a MobX store

const ProfileSection = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const translate = t;
  // const store = usestore(); // Using a MobX store for state

  const anchorRef = useRef(null);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    store.setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    store.setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleToggle = () => {
    store.setOpen(!store.open);
  };

  const prevOpen = useRef(store.open);
  useEffect(() => {
    if (prevOpen.current === true && store.open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = store.open;
  }, [store.open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            // src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={store.open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={store.open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={store.open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={store.open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">{translate("common:Hello")},</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {store.first_name + " " + store.last_name}
                        </Typography>
                      </Stack>
                      {/* <Typography variant="subtitle2">Project Admin</Typography> */}
                    </Stack>
                    <Divider />
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${10}px` }}
                          selected={store.selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0, '/user/account-settings')}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{translate("common:Account_Settings")}</Typography>} />
                        </ListItemButton>
                        {/* {(store.head_of_structures.includes("Отдел районных архитекторов")
                          || store.head_of_structures.includes("Отдел РА - Октябрьский район")
                          || store.head_of_structures.includes("Отдел РА - Свердловский район")
                          || store.head_of_structures.includes("Отдел РА - Ленинский район")
                          || store.head_of_structures.includes("Отдел РА - Первомайский район")) && <ListItemButton
                            sx={{ borderRadius: `${10}px` }}
                            selected={store.selectedIndex === 4}
                            onClick={() => {
                              MainStore.printDocument(28, {
                                date_start: dayjs("2024-11-21 00:00:00"), date_end: dayjs("2024-12-12 00:00:00")
                              })
                            }}
                          >
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">{translate("common:Download_the_report")}</Typography>} />
                          </ListItemButton>} */}
                        <ListItemButton
                          sx={{ borderRadius: `${10}px` }}
                          selected={store.selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{translate("common:Logout")}</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
});

export default ProfileSection;