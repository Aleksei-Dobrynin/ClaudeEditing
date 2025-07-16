import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import RuleIcon from "@mui/icons-material/Rule";
import { useTranslation } from "react-i18next";
import MainStore from "../../../../MainStore";
import { Badge, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TechCouncilSection = (props) => {
  const { t } = useTranslation();
  const translate = t;
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    MainStore.getCountMyStructure();
    return () => {
    };
  }, [MainStore.TechCouncilCount]);

  const handleOpen = () => {
    navigate(`/user/TechCouncil`);
  };

  return (
    <>
      {MainStore.TechCouncilCount > 0 && <Box
        sx={{
          [theme.breakpoints.down("md")]: {
            mr: 2
          }
        }}
      >
        <Tooltip title={translate("Заявки на техсовет")}>
          <IconButton onClick={handleOpen} sx={{ borderRadius: "12px" }}>
            <Badge badgeContent={MainStore.TechCouncilCount} color="secondary">
              <Avatar
                variant="rounded"
                sx={{
                  transition: "all .2s ease-in-out",
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                  "&:hover": {
                    background: theme.palette.secondary.dark,
                    color: theme.palette.secondary.light
                  }
                }}
              >
                <RuleIcon />
              </Avatar>
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>}
    </>
  );
};

export default TechCouncilSection;
