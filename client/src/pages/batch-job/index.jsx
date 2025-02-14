// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import BatchHistoryDrawer from "../../components/BatchHistoryDrawer";

// const BatchJob = () => {
//   const [mode, setMode] = useState("create");
//   const [batchList, setBatchList] = useState([]);
//   const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
//   // History data state; in production, fetch from backend.
//   const [historyData, setHistoryData] = useState({
//     batchName: "",
//     lastRunTime: "",
//     timeTaken: "",
//     finishTime: "",
//     lastRunStatus: "",
//     lastRunLog: ""
//   });
//   const { register, handleSubmit, reset, setValue } = useForm();

//   // When mode is "edit", fetch list of batches from the backend
//   useEffect(() => {
//     const fetchBatches = async () => {
//       if (mode === "edit") {
//         try {
//           const res = await fetch("http://127.0.0.1:8080/api/batch/all");
//           const data = await res.json();
//           setBatchList(data);
//         } catch (err) {
//           console.error("Error fetching batches:", err);
//         }
//       }
//     };
//     reset();
//     fetchBatches();
//   }, [mode]);

//   // Fetch details for the selected batch and auto-fill form fields
//   const fetchBatchDetails = async (batchId) => {
//       try {
//         const res = await fetch(`http://127.0.0.1:8080/api/batch/${batchId}`);
//         const data = await res.json();
//         setValue("batchName", data.batchName);
//         setValue("batchId", data.batchId);
//         setValue("cronExpression", data.cronExpression);
//         setValue("status", data.status);
//         setValue("executionMethod", data.executionMethod);
//                 // set history data; replace with real data from backend as needed
//         // setHistoryData({
//         //   batchName: data.batchName,
//         //   lastRunTime: data.lastRunTime || "2025-01-01 10:00 AM",
//         //   timeTaken: data.timeTaken || "2 mins",
//         //   finishTime: data.finishTime || "2025-01-01 10:02 AM",
//         //   lastRunStatus: data.lastRunStatus || "Success",
//         //   lastRunLog: data.lastRunLog || "No errors found."
//         // });
//       } catch (err) {
//         console.error("Error fetching batch details:", err);
//       }
//   };

//   const onSubmit = async (data) => {
//     const url =
//       mode === "create"
//         ? "http://127.0.0.1:8080/api/batch/create"
//         : "http://127.0.0.1:8080/api/batch/update";

//         try {
//           const res = await fetch(url, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data),
//           });

//           const responseData = await res.json();
//           alert(responseData.message);

//           reset();
//         } catch (err) {
//           console.error("Error submitting batch job:", err);
//           alert("An error occurred. Please try again.");
//         }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-violet-300 p-4">
//       <div className="bg-white shadow-lg rounded-md w-full max-w-4xl p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-violet-600 text-center">Batch Job</h1>
//           <button
//             onClick={() => setShowHistoryDrawer(true)}
//             className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
//           >
//             View History
//           </button>
//         </div>
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Left Panel: Mode Selection & Batch Selection (Edit Mode) */}
//           <div className="flex-1">
//             <select
//               onChange={(e) => setMode(e.target.value)}
//               className="w-full px-4 py-2 mb-4 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//               defaultValue={mode}
//             >
//               <option value="create">Create New Batch Job</option>
//               <option value="edit">Edit Batch Job</option>
//             </select>
//             {mode === "edit" && (
//               <select
//                 onChange={(e) => fetchBatchDetails(e.target.value)}
//                 className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//               >
//                 <option value="">Select a Batch Job</option>
//                 {batchList.map((batch) => (
//                   <option key={batch.batchId} value={batch.batchId}>
//                     {batch.batchName} ({batch.batchId})
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//           {/* Right Panel: Form */}
//           <div className="flex-1">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               {mode === "edit" ? (
//                 <>
//                   <input
//                     {...register("batchName")}
//                     placeholder="Batch Name"
//                     className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//                     required
//                   />
//                   <input
//                     {...register("batchId")}
//                     placeholder="Batch ID"
//                     className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none bg-gray-100"
//                     disabled
//                     required
//                   />
//                 </>
//               ) : (
//                 <>
//                   <input
//                     {...register("batchName")}
//                     placeholder="Batch Name"
//                     className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//                     required
//                   />
//                   <input
//                     {...register("batchId")}
//                     placeholder="Batch ID"
//                     className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//                     required
//                   />
//                 </>
//               )}
//               <input
//                 {...register("cronExpression")}
//                 placeholder="Cron Expression"
//                 className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//                 required
//               />
//               <select
//                 {...register("status")}
//                 className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//                 required
//               >
//                 <option value="">Select Status</option>
//                 <option value="active">Active</option>
//                 <option value="onIce">On Ice</option>
//                 <option value="disabled">Disabled</option>
//               </select>
//               <input
//                 {...register("executionMethod")}
//                 placeholder="Execution Method"
//                 className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="w-full p-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//       <BatchHistoryDrawer
//         open={showHistoryDrawer}
//         onClose={() => setShowHistoryDrawer(false)}
//         historyData={historyData}
//       />
//     </div>
//   );
// };

// export default BatchJob;

import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BatchHistoryDrawer from "../../components/BatchHistoryDrawer";

const BatchJobTable = () => {
  const [batchList, setBatchList] = useState([]);
  const [open, setOpen] = useState(false);
  const [historyBatchName, setHistoryBatchName] = useState("");

  const navigate = useNavigate();

  // Fetch all batches from the backend
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/api/batch/all");
        const data = await res.json();
        setBatchList(data);
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDrawer(record.batchName)}
            className="bg-gray-500 text-white rounded hover:bg-gray-700 transition-colors"
          >
            View History
          </Button>

          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.batchId)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const showDrawer = (batchName) => {
    setOpen(true);
    setHistoryBatchId(batchName);
  };

  const onClose = () => {
    setOpen(false);
    setHistoryBatchId("");
  };

  // Handle Edit
  const handleEdit = (batchId) => {
    navigate(`/batch/update/${batchId}`);
  };

  // Handle Create New Batch Job
  const handleCreate = () => {
    navigate("/batch/new"); // Redirect to the create page
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-violet-100 to-violet-300 p-4">
      <div className="bg-white shadow-lg rounded-md w-full max-w-screen-2xl mt-12 p-4">
        <div className="p-6">
        
          <Button
            icon={<PlusOutlined />}
            onClick={handleCreate}
            className="mb-4 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
          >
            Create New Batch Job
          </Button>

          <Table
            dataSource={batchList}
            columns={columns}
            rowKey="batchId"
            bordered
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
      <BatchHistoryDrawer
        open={open}
        onClose={onClose}
        batchName={historyBatchName}
      />
    </div>
  );
};

export default BatchJobTable;
