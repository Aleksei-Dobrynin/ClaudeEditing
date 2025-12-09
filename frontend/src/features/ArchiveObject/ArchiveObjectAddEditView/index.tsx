import React, { FC, useEffect } from "react";
import { default as ArchiveObjectAddEditBaseView } from "./base";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Box,
  Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import CustomButton from "components/Button";
import MtmTabs from "./mtmTabs";

type ArchiveObjectProps = {
  isReadOnly?: boolean;
};

const ArchiveObjectAddEditView: FC<ArchiveObjectProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    if ((id != null) &&
      (id !== "") &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id));
      store.isReadOnly = props.isReadOnly || false;
    } else {
      navigate("/error-404");
    }
    return () => {
      store.clearStore();
    };
  }, [props.isReadOnly]);

  return (
    <ArchiveObjectAddEditBaseView {...props}>
      <br/>
      {store.id > 0 && <MtmTabs isReadOnly={props.isReadOnly} />}
    </ArchiveObjectAddEditBaseView>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ArchiveObjectAddEditView;