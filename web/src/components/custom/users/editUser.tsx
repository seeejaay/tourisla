import { useState } from "react";
import { User } from "../users/columns";

import { Button } from "@/components/ui/button";

export default function EditUser({
  user,
  onSave,
  onCancel,
}: {
  user: User;
  onSave: (updatedUser: User) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 px-8 py-6 bg-white  max-w-lg "
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
          Name
        </span>
        <span className="text-2xl text-zinc-900 font-bold">
          {user.first_name} {user.last_name}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
          Email
        </span>
        <span className="text-zinc-900 text-base break-all">{user.email}</span>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="role"
          className="text-xs text-zinc-500 uppercase tracking-widest font-semibold"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className="px-4 py-2 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        >
          <option value="Tourist">Tourist</option>
          <option value="Tour Guide">Tour Guide</option>
          <option value="Tour Operator">Tour Operator</option>
          <option value="Admin">Admin</option>
          <option value="Cultural Director">Cultural Director</option>
          <option value="Tourism Officer">Tourism Officer</option>
          <option value="Tourism Staff">Tourism Staff</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="status"
          className="text-xs text-zinc-500 uppercase tracking-widest font-semibold"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="px-4 py-2 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-4 pt-6 justify-end">
        <Button
          type="submit"
          variant="default"
          className="px-8 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          Save
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="px-8 py-2 rounded-lg font-semibold hover:bg-red-700 transition focus:outline-none"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
