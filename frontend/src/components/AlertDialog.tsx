import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import MainStore from './../MainStore';
import { observer } from "mobx-react"
import styled from 'styled-components';
import CustomButton from './Button';
import { useTranslation } from 'react-i18next';

const AlertDialog = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Dialog onClose={MainStore.onCloseAlert}
      aria-labelledby="customized-dialog-title"
      fullWidth={true}
      maxWidth={'sm'}
      open={MainStore.alert.messages.length > 0}
    >
      <CloseModal onClick={MainStore.onCloseAlert} />
      <ContentWrapper>
        <Header >
          <MainText>{MainStore.alert.titles[0]}</MainText>
        </Header>
        <Body>
          <div dangerouslySetInnerHTML={{ __html: MainStore.alert.messages[0] }} />
        </Body>

        <ButtonWrapper>
          <CustomButton
            name="AlertButtonYes"
            color="primary"
            variant="contained"
            onClick={MainStore.onCloseAlert}>
            {translate('ok')}
          </CustomButton>
        </ButtonWrapper>
      </ContentWrapper>
    </Dialog>
  );
})

export default AlertDialog


const MainText = styled.h1`
  margin: 20px;
`


const ButtonWrapper = styled.div`
  margin: 10px;
  margin-left: 30px
`
const ContentWrapper = styled(MuiDialogContent)`
  margin: 20px;
`
const Header = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  line-height: 36px;
  text-align: left;
  color: var(--colorNeutralForeground1);
  margin: 0 0 30px 0;
`;

const Body = styled.div`
  margin: 30px;
`;
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
