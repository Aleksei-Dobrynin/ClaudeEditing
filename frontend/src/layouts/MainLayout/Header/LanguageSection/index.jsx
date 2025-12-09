import { useRef, useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Flag from 'react-world-flags';

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
import i18n from "i18next";

// assets
import {
  IconWorld,
  IconAlphabetCyrillic,
  IconAlphabetLatin,
} from "@tabler/icons-react";
import { observer } from "mobx-react";
import store from "layouts/MainLayout/store";
// Assuming you have a MobX store

const LanguageSection = observer(() => {

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  
  const anchorRef = useRef(null);

  const handleListItemClick = (event, index) => {
    store.setSelectedIndex(index);
  
  switch (index) {
    case 0:
      i18n.changeLanguage("ru-RU");
      break;
    case 1:
      i18n.changeLanguage("ky-KG");
      break;
    default:
      break;
  }
  if (index !== undefined && index !== null) {
    localStorage.setItem("selectedIndex", index);
}
    handleClose(event);
  };

  useEffect(() => {
    const savedIndex = parseInt(localStorage.getItem("selectedIndex"), 10);

    if (savedIndex) {
        store.setSelectedIndex(savedIndex);
    }
}, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down("md")]: {
            mr: 2,
          },
        }}
      >
        <ButtonBase sx={{ borderRadius: "12px" }}>
          <Avatar
            variant="square"
            sx={{
              background: "#FFFFFF",
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            {store.selectedIndex === 0 ? <Flag code="RU" alt="Russia" width="30" /> : <Flag code="KG" alt="Kyrgyzstan" width="30" /> }
            {/* <IconWorld stroke={1.5} size="1.3rem" /> */}
          </Avatar>
        </ButtonBase>
      </Box>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={store.open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <PerfectScrollbar
                    style={{
                      height: "100%",
                      maxHeight: 150,
                    }}
                  >
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: "100%",
                          maxWidth: 250,
                          minWidth: 200,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "10px",
                          [theme.breakpoints.down("md")]: {
                            minWidth: "100%",
                          },
                          "& .MuiListItemButton-root": {
                            mt: 0.5,
                          },
                        }}
                      >
                    
                        <ListItemButton
                          sx={{ borderRadius: `${10}px` }}
                          selected={store.selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0)}
                        >
                          <ListItemIcon>
                            {/* <IconAlphabetCyrillic stroke={1.5} size="1.3rem" /> */}
                            <Flag code="RU" alt="Russia" width="30" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Русский</Typography>}
                          />
                        </ListItemButton>

                        <ListItemButton
                          sx={{ borderRadius: `${10}px` }}
                          selected={store.selectedIndex === 1}
                          onClick={(event) => handleListItemClick(event, 1)}
                        >
                          <ListItemIcon>
                            <Flag code="KG" alt="Kyrgyzstan" width="30" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Кыргызский</Typography>}
                          />
                        </ListItemButton>
                        {/* <ListItemButton
                          sx={{ borderRadius: `${10}px` }}
                          selected={store.selectedIndex === 2}
                          onClick={(event) => handleListItemClick(event, 2)}
                        >
                          <ListItemIcon>
                            <IconAlphabetLatin stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2">Английский</Typography>}
                          />
                        </ListItemButton> */}
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

export default LanguageSection;
