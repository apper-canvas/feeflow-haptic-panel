import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    paid: { variant: "success", label: "Paid" },
    partial: { variant: "warning", label: "Partial" },
    unpaid: { variant: "error", label: "Unpaid" },
    pending: { variant: "warning", label: "Pending" },
    completed: { variant: "success", label: "Completed" },
    failed: { variant: "error", label: "Failed" },
    active: { variant: "success", label: "Active" },
    inactive: { variant: "error", label: "Inactive" },
    overdue: { variant: "error", label: "Overdue" }
  };

  const config = statusConfig[status] || { variant: "default", label: status };

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;