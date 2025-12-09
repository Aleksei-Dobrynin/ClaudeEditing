import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import styled from "styled-components";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import CustomButton from "components/Button";
import i18n from "i18next";

type AppHeaderProps = {
  handleOpenLeftSidebar: (state: boolean) => void;
};

const AppHeader: FC<AppHeaderProps> = observer((props) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppHeaderWrapper>
        <ContentContainer>
          <StyledButton
            id={"MainHeaderLogoButton"}
            variant="text"
            onClick={() => props.handleOpenLeftSidebar(true)}
          >
            <PageName id={"MainHeaderName"}>
              Test header
            </PageName>
          </StyledButton>
        </ContentContainer>
        <ContentContainer>
          <NavigateMenu>
            <MenuLink id={"MainHeaderHelpMenu"}>Settings</MenuLink>
          </NavigateMenu>
          <Divider />

          <IconButton
            id={"MainHeaderUserButton"}
            aria-label="header-avatar-menu"
            onClick={handleOpenNavMenu}
          >
          </IconButton>
          <StyledMenu
            id={"MainHeaderUserMenu"}
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuHeader id={"MainHeaderUserMenuUserInfo"}>
              <MenuName id={"MainHeaderUserMenuUserPreferedName"}>
                {localStorage.getItem("currentUser")}
              </MenuName>
              <MenuEmail id={"MainHeaderUserMenuUserEmail"}>
                {localStorage.getItem("currentUser")}
              </MenuEmail>
            </MenuHeader>
            <MenuItem
              id={"MainHeaderUserMenuAccountSettingsButton"}
              onClick={() => navigate("/user/account-settings")}
            >
              Account settings
            </MenuItem>
            <MenuItem
              id={"MainHeaderUserMenuAccountSettingsButton"}
              onClick={() => i18n.changeLanguage("ru-RU")}
            >
              Русский
            </MenuItem>
            <MenuItem
              id={"MainHeaderUserMenuAccountSettingsButton"}
              onClick={() => i18n.changeLanguage("en-US")}
            >
              English
            </MenuItem>
            <MenuItem
              id={"MainHeaderUserMenuLogoutButton"}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                navigate("/login");
              }}
            >
              Sign out
            </MenuItem>
          </StyledMenu>
        </ContentContainer>
      </AppHeaderWrapper>
    </>
  );
});

export default AppHeader;

const AppHeaderWrapper = styled.div`
  width: 100%;
  height: 72px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--colorPaletteVioletBackground1);
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: inherit;
`;

const PageName = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  color: var(--colorNeutralBackground1);
  margin-left: 22px;
`;

const NavigateMenu = styled.ul`
  display: flex;
  align-items: center;
  padding: 0 0;
`;

const MenuLink = styled.li`
  list-style-type: none;
  color: var(--colorNeutralForegroundInverted1);
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.7384616136550903px;
  text-transform: uppercase;
  padding: 0 12px;
`;

const Divider = styled.div`
  width: 1px;
  height: 32px;
  color: var(--colorPaletteVioletBackground2);
  background-color: var(--colorPaletteVioletBackground2);
  margin-right: 16px;
`;

const StyledButton = styled(CustomButton)``;

const MenuHeader = styled.div`
  width: 100%;
  min-width: 200px;
  max-width: 250px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--colorNeutralBackground3);
  margin-bottom: 8px;
  cursor: default;
`;

const MenuName = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: var(--colorNeutralForeground2);
  margin-bottom: 4px;
`;

const MenuEmail = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--colorNeutralForeground2);
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    box-shadow: 0 1px 2px 0 var(--colorShadowInverted1);
    border: 1px solid var(--colorNeutralForeground4);
    border-radius: 0;
  }
  .MuiButtonBase-root {
    &:hover {
      background-color: var(--colorPalleteLightBlue);
    }
  }
`;
