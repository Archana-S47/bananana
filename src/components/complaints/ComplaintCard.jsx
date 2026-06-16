import React from 'react';
import StatusBadge from '../ui/StatusBadge';

const ComplaintCard = ({ complaint, onEdit, onDelete, onView }) => {
  const { title, category, submittedAt, status, id } = complaint;
  
  // Requirement: Edit/Delete only for Pending complaints
  const isPending = status.toLowerCase() === 'pending';

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              {id}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
              {category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-50 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Created Date</span>
            <span className="text-sm font-medium text-slate-600">
              {new Date(submittedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <button 
            onClick={() => onView(complaint)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Action Buttons: Only for Pending Complaints */}
        {isPending && (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onEdit(complaint)}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="flex-1 rounded-lg border border-rose-100 bg-rose-50 py-2 text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all shadow-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
