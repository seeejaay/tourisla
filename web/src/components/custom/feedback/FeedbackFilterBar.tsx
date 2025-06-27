import { feedbackTypes } from "@/app/static/feedback/feedbackFields";

type FeedbackFilterBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function FeedbackFilterBar({ value, onChange }: FeedbackFilterBarProps) {
  return (
    <div className="flex gap-2 mb-4">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="p-2 border rounded">
        {feedbackTypes.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>
  );
}
