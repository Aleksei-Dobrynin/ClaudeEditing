import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { observer } from "mobx-react";
import { icon } from "leaflet";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
type Props = {
  icon: React.ReactNode,
  count: number,
  onClick?: () => void,
  circular?: React.ReactNode,
  stateCircular?: boolean,
}


function notificationsLabel(count: number) {
  if (count === 0) {
    return 'no notifications';
  }
  if (count > 99) {
    return 'more than 99 notifications';
  }
  return `${count} notifications`;
}

const BadgeButton: React.FC<Props> = observer((props) => {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setLoad(props.stateCircular);
  }, [props.count, props.stateCircular]);

  return (
    <div>
      {props.circular && props.stateCircular ? (
        <>
          {load ? props.circular
            : (
              <IconButton onClick={props.onClick} aria-label={notificationsLabel(props.count)}>
                <Badge badgeContent={props.count} sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#FF652F"
                  }
                }} color="secondary">
                  {props.icon}
                </Badge>
              </IconButton>
            )}
        </>
      ) :
        <IconButton onClick={props.onClick} aria-label={notificationsLabel(props.count)}>
          <Badge badgeContent={props.count} sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#FF652F"
                  }
                }}  color="secondary">
            {props.icon}
          </Badge>
        </IconButton>}
    </div>
  );
});

export default BadgeButton;