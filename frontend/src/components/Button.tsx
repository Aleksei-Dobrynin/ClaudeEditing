import React, { FC } from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";

type CustomButtonProps = {
  text?: string;
  variant?: "text" | "outlined" | "contained";
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "submit" | "reset" | "button";
  href?: string;
  disabled?: boolean;
  children?: any;
  size?: "small" | "medium";
  style?: any;
  color?: any;
  customColor?: string;
  ref?: any;
  name?: string;
  sx?: any;
  id?: string;
  fullWidth?: boolean;
  endIcon?: any;
  startIcon?: any;
  disableRipple?: boolean;
};

const CustomButton: FC<CustomButtonProps> = (props) => {
  const { text, ...rest } = props;

  return <StyledButton data-testid={props.id} {...rest}>{props.children || props.text}</StyledButton>;
};

export default CustomButton;

const StyledButton = styled(Button)<{customColor?: string}>`
  font-family: Roboto, sans-serif !important;
  font-weight: ${(props) => (props.variant === "contained" ? 400 : 500)} !important;
  line-height: 20px !important;
  text-transform: none !important;
  box-shadow: none !important;
  height: 34px; 
    ${(props) =>
            props.variant === "contained" &&
            !props.disabled &&
            props.customColor &&
            `background-color: ${props.customColor} !important;`}
  ${(props) =>
    props.variant === "contained" &&
    !props.disabled &&
    ((props.color === "primary" || !props.color) && !props.customColor) &&
    "background: linear-gradient(180deg, #6692d5 58.33%, #3685cb  100%) !important;"}

  &:hover {
    text-decoration: ${(props) => (props.variant ? "none" : "underline")} !important;
  }
`;
