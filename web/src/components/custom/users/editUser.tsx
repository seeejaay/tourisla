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
      className="space-y-7 px-0 py-0 max-w-lg w-full"
    >
      <div className="bg-white  p-6 space-y-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#3e979f] uppercase tracking-widest font-semibold">
            Name
          </span>
          <span className="text-2xl text-[#1c5461] font-bold">
            {user.first_name} {user.last_name}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#3e979f] uppercase tracking-widest font-semibold">
            Email
          </span>
          <span className="text-[#1c5461] text-base break-all">
            {user.email}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="role"
            className="text-xs text-[#3e979f] uppercase tracking-widest font-semibold"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-[#e6f7fa] bg-[#f8fcfd] text-[#1c5461] focus:outline-none focus:ring-2 focus:ring-[#3e979f] transition"
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
            className="text-xs text-[#3e979f] uppercase tracking-widest font-semibold"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-[#e6f7fa] bg-[#f8fcfd] text-[#1c5461] focus:outline-none focus:ring-2 focus:ring-[#3e979f] transition"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4 justify-end">
          <Button
            type="submit"
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-8 py-2 rounded-lg shadow"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-[#e6f7fa] text-[#1c5461] font-semibold px-8 py-2 rounded-lg"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
