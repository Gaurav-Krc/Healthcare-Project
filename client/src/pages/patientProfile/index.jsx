import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  name: z.string().max(50),
  age: z
    .string()
    .min(1, { message: "Minimun age is 1" })
    .refine((val) => Number(val) < 120, { message: "Unrealistic Age" }),
  gender: z.string(),
  contact: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits" })
    .refine(
      (val) => val.split("").every((char) => char >= "0" && char <= "9"),
      {
        message: "Phone number must contain only digits",
      }
    ),
  email: z.string().email(),
  password: z.string().min(8, { message: "Minimum length should be 8" }),
});

const PatientForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-violet-300 p-4">
      <div className="bg-white shadow-lg rounded-md w-full max-w-lg p-12 ">
        <h2 className="text-2xl font-bold text-violet-600 text-center mb-6">
          Patient Profile
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name")}
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 text-zinc-600 truncate border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
          </div>

          <div>
            <input
              {...register("age")}
              type="number"
              placeholder="Age"
              className="w-full px-4 py-2 text-zinc-600 border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
            {errors.age && (
              <div className="text-red-500 text-sm">{errors.age.message}</div>
            )}
          </div>

          <div>
            <select
              {...register("gender")}
              className="w-full px-4 py-2 border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none text-zinc-600"
              defaultValue=""
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <div className="text-red-500 text-sm">
                {errors.gender.message}
              </div>
            )}
          </div>

          <div>
            <input
              {...register("contact")}
              type="text"
              placeholder="Contact No."
              className="w-full px-4 py-2 text-zinc-600 border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
            {errors.contact && (
              <div className="text-red-500 text-sm">
                {errors.contact.message}
              </div>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 text-zinc-600 border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 text-zinc-600 border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-2.5 text-zinc-500 focus:outline-none">
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-2 px-4 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {isSubmitting ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
