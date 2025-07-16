import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Grid, Paper } from "@mui/material";
import CustomButton from "components/Button";
import CustomTextField from "components/TextField";
import MaskedTextField from "components/MaskedTextField"; // Добавляем импорт MaskedTextField
import { observer } from "mobx-react";
import store from "./store";
import { useNavigate } from "react-router-dom";
import Employee_contactListView from "features/employee_contact/employee_contactListView";

const ChangePassword = observer(() => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Передаем функцию навигации в store
    store.setNavigateFunction(navigate);
    // Загружаем данные пользователя при монтировании компонента
    (async () => {
      await store.getEmployeeByToken();
    })();
    
    // Очистка при размонтировании
    return () => {
      store.clearStore();
    };
  }, [navigate]);

  return (
    <Container>
      <Paper style={{ padding: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h2>{translate("label:ChangeUserName:title")}</h2>
          </Grid>

          <Grid item md={12} xs={12}>
            <CustomTextField
              name="last_name"
              label={translate("label:ChangeUserName:newLastName")}
              id="last_name"
              helperText={store.touched.last_name ? store.errors.last_name : ""}
              error={!!store.errors.last_name && !!store.touched.last_name}
              onChange={(event) => store.handleChange(event)}
              onBlur={() => store.handleBlur("last_name")}
              value={store.last_name}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              id="first_name"
              label={translate("label:ChangeUserName:newName")}
              name="first_name"
              helperText={store.touched.first_name ? store.errors.first_name : ""}
              error={!!store.errors.first_name && !!store.touched.first_name}
              onChange={(event) => store.handleChange(event)}
              onBlur={() => store.handleBlur("first_name")}
              value={store.first_name}
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <CustomTextField
              name="second_name"
              label={translate("label:ChangeUserName:newSecondName")}
              id="second_name"
              helperText={store.touched.second_name ? store.errors.second_name : ""}
              error={!!store.errors.second_name && !!store.touched.second_name}
              onChange={(event) => store.handleChange(event)}
              onBlur={() => store.handleBlur("second_name")}
              value={store.second_name}
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <MaskedTextField
              name="pin"
              label={translate("label:ChangeUserName:newPin")}
              id="pin"
              mask="00000000000000"
              helperText={store.touched.pin ? store.errors.pin : ""}
              error={!!store.errors.pin && !!store.touched.pin}
              onChange={(event) => store.handleChange(event)}
              onBlur={() => store.handleBlur("pin")}
              value={store.pin}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              id="changeUserNameButton"
              onClick={() => {
                store.onChangeUserName();
              }}
            >
              {translate("label:ChangeUserName:changeName")}
            </CustomButton>
          </Grid>
        </Grid>
        
        <Grid container spacing={3} style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <h2>{translate("label:ChangePassword:title")}</h2>
          </Grid>
          
          <Grid item xs={12}>
            <CustomTextField
              id="CurrentPassword"
              label={translate("label:ChangePassword:currentPassword")}
              type="password"
              name="CurrentPassword"
              helperText={store.touched.CurrentPassword ? store.errors.CurrentPassword : ""}
              error={!!store.errors.CurrentPassword && !!store.touched.CurrentPassword}
              onChange={(event) => store.handleChange(event)}
              onBlur={() => store.handleBlur("CurrentPassword")}
              value={store.CurrentPassword}
            />
          </Grid>
          
          <Grid item md={12} xs={12}>
            <CustomTextField
              name="NewPassword"
              label={translate("label:ChangePassword:newPassword")}
              type="password"
              id="NewPassword"
              helperText={store.touched.NewPassword ? store.errors.NewPassword : ""}
              error={!!store.errors.NewPassword && !!store.touched.NewPassword}
              onChange={(event) => store.handleChange(event)}
              onBlur={() => store.handleBlur("NewPassword")}
              value={store.NewPassword}
            />
          </Grid>
          
          <Grid item md={12} xs={12}>
            <CustomTextField
              name="ConfirmPassword"
              label={translate("label:ChangePassword:confirmPassword")}
              type="password"
              id="ConfirmPassword"
              helperText={store.touched.ConfirmPassword ? store.errors.ConfirmPassword : ""}
              error={!!store.errors.ConfirmPassword && !!store.touched.ConfirmPassword}
              onChange={(event) => store.handleChange(event)}
              onBlur={() => store.handleBlur("ConfirmPassword")}
              value={store.ConfirmPassword}
            />
          </Grid>
          
          <Grid item xs={12}>
            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              id="authorizationSignInButton"
              onClick={() => {
                store.onChangePassword();
              }}
            >
              {translate("label:ChangePassword:changePassword")}
            </CustomButton>
          </Grid>
        </Grid>
        
        <Employee_contactListView
          idMain={store.curentEmployeeId} 
          isMyContacts 
          myGuid={store.employeeGuid} 
        />
      </Paper>
    </Container>
  );
});

export default ChangePassword;