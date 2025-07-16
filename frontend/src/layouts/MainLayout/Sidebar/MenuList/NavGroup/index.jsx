import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

// project imports
import NavItem from "../NavItem";
import NavCollapse from "../NavCollapse";
import { observer } from "mobx-react";
import mainStore from "MainStore";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = observer(({ item, isSuperAdmin }) => {
  const theme = useTheme();
  let menuItems = mainStore.menu;
  const items = menuItems.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
      >
        {items}
      </List>

      {/* group divider */}
      <Divider sx={{ mt: 0.25, mb: 1.25 }} />
    </>
  );
});

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
