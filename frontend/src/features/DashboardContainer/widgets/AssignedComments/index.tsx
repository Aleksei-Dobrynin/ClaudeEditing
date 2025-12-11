import { FC, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { dashboardStore } from "../../stores/dashboard/DashboardStore";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";

const AssignedCommentsBlock: FC = observer(() => {
  useEffect(() => {
    dashboardStore.loadAssignedComments();
  }, []);

  if (!dashboardStore.assignedComments.length) return null;

  return (
    <Card
      sx={{
        mb: 3,
        backgroundColor: "#fff8e1",
        border: "1px solid #ffecb3",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Комментарии, требующие вашего действия
        </Typography>

        {dashboardStore.assignedComments.map((c) => (
          <Box
            key={c.id}
            sx={{
              mb: 2,
              p: 1.5,
              borderLeft: `5px solid ${c.button_color || "#1976d2"}`,
              backgroundColor: `${c.button_color}20`,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {c.comment}
            </Typography>

            {c.button_label && c.is_completed == false && <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                sx={{
                  backgroundColor: c.button_color,
                  "&:hover": { backgroundColor: c.button_color },
                }}
                onClick={() => dashboardStore.completeComment(c.id)}
              >
                {c.button_label}
              </Button>
            </Box>}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
});

export default AssignedCommentsBlock;
