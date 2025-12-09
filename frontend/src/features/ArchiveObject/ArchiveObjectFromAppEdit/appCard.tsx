import React, { FC, useEffect } from "react";
import { useLocation } from "react-router";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import EditIcon from "@mui/icons-material/Create";
import LayoutStore from 'layouts/MainLayout/store'
import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import CustomTextField from "components/TextField";


type CardApplicationProps = {
  idTask?: number;
};

const CardAppArch: FC<CardApplicationProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainContent>

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 1, mb: 1 }}>
        {`${translate("Заявка")}: `}
        <span style={{ fontWeight: 'normal' }}>
          {store.Application?.number}
        </span>
      </Typography>

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 1, mb: 1 }}>
        {`${translate("Заказчик")}: `}
        <span style={{ fontWeight: 'normal' }}>
          {store.Customer?.full_name}, {store.Customer?.pin}
        </span>
      </Typography>


      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
        {`${translate("Контакты")}: `}
        {store.Customer?.sms_1 && <span style={{ fontWeight: 'normal', marginRight: 5 }}>{`${translate("label:CustomerAddEditView.sms_1")}: ${store.Customer?.sms_1}`}</span>}
        {store.Customer?.sms_2 && <span style={{ fontWeight: 'normal', marginRight: 5 }}>{`${translate("label:CustomerAddEditView.sms_2")}: ${store.Customer?.sms_2}`}</span>}
        {store.Customer?.email_1 && <span style={{ fontWeight: 'normal', marginRight: 5 }}>{`${translate("label:CustomerAddEditView.email_1")}: ${store.Customer?.email_1}`}</span>}
        {store.Customer?.email_2 && <span style={{ fontWeight: 'normal' }}>{`${translate("label:CustomerAddEditView.email_2")}: ${store.Customer?.email_2}`}</span>}
      </Typography>

      {store.Customer?.customerRepresentatives.length > 0 ? <>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
          {`${translate("Представитель")}: `}
          <span style={{ fontWeight: 'normal' }}>
            {store.Customer?.customerRepresentatives[0].last_name} &nbsp;
            {store.Customer?.customerRepresentatives[0].first_name} &nbsp;
            {store.Customer?.customerRepresentatives[0].second_name}&nbsp;
            {store.Customer?.customerRepresentatives[0].contact}
          </span>
        </Typography>
      </> : ""}

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
        {`${translate("Услуга")}: `}
        <span style={{ fontWeight: 'normal' }}>
          {store.Application?.service_name} ({store.Application?.work_description})
        </span>
      </Typography>
      {/* {store.StructureTags.filter(x => x.structure_id === store.structure_id).length !== 0 && <Box display={"flex"}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 100 }}>
          {`${translate("Тип услуги")}: `}
        </Typography>
        <LookUp
          value={store.structure_tag_id}
          onChange={(event) => store.changeStructureTag(event.target.value)}
          name="structure_tag_id"
          error={!!store.errorstructure_tag_id}
          helperText={store.errorstructure_tag_id}
          data={store.StructureTags.filter(x => x.structure_id === store.structure_id)}
          id='structure_tag_id'
          hideLabel
          label={translate('Тип услуги')}
        />
      </Box>} */}




      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
        {`${translate("label:ApplicationAddEditView.registration_date")}: `}
        <span style={{ fontWeight: 'normal' }}>
          {dayjs(store.Application?.registration_date).format('DD.MM.YYYY HH:mm')}
        </span>
      </Typography>

      {/* <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
        {`${translate("label:ApplicationAddEditView.deadline")}: `}
        <span style={{ fontWeight: 'normal' }}>
          {dayjs(store.Application?.deadline).format('DD.MM.YYYY')}
        </span>
      </Typography>

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
        {`${translate("label:ApplicationAddEditView.Status")}: `}
        <span style={{ fontWeight: 'normal' }}>
          {store.Application?.status_name}
        </span>
      </Typography> */}

      {/* <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, marginRight: 1 }}>
        {`${translate("label:ApplicationAddEditView.Object_address")}: `}
        <span style={{ fontWeight: 'normal' }}>
          {store.arch_objects.map(x => x.address).join(", ")}
        </span>
      </Typography> */}


      <Box display={"flex"}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 130 }}>
          {`${translate("Район объекта")}: `}
          <span style={{ fontWeight: 'normal' }}>
            {store.Application?.arch_object_district}
          </span>
        </Typography>
      </Box>
      <Box display={"flex"}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 130 }}>
          {`${translate("label:ArchiveObjectAddEditView.dp_outgoing_number")}: `}
          <span style={{ fontWeight: 'normal' }}>
            {store.Application?.dp_outgoing_number}
          </span>
        </Typography>
      </Box>


      {/* <Box display={"flex"} alignItems={"center"} sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 150 }}>
          {`${translate("Площадь объекта")}: `}
        </Typography>
      </Box> */}


      {/* <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
        {`${translate("Тэги")}: `}
        {store.tags?.map(x => <Chip key={x.id} size="small" sx={{ mb: 1, mr: 1 }} label={store.Tags.find(y => y.id === x)?.name} />)}
      </Typography> */}


      {/* <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 110 }}>
        {`${translate("Тип объекта")}: `}
      </Typography> */}

    </MainContent >
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`
const SmallTextField = styled(CustomTextField)`
  .MuiOutlinedInput-input{
    padding: 3px 5px;
    width: 70px;
  }
`
const MainContent = styled.div`
  max-width: 700px;
`


export default CardAppArch