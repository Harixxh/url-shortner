import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card bg-red-50 border border-red-200">
      <div className="flex items-start gap-4">
        <AlertCircle className="text-error flex-shrink-0 mt-1" size={20} />
        <div className="flex-1">
          <h3 className="font-medium text-error mb-1">Error</h3>
          <p className="text-sm text-gray-700 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm font-medium text-error hover:text-red-600"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
