import React, { FC } from "react";
import { observer } from "mobx-react";
import ApplicationListView from "../../Application/ApplicationListView";

const JournalApplicationListView: FC = observer((props) => {
  return (
    <ApplicationListView finPlan={false}  />
  );
});

export default JournalApplicationListView;