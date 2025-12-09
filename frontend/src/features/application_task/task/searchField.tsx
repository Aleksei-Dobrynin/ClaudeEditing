import { FC, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid, IconButton, InputAdornment, ListItemText, Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import CustomButton from 'components/Button';
import FastInputapplication_subtaskView from 'features/application_subtask/application_subtaskAddEditView/fastInput';
import styled from "styled-components";
import CardApplication from "./CardApplication";
import CustomTextField from "components/TextField";
import ClearIcon from "@mui/icons-material/Clear";

type SearchTaskProps = {};

const SearchTask: FC<SearchTaskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <CustomTextField
      value={store.searchField}
      onChange={(e) => store.changeSearch(e.target.value)}
      name={"searchField"}
      label={translate("label:ApplicationTaskListView.Search_task")}
      onKeyDown={(e) => e.keyCode === 13 && store.getMyAppications(true)}
      id={"pin"}
      InputProps={{
        endAdornment: 
          store.searchField !== "" && <InputAdornment position="end">
            <IconButton
              id="number_Search_Btn"
              onClick={() => {
                store.changeSearch("")
                store.getMyAppications(true)
              }}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        
      }}
    />
  );
})


export default SearchTask