import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm } from "antd";
import {
  SyncOutlined,
  EditOutlined,
  HistoryOutlined,
  PlusOutlined,
  VerticalLeftOutlined,
  StopOutlined,
} from "@ant-design/icons";
import BatchHistoryDrawer from "../../components/BatchJob/BatchHistoryDrawer";
import CreateBatchModal from "../../components/BatchJob/CreateBatchModal";
import UpdateBatchModal from "../../components/BatchJob/UpdateBatchModal";

const BatchJobTable = () => {
  const [batchList, setBatchList] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [historyBatchName, setHistoryBatchName] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [batchIdForUpdate, setBatchIdForUpdate] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all batches from the backend
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8080/api/batch/all");
      const data = await res.json();
      setBatchList(data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Define table columns
  const columns = [
    {
      title: "Batch ID",
      dataIndex: "batchId",
      key: "batchId",
    },
    {
      title: "Batch Name",
      dataIndex: "batchName",
      key: "batchName",
    },
    {
      title: "Cron Expression",
      dataIndex: "cronExpression",
      key: "cronExpression",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Execution Method",
      dataIndex: "executionMethod",
      key: "executionMethod",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (lastUpdated) =>
        lastUpdated ? new Date(lastUpdated).toLocaleString() : "N/A",
    },
    {
      title: "Latest Execution Status",
      dataIndex: "latestExecutionStatus",
      key: "latestExecutionStatus",
      render: (latestExecutionStatus) => latestExecutionStatus || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.batchId)}
          />

          <Popconfirm
            title="Start Job"
            description="Are you sure you want to start this job?"
            onConfirm={() => handleStartBatch(record.batchId)}
          >
            <Button
              icon={<VerticalLeftOutlined />}
              className="bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
            />
          </Popconfirm>

          <Popconfirm
            title="Stop Job"
            description="Are you sure you want to stop this job?"
            onConfirm={() => handleStopBatch(record.batchId)}
          >
            <Button
              icon={<StopOutlined />}
              className="bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
            />
          </Popconfirm>

          <Button
            icon={<HistoryOutlined />}
            onClick={() => showDrawer(record.batchName)}
            className="bg-gray-500 text-white rounded hover:bg-gray-700 transition-colors"
          />
        </Space>
      ),
    },
  ];

  const showDrawer = (batchName) => {
    setOpenDrawer(true);
    setHistoryBatchName(batchName);
  };

  const onClose = () => {
    setOpenDrawer(false);
    setHistoryBatchName("");
  };

  const handleEdit = (batchId) => {
    setOpenUpdateModal(true);
    setBatchIdForUpdate(batchId);
  };

  const handleStartBatch = async (batchId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/batch/${batchId}/start`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Error starting job:", err);
      alert("Failed to stop job");
    }
  };

  const handleStopBatch = async (batchId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/batch/${batchId}/stop`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Error stopping job:", err);
      alert("Failed to stop job");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-violet-100 to-violet-300 p-4">
      <div className="bg-white shadow-lg rounded-md w-full max-w-screen-2xl mt-12 p-4">
        <div className="p-6">
          <Space className="mb-4">
            <Button
              icon={<PlusOutlined />}
              onClick={() => setOpenCreateModal(true)}
              className="bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
            />

            <Button
              icon={<SyncOutlined />}
              onClick={fetchBatches}
              className="bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            />
          </Space>

          <div className="overflow-x-auto">
            <Table
              dataSource={batchList}
              columns={columns}
              rowKey="batchId"
              bordered
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <BatchHistoryDrawer
        open={openDrawer}
        onClose={onClose}
        batchName={historyBatchName}
      />

      <CreateBatchModal open={openCreateModal} setOpen={setOpenCreateModal} />

      <UpdateBatchModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        batchId={batchIdForUpdate}
      />
    </div>
  );
};

export default BatchJobTable;
