import React, { useState } from 'react';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import StatusBadge from '../../components/ui/StatusBadge';

const SubmitComplaint = () => {
  const [submissions, setSubmissions] = useState([]);

  const handleSubmit = (data) => {
    const newSubmission = {
      ...data,
      id: `CMP-${Math.floor(Math.random() * 10000)}`,
      status: 'open',
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-950">Submit New Complaint</h1>
        <p className="text-slate-600">Report an issue to campus administration. All fields are required.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ComplaintForm onSubmit={handleSubmit} />
      </div>

      {submissions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Recent Submissions (Local State)</h2>
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{sub.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{sub.id}</p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block">Category</span>
                    <span className="text-slate-800 font-medium">{sub.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location</span>
                    <span className="text-slate-800 font-medium">{sub.location}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-sm block">Description</span>
                  <p className="text-slate-700 text-sm mt-1">{sub.description}</p>
                </div>

                <div className="pt-2 text-xs text-slate-400 border-t border-slate-50">
                  Submitted on: {new Date(sub.submittedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitComplaint;
