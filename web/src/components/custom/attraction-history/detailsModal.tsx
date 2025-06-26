import React from "react";
import type { VisitorLog } from "@/app/(User)/profile/[id]/attraction-history/page"; // Adjust path as needed

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  group: VisitorLog[];
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ open, onClose, group }) => {
  if (!open || !group) return null;
  const main = group[0];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred and semi-transparent background */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg z-10">
        {/* More visible close button */}
        <button
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl font-bold shadow hover:bg-red-600 transition"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">Visit Details</h2>
        <div className="mb-2">
          <b>Visit Date:</b> {new Date(main.visit_date).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <b>Unique Code:</b> <span className="font-mono">{main.unique_code}</span>
        </div>
        <div className="mb-2">
          <b>Registration Date:</b> {new Date(main.registration_date).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <b>Registration ID:</b> {main.registration_id}
        </div>
        <div className="mb-2">
          <b>Tourist Spot ID:</b> {main.tourist_spot_id}
        </div>
        <div className="mb-2">
          <b>QR Code:</b>
          <img src={main.qr_code_url} alt="QR Code" className="w-24 h-24 mt-2" />
        </div>
        <div className="mb-2 font-semibold">Group Members:</div>
        <ul>
          {group.map((member, idx) => (
            <li key={idx} className="ml-4 list-disc">
              {member.member_name} ({member.member_age}, {member.member_sex}) - {member.municipality}, {member.province}, {member.country} {member.is_foreign ? "(Foreign)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};