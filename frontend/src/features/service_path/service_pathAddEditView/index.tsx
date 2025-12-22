import { FC, useEffect } from "react";
import { default as Service_pathAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Divider, Grid, List, ListItem, Paper, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";
import ListItemText from "@mui/material/ListItemText";

type service_pathProps = {};

const service_pathAddEditView: FC<service_pathProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")
  const entityTitles: Record<string, string> = {
    step: "Шаги",
    document: "Документы",
    // при необходимости добавьте остальные
  };
  const kindTitles: Record<string, string> = {
    add: "Добавлено",
    update: "Изменено",
    delete: "Удалено",
  };

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <Service_pathAddEditBaseView {...props}>
      <Grid item xs={12}>
        {store.bufferList.length}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Предварительные изменения
        </Typography>

        <List dense disablePadding>
          {Object.entries(
            (store.bufferList ?? []).reduce((acc, item) => {
              if (!acc[item.entity]) {
                acc[item.entity] = { add: 0, update: 0, delete: 0 };
              }
              acc[item.entity][item.kind]++;
              return acc;
            }, {})
          ).map(([entity, kinds]: any) =>
            Object.entries(kinds).map(([kind, count]) => {
              if (!count) return null;

              const entityTitle = entityTitles[entity] ?? entity;
              const kindTitle = kindTitles[kind] ?? kind;

              return (
                <ListItem key={`${entity}-${kind}`} disableGutters>
                  <ListItemText
                    primary={`${kindTitle} – ${entityTitle} – ${count}`}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                </ListItem>
              );
            })
          )}
        </List>

        <Divider sx={{ mt: 1 }} />
      </Grid>

      {/* start MTM */}
            {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}
            {/* end MTM */}
    
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_service_pathSaveButton"
              name={'service_pathAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/service_path')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_service_pathCancelButton"
              name={'service_pathAddEditView.cancel'}
              onClick={() => navigate('/user/service_path')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Service_pathAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default service_pathAddEditView