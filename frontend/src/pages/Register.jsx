import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast} from 'react-toastify';

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: data.email,
          fullName: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
          password: data.password,
        },
        { withCredentials: true }
      );
      console.log("Registration successful:", res.data);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      reset(); // Clear the form
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-gray-800 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Join GPT 2.0 and explore AI conversations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              {...register("firstName", { required: "First name is required" })}
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              {...register("lastName", { required: "Last name is required" })}
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-black font-semibold transition"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
