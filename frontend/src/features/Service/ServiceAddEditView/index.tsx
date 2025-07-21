import React, { FC, useEffect } from "react";
import { default as ServiceAddEditBaseView } from "./base";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import BaseFormLayout from "components/BaseFormLayout";
import MtmTabs from "./mtmTabs";

type ServiceProps = {};

const ServiceAddEditView: FC<ServiceProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    const loadData = async () => {
      if ((id != null) &&
        (id !== "") &&
        !isNaN(Number(id.toString()))) {
        await store.doLoad(Number(id));
      } else if (id === "0") {
        // Новая запись - загружаем только справочники
        await store.doLoad(0);
      } else {
        navigate("/error-404");
      }
    };
    
    loadData();
    
    return () => {
      store.clearStore();
    };
  }, [id, navigate]);

  const handleSave = async () => {
    await store.onSaveClick((savedId: number) => {
      navigate(`/user/Service/addedit?id=${savedId}`);
    });
  };

  const handleCancel = () => {
    navigate("/user/Service");
  };

  return (
    <BaseFormLayout
      title={translate('label:ServiceAddEditView.entityTitle')}
      subtitle={store.id > 0 ? `ID: ${store.id}` : translate('common:new')}
      onSave={handleSave}
      onCancel={handleCancel}
      loading={store.loading}
      error={store.error}
      success={store.saveSuccess}
      isDirty={store.isDirty}
      isValid={store.isValid}
      breadcrumbs={[
        { label: translate('common:home'), href: '/user' },
        { label: translate('label:ServiceListView.entityTitle'), href: '/user/Service' },
        { label: store.id > 0 ? translate('common:edit') : translate('common:create') }
      ]}
      infoMessage={store.id === 0 ? translate('form:createNewServiceInfo') : undefined}
    >
      <ServiceAddEditBaseView {...props}>
        {/* MTM Tabs - показываем только при редактировании */}
        {store.id > 0 && (
          <Box mt={3}>
            <MtmTabs />
          </Box>
        )}
      </ServiceAddEditBaseView>
    </BaseFormLayout>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ServiceAddEditView;