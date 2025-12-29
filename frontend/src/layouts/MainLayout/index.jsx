import { Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

import { styled as styledMui, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { drawerWidth } from 'constants/constant';

import { observer } from 'mobx-react';
import store from './store'
import { useEffect } from 'react';
import MainStore from 'MainStore';
import menuBadgeStore from 'stores/MenuBadgeStore';
import {
  getForSigningCount,
  getFavoritesCount,
  getReturnsCount,
  getOverdueCount,
  getCoExecutorCount
} from 'api/MenuBadges/menuBadgesApi';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = observer(() => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));


  useEffect(() => {
    store.getNotifications()
    store.checkIsSuperAdmin()
    MainStore.getMyRoles()
    MainStore.getCountAppsFromCabinet()
    MainStore.getCountFilterForEO();
    MainStore.getCountFilterRefusal();
    store.loadCurrentEmployee();
    const timer = setInterval(() => {
      store.getNotifications()
    }, 25000)

    return () => {
      clearInterval(timer)
    }

  }, [])

  useEffect(() => {
    // "На подписание" - обновление каждые 30 секунд
    menuBadgeStore.registerBadge(
      'ForSigning',
      getForSigningCount,
      30000
    );

    // "Избранное" - без автообновления
    menuBadgeStore.registerBadge(
      'Favorites',
      getFavoritesCount
    );

    // "Возвраты" - обновление каждую минуту
    menuBadgeStore.registerBadge(
      'Returns',
      getReturnsCount,
      60000
    );

    // "Просрочки" - обновление каждые 30 секунд
    menuBadgeStore.registerBadge(
      'Overdue',
      getOverdueCount,
      30000
    );

    // "Соисполнитель" - обновление каждую минуту
    menuBadgeStore.registerBadge(
      'CoExecutor',
      getCoExecutorCount,
      60000
    );

    // Очистка при размонтировании
    return () => {
      menuBadgeStore.clearStore();
    };
  }, []);

  return (

    <Box sx={{ display: 'flex' }}>
      <Sidebar isSuperAdmin={store.isSuperAdmin} drawerOpen={!matchDownMd ? store.drawerOpened : !store.drawerOpened} drawerToggle={() => store.changeDrawer()} />

      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: store.drawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={() => store.changeDrawer()} />
        </Toolbar>
      </AppBar>

      <Main theme={theme} >
        <Outlet />
      </Main>
    </Box>
  );
});

const Main = styledMui('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme' })(({ theme }) => ({
  ...theme.typography["mainContent"],
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflow: 'auto !important',
  height: 'calc(100vh - 80px)',
  padding: 10,
  marginRight: 0,
  transition: theme.transitions.create(
    'margin',
    store.drawerOpened
      ? {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }
      : {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: store.drawerOpened ? 0 : -(drawerWidth),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));


export default MainLayout;
