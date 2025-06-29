import type { VisitorLog } from "@/app/(User)/profile/[id]/attraction-history/page";
import Image from "next/image";
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
  <div className="flex items-center justify-between gap-6 p-4">
    <div>
      <div className="font-bold text-lg text-[#1c5461]">{spotName}</div>
      <div className="font-semibold text-[#51702c]">
        Visit Date: {new Date(log.visit_date).toLocaleDateString()}
      </div>
      <div className="text-[#3e979f] text-sm">
        Unique Code: <span className="font-mono">{log.unique_code}</span>
      </div>
      <div className="text-[#3e979f] text-sm">
        Registration Date:{" "}
        {new Date(log.registration_date).toLocaleDateString()}
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          className="px-4 py-2 rounded-lg bg-[#3e979f] text-white font-semibold shadow hover:bg-[#1c5461] transition"
          onClick={onClick}
          type="button"
        >
          View Details
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
            feedbackGiven
              ? "bg-[#e6f7fa] text-[#51702c] cursor-not-allowed"
              : "bg-[#51702c] text-white hover:bg-[#3e979f] cursor-pointer"
          }`}
          onClick={onFeedback}
          disabled={feedbackGiven}
          type="button"
        >
          {feedbackGiven ? "Feedback Submitted" : "Leave Feedback"}
        </button>
      </div>
    </div>
    <div>
      <Image
        width={150}
        height={150}
        src={log.qr_code_url}
        alt="QR Code"
        className=" object-contain border-2 border-[#e6f7fa] rounded-lg bg-white shadow"
      />
    </div>
  </div>
);
export default ViewCard;
