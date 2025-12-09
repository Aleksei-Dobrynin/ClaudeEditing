import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import dayjs from "dayjs";

type ProjectsTableProps = {
  children?: React.ReactNode;
  id_application: number;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
  }, [store.errorcustomer_id, store.errorarch_object_id]);

  return (
    <Container maxWidth="xl" style={{ marginTop: 10 }}>
      <Grid container>
        <Paper elevation={7} variant="outlined">
          <Card>
            <CardHeader
              title={
                <>
                  <span id="Application_TitleName">
                    {`${translate("label:ApplicationAddEditView.entityTitle")} #${store.number}`}
                  </span>
                </>
              }
            />
            <Divider />
            <CardContent>
              <Grid container>
                <Grid item md={12} xs={12}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {store.customer_id > 0 && (
                      <>
                        {`${translate("label:ApplicationAddEditView.Customer_name")}: `}
                        <span style={{ fontWeight: 'normal' }}>
                          {store.Customer?.full_name}
                        </span>
                      </>
                    )}
                  </Typography><br />
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {store.customer_id > 0 && (
                      <>
                        {`${translate("label:ApplicationAddEditView.Customer_contact")}: `}
                        {store.Customer?.sms_1 && <div style={{ fontWeight: 'normal' }}>{`${translate("label:CustomerAddEditView.sms_1")}: ${store.Customer?.sms_1}`}</div>}
                        {store.Customer?.sms_2 && <div style={{ fontWeight: 'normal' }}>{`${translate("label:CustomerAddEditView.sms_2")}: ${store.Customer?.sms_2}`}</div>}
                        {store.Customer?.email_1 && <div style={{ fontWeight: 'normal' }}>{`${translate("label:CustomerAddEditView.email_1")}: ${store.Customer?.email_1}`}</div>}
                        {store.Customer?.email_2 && <div style={{ fontWeight: 'normal' }}>{`${translate("label:CustomerAddEditView.email_2")}: ${store.Customer?.email_2}`}</div>}
                      </>
                    )}
                  </Typography><br />


                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {store.service_id > 0 && (
                      <>
                        {`${translate("label:ApplicationAddEditView.Service_name")}: `}
                        <span style={{ fontWeight: 'normal' }}>
                          {store.Services.find(service => service.id === store.service_id)?.name}
                        </span>
                      </>
                    )}
                  </Typography><br />

                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {store.work_description?.length > 0 && (
                      <>
                        {`${translate("label:ApplicationAddEditView.work_description")}: `}
                        <span style={{ fontWeight: 'normal' }}>
                          {store.work_description}
                        </span>
                      </>
                    )}
                  </Typography><br />

                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {store.deadline?.length > 0 && (
                      <>
                        {`${translate("label:ApplicationAddEditView.deadline")}: `}
                        <span style={{ fontWeight: 'normal' }}>
                          {dayjs(store.deadline).format('DD.MM.YYYY')}
                        </span>
                      </>
                    )}
                  </Typography><br />

                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {store.status_id > 0 && (
                      <>
                        {`${translate("label:ApplicationAddEditView.Status")}: `}
                        <span style={{ fontWeight: 'normal' }}>
                          {store.Statuses.find(status => status.id === store.status_id)?.name}
                        </span>
                      </>
                    )}
                  </Typography><br />

                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {`${translate("label:ApplicationAddEditView.Object_address")}: `}
                    <span style={{ fontWeight: 'normal' }}>
                      {store.ArchObjects.map(x => x.address).filter(x => x).join(", ")}
                    </span>
                    <br />
                    {`${translate("label:ApplicationAddEditView.Object_eni")}: `}
                    <span style={{ fontWeight: 'normal' }}>
                      {store.ArchObjects.map(x => x.identifier).filter(x => x).join(", ")}
                    </span>
                    <br />
                    {`${translate("label:ApplicationAddEditView.Object_district")}: `}
                    <span style={{ fontWeight: 'normal' }}>
                      {store.ArchObjects.map(x => x.district_name).filter(x => x).join(", ")}
                    </span>
                  </Typography><br />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Paper>
      </Grid>
    </Container>
  );
});

export default BaseView;