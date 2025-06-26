import type { VisitorLog } from "@/app/(User)/profile/[id]/attraction-history/page";

interface ViewCardProps {
  log: VisitorLog;
  spotName: string;
  onClick: () => void;
}

export const ViewCard: React.FC<ViewCardProps> = ({ log, spotName, onClick }) => (
  <div
    className="bg-white shadow rounded-lg mb-4 cursor-pointer transition hover:shadow-lg"
    onClick={onClick}
  >
    <div className="p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold text-lg">
          {spotName}
        </div>
        <div className="font-semibold">
          Visit Date: {new Date(log.visit_date).toLocaleDateString()}
        </div>
        <div className="text-gray-600 text-sm">
          Unique Code: <span className="font-mono">{log.unique_code}</span>
        </div>
        <div className="text-gray-600 text-sm">
          Registration Date: {new Date(log.registration_date).toLocaleDateString()}
        </div>
      </div>
      <div>
        <img
          src={log.qr_code_url}
          alt="QR Code"
          className="w-16 h-16 object-contain border rounded"
        />
      </div>
    </div>
  </div>
);