import React, { FC, useEffect } from "react";
import { default as ApplicationAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import {
  Box,

} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';


type ApplicationProps = {
  id_application: number;
};

const ApplacationCard: FC<ApplicationProps> = observer((props) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const archObjectId = query.get("arch_object_id")
  useEffect(() => {
    if (props.id_application != null) {
      store.doLoad(props.id_application)
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])


  return (
    <>
      <ApplicationAddEditBaseView
        id_application={props.id_application}
      />
    </>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}



export default ApplacationCard