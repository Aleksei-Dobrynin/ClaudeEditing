import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import React from 'react';
import { observer } from 'mobx-react';
import { Box, Card, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import store from './store';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import CustomTextField from 'components/TextField';
import styled from 'styled-components';
import DateField from 'components/DateField';
import CustomCheckbox from "../../../components/Checkbox";

type TreeTasksViewProps = {

}

const TreeTasksView: React.FC<TreeTasksViewProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translate = t;

  return (
    <Card component={Paper} elevation={3} sx={{ m: 2, p: 2, pt: 0 }}>

      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

        <h1>{translate("label:myapplications.myApp")}</h1>

      </Box>
      

      <TreeTable value={store.data} paginator rows={10} resizableColumns rowsPerPageOptions={[10, 20, 50]} tableStyle={{ minWidth: '50rem' }}>
        <Column style={{ width: 100 }} body={(data) => {
          return <Box display={"flex"} alignItems={"center"}>
            <StyledRouterLink to={`/user/application/addedit?id=${data.id}`}>
              <Typography
              >
                {data.number}
              </Typography>
            </StyledRouterLink>
          </Box>
        }} field="application_number" header={translate("label:myapplications.number")}></Column>
        <Column style={{ width: 150 }} body={(data) => {
          return <Chip size="small" label={data?.status} />
        }} field="status_idNavName" header={translate("label:myapplications.status")}></Column>
        <Column body={(data) => {
          return <div>{data?.address}<br /></div>
        }} field="address" header={translate("label:myapplications.address")}></Column>
        <Column body={(data) => {
          return <div>{data?.full_name}<br /></div>
        }} field="full_name" header={translate("label:myapplications.full_name")}></Column>
        <Column body={(data) => {
          return <div>{data?.total_sum}<br /></div>
        }} field="total_sum" header={translate("label:myapplications.total_sum")}></Column>
      </TreeTable>
    </Card>
  );

})
const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`


export default TreeTasksView;