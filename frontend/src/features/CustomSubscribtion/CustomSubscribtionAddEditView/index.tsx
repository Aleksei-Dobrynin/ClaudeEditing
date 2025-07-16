import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import store from "../../CustomSubscribtion/CustomSubscribtionAddEditView/store";
import { useLocation } from "react-router";
import { Box } from "@mui/material";
// import CustomCheckbox from "../../../components/Checkbox";
import CustomButton from "../../../components/Button";
import CustomSubscribtionAddEditViewBase from "./base";
import { toJS } from "mobx";


type CustomSubscribtionProps = {
  forMe?: boolean;
};

const CustomSubscribtionAddEditView: FC<CustomSubscribtionProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    const loadData = async () => {
      if (id != null && id !== "" && !isNaN(Number(id.toString()))) {
        await store.doLoad(Number(id));
      } else {
        navigate("/error-404");
      }
    };

     loadData().then();

    return () => {
    };
  }, [id]);

  return (
    <CustomSubscribtionAddEditViewBase>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_CustomSubscribtionSaveButton"
              onClick={() => {
                store.onSaveClick((id: number) => {
                  store.clearStoreAll();
                  if (props.forMe){
                    navigate("/user/MyCustomSubscribtion");
                  } else
                  {
                    navigate("/user/CustomSubscribtion");
                  }
                });
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_CustomSubscribtionCancelButton"
              onClick={() => {
                store.clearStoreAll();
                if (props.forMe){
                  navigate("/user/MyCustomSubscribtion");
                } else
                {
                  navigate("/user/CustomSubscribtion");
                }
              }
              }
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </CustomSubscribtionAddEditViewBase>

  )
    ;
});


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default CustomSubscribtionAddEditView;
