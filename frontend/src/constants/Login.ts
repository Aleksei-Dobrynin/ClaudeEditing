export type Login = {
  Username: string;
  Password: string;
};

export type ChangePassword = {
  Username: string;
  CurrentPassword: string;
  NewPassword: string;
};

export type ForgotPassword = {
  Email: string;
};

