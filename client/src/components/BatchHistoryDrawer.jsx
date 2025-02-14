import React, {useState, useEffect} from "react";
import { Drawer, Descriptions } from "antd";

const BatchHistoryDrawer = ({ open, onClose, batchName }) => {
  const [historyData, setHistoryData] = useState(null);

  // Fetch history data when the drawer is opened
  useEffect(() => {
    if (open && batchName) {
      fetch(`http://127.0.0.1:8080/api/batch/history/${batchName}`)
        .then((res) => res.json())
        .then((data) => setHistoryData(data))
        .catch((err) => console.error("Error fetching history data:", err));
    }
  }, [open, batchName]);

  return (
    <Drawer
      title="Batch Job History"
      placement="bottom"
      height={450}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {historyData ? (
        <>
          <Descriptions
            bordered
            column={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 5,
            }}
            size="small"
          >
            <Descriptions.Item label="Batch Name">
              {historyData.batchName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Run Time">
              {historyData.lastRunTime || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Time Taken">
              {historyData.timeTaken || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Finish Time">
              {historyData.finishTime || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Run Status">
              {historyData.lastRunStatus || "N/A"}
            </Descriptions.Item>
          </Descriptions>
          <div className="mt-4">
            <p className="font-bold">Last Run Log:</p>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {historyData.lastRunLog || "N/A"}
            </p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Drawer>
  );
};

export default BatchHistoryDrawer;
