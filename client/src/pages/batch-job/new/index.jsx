import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const NewBatchJob = () => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchBatchDetails = async (batchId) => {
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

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/batch/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      alert(responseData.message);
      reset();
    } catch (err) {
      console.error("Error submitting batch job:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-violet-300 p-4">
      <div className="bg-white shadow-lg rounded-md w-full max-w-2xl p-10">
        <h1 className="mb-6 text-2xl font-bold text-violet-600 text-center">
          New Batch Job
        </h1>

        <div className="">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-8">
            <input
              {...register("batchName")}
              placeholder="Batch Name"
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
              required
            />
            <input
              {...register("batchId")}
              placeholder="Batch ID"
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
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
              <option value="active">Active</option>
              <option value="onIce">On Ice</option>
              <option value="disabled">Disabled</option>
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
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewBatchJob;
