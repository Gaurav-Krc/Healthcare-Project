import React, { useState, useEffect } from "react";
import { Table, Drawer, Descriptions } from "antd";


const BatchHistoryDrawer = ({ open, onClose, batchName }) => {
  const [historyData, setHistoryData] = useState(null);

  // Fetch history data when the drawer is opened
  useEffect(() => {
    if (open && batchName) {
      fetch(`http://127.0.0.1:8080/api/batch/executions?batchName=${batchName}`)
        .then((res) => res.json())
        .then((data) => setHistoryData(data))
        .catch((err) => console.error("Error fetching history data:", err));
    }
  }, [open, batchName]);

  const columns = [
    {
      title: "Job Execution ID",
      dataIndex: "jobExecutionId",
      key: "jobName",
    },
    {
      title: "Job Instance ID",
      dataIndex: "jobInstanceId",
      key: "jobName",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => new Date(startTime).toLocaleString(),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime) =>
        endTime ? new Date(endTime).toLocaleString() : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Exit Code",
      dataIndex: "exitCode",
      key: "exitCode",
    },
    {
      title: "Exit Message",
      dataIndex: "exitMessage",
      key: "exitMessage",
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (lastUpdated) => new Date(lastUpdated).toLocaleString(),
    }
  ];

  return (
    <Drawer
      title="Batch Job History"
      placement="bottom"
      height={600}
      onClose={onClose}
      open={open}
      destroyOnClose
    >

      <Table
        dataSource={historyData}
        columns={columns}
        rowKey="jobExecutionId"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </Drawer>
  );
};

export default BatchHistoryDrawer;
