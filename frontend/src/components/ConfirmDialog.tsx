import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import MuiDialogContent from "@mui/material/DialogContent";
import CustomTextField from "components/TextField_OLD";
import MainStore from "./../MainStore";
import CustomButton from "./Button";
import { useTranslation } from "react-i18next";

const ConfirmDialog = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const errorMessage = MainStore.confirm.errorMessage[0];
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
      setDeleteReason('');
  }, [MainStore.confirm.errorMessage.length > 0]);

  const handleConfirm = () => {
    if (deleteReason){
      MainStore.confirm.onCloseYes[0](deleteReason);
      return;
    }
    MainStore.confirm.onCloseYes[0]()
  };

  return (
    <Dialog
      onClose={MainStore.confirm.onCloseNo[0]}
      aria-labelledby="customized-dialog-title"
      fullWidth={true}
      id={"ConfirmDialog"}
      maxWidth={"xs"}
      open={MainStore.confirm.errorMessage.length > 0}
    >
      <CloseModal onClick={MainStore.confirm.onCloseNo[0]} />
      <ContentWrapper>
        <Header>
          <MainText dangerouslySetInnerHTML={{__html: errorMessage}}></MainText>
        </Header>
        <Body>{MainStore.confirm.bodies[0]}</Body>
        {MainStore.confirm.isDeleteReason[0]}
        {MainStore.confirm.isDeleteReason[0] && <CustomTextField
          label={translate("common:reasonForDelete")}
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          id='id_reasonForDelete'
          name='reasonForDelete'
        />}

        <ActionsWrapper>
          {MainStore.confirm.acceptBtn[0] && (
            <ButtonWrapper>
              <CustomButton
                name="AlertButtonYes"
                color={
                  MainStore.confirm.acceptBtnColor[0]
                    ? MainStore.confirm.acceptBtnColor[0]
                    : "primary"
                }
                variant="contained"
                id={"AlertButtonYes"}
                onClick={handleConfirm}
              >
                {MainStore.confirm.acceptBtn[0]}
              </CustomButton>
            </ButtonWrapper>
          )}
          {MainStore.confirm.cancelBtn[0] && (
            <ButtonWrapper>
              <CustomButton
                color={
                  MainStore.confirm.cancelBtnColor[0]
                    ? MainStore.confirm.cancelBtnColor[0]
                    : "error"
                }
                variant="contained"
                name="AlertButtonNo"
                id={"AlertButtonNo"}
                onClick={MainStore.confirm.onCloseNo[0]}
              >
                {MainStore.confirm.cancelBtn[0]}
              </CustomButton>
            </ButtonWrapper>
          )}
        </ActionsWrapper>
      </ContentWrapper>
    </Dialog>
  );
});

export default ConfirmDialog;

const MainText = styled.div`
  color: var(--colorNeutralForeground1);
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
`;

const ButtonWrapper = styled.div``;

const ContentWrapper = styled(MuiDialogContent)`
  margin: 20px;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 500;
  line-height: 36px;
  text-align: left;
  color: var(--colorNeutralForeground1);
`;

const Body = styled.div``;

const CloseModal = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 38px;
  right: 30px;
  width: 24px;
  height: 24px;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity ease 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 10px;
    display: block;
    width: 18px;
    height: 3px;
    background: var(--colorBrandForeground1);
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;
