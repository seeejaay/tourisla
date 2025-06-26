"use client";

import { useFormik } from "formik";
import { usePriceManager } from "@/hooks/usePriceManager";
import { priceFields } from "@/app/static/price/priceFields";
import { priceSchema } from "@/app/static/price/usePriceSchema";
import { useState } from "react";

interface PriceFormValues {
  amount: number;
  is_enabled: boolean;
  type: string;
}

export default function AddPrice() {
  const { addPrice, getPrice } = usePriceManager();
  const [successMsg, setSuccessMsg] = useState("");

  const formik = useFormik<PriceFormValues>({
    initialValues: {
      amount: 0,
      is_enabled: true,
      type: "",
    },
    validationSchema: priceSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addPrice(values.amount, values.is_enabled, values.type);
        await getPrice();
        setSuccessMsg("Price added successfully.");
        resetForm();
      } catch (err) {
        console.error("Add price error:", err);
        alert("Failed to add price.");
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full max-w-md"
    >
      <h2 className="text-xl font-bold text-gray-800">Add New Price</h2>

      {priceFields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium mb-1">
            {field.label}
          </label>

          {field.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name={field.name}
                checked={
                  formik.values[field.name as keyof PriceFormValues] as boolean
                }
                onChange={formik.handleChange}
                className="accent-blue-600"
              />
              {field.label}
            </label>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={
                formik.values[field.name as keyof PriceFormValues] as
                  | number
                  | string
              }
              onChange={formik.handleChange}
              placeholder={field.placeholder}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          {formik.touched[field.name as keyof PriceFormValues] &&
            formik.errors[field.name as keyof PriceFormValues] && (
              <p className="text-sm text-red-600 mt-1">
                {formik.errors[field.name as keyof PriceFormValues]}
              </p>
            )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        Submit
      </button>

      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
    </form>
  );
}
