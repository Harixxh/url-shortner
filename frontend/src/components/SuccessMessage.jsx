import { CheckCircle } from 'lucide-react';

export default function SuccessMessage({ message }) {
  return (
    <div className="card bg-green-50 border border-green-200">
      <div className="flex items-start gap-4">
        <CheckCircle className="text-success flex-shrink-0 mt-1" size={20} />
        <div className="flex-1">
          <p className="text-sm text-green-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
