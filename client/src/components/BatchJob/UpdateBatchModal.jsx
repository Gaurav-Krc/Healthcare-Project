import React, { useEffect } from "react";
import { Modal } from "antd";
import { useForm } from "react-hook-form";

const UpdateBatchModal = ({ open, setOpen, batchId }) => {
  const { register, handleSubmit, setValue } = useForm();

  const fetchBatches = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/batch/${batchId}`);
      const data = await res.json();
      setValue("batchName", data.batchName);
      setValue("batchId", data.batchId);
      setValue("cronExpression", data.cronExpression);
      setValue("status", data.status);
      setValue("executionMethod", data.executionMethod);
    } catch (err) {
      console.error("Error fetching batch details:", err);
    }
  };

  useEffect(() => {
    if (!batchId) return;
    fetchBatches();
  }, [batchId]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/batch/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      alert(responseData.message);
      setOpen(false);
    } catch (err) {
      console.error("Error submitting batch job:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      className="bg-white max-w-2xl"
      footer
    >
      <>
        <h1 className="mb-6 text-2xl font-bold text-violet-600 text-center">
          Update Batch Job
        </h1>

        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6">
            <input
              {...register("batchName")}
              placeholder="Batch Name"
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
              required
            />
            <input
              {...register("batchId")}
              placeholder="Batch ID"
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none bg-gray-100"
              disabled
              required
            />

            <input
              {...register("cronExpression")}
              placeholder="Cron Expression"
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
              required
            />
            <select
              {...register("status")}
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
              required
            >
              <option value="">Select Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_ICE">On Ice</option>
            </select>
            <input
              {...register("executionMethod")}
              placeholder="Execution Method"
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
            >
              Update
            </button>
          </form>
        </div>
      </>
    </Modal>
  );
};
export default UpdateBatchModal;
