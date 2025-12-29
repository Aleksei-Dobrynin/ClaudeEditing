import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';

// project imports
import { observer } from 'mobx-react';
import menuBadgeStore from 'stores/MenuBadgeStore';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = observer(({ item, level }) => {
  const theme = useTheme();

  // Получаем счётчик для badge из store
  const badgeCount = item.badgeConfig 
    ? menuBadgeStore.getBadgeCount(item.id) 
    : 0;

  const Icon = item.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: 8,
        height: 8
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    ))
  };

  if (item?.external) {
    listItemProps.component = 'a';
    listItemProps.href = item.url;
  }

  const itemText = (
    <Typography variant="body1" color="inherit">
      {item.title}
    </Typography>
  );

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `12px`,
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`
      }}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>
        {itemIcon}
      </ListItemIcon>

      <ListItemText
        primary={
          item.badgeConfig && badgeCount > 0 ? (
            <Badge 
              badgeContent={badgeCount} 
              color="error"
              max={999}
              sx={{ 
                '& .MuiBadge-badge': {
                  right: -20,
                  top: 10,
                  fontWeight: 600
                }
              }}
            >
              {itemText}
            </Badge>
          ) : (
            itemText
          )
        }
      />

      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
});

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;