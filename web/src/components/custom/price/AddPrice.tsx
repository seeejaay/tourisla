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
      className=" p-8 space-y-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-extrabold text-[#1c5461] mb-2">
        Add New Price
      </h2>

      {priceFields.map((field) => (
        <div key={field.name} className="mb-2">
          <label className="block text-sm font-semibold text-[#3e979f] mb-1">
            {field.label}
          </label>

          {field.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm text-[#51702c]">
              <input
                type="checkbox"
                name={field.name}
                checked={
                  formik.values[field.name as keyof PriceFormValues] as boolean
                }
                onChange={formik.handleChange}
                className="accent-[#3e979f] w-4 h-4"
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
              className="w-full border border-[#e6f7fa] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-gray-50"
            />
          )}

          {formik.touched[field.name as keyof PriceFormValues] &&
            formik.errors[field.name as keyof PriceFormValues] && (
              <p className="text-xs text-red-600 mt-1">
                {formik.errors[field.name as keyof PriceFormValues]}
              </p>
            )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-4 py-2 rounded-lg w-full transition-colors"
      >
        Submit
      </button>

      {successMsg && (
        <p className="text-green-600 text-center mt-2">{successMsg}</p>
      )}
    </form>
  );
}
