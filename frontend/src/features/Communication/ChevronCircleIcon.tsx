import { CSSProperties } from "react";
import styled from "styled-components";

interface ChevronCircleIconProps {
  position?: "top" | "left" | "right" | "bottom";
  style?: CSSProperties;
  outlinedColor?: string;
  chevronColor?: string;
}

const ChevronCircleIcon = (props: ChevronCircleIconProps) => {
  const {
    position = "top",
    outlinedColor = "var(--colorNeutralForeground2)",
    chevronColor = "var(--colorNeutralForeground2)",
  } = props;

  return (
    <StyledSvg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      position={position}
      {...props}
    >
      <circle cx="12" cy="12.5" r="11.5" fill="#F9FAFC" fill-opacity="0.4" stroke={outlinedColor} />
      <path d="M7 14.5L12 9.5L17 14.5" stroke={chevronColor} />
    </StyledSvg>
  );
};

export default ChevronCircleIcon;

const StyledSvg = styled.svg<{ position: ChevronCircleIconProps["position"] }>`
  transform: ${(props) =>
    props.position === "top"
      ? "rotate(0deg)"
      : props.position === "left"
      ? "rotate(-90deg)"
      : props.position === "right"
      ? "rotate(90deg)"
      : "rotate(180deg)"};
`;
