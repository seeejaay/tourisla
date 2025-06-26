import type { VisitorLog } from "@/app/(User)/profile/[id]/attraction-history/page";

interface ViewCardProps {
  log: VisitorLog;
  spotName: string;
  onClick: () => void;
  onFeedback: () => void;
  feedbackGiven?: boolean;
}

export const ViewCard: React.FC<ViewCardProps> = ({
  log,
  spotName,
  onClick,
  onFeedback,
  feedbackGiven = false,
}) => (
  <div className="bg-white shadow rounded-lg mb-4 transition hover:shadow-lg">
    <div className="p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold text-lg">{spotName}</div>
        <div className="font-semibold">
          Visit Date: {new Date(log.visit_date).toLocaleDateString()}
        </div>
        <div className="text-gray-600 text-sm">
          Unique Code: <span className="font-mono">{log.unique_code}</span>
        </div>
        <div className="text-gray-600 text-sm">
          Registration Date: {new Date(log.registration_date).toLocaleDateString()}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            onClick={onClick}
            type="button"
          >
            View Details
          </button>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={onFeedback}
            disabled={feedbackGiven}
          >
            {feedbackGiven ? "Feedback Submitted" : "Leave Feedback"}
          </button>
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