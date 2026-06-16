import React from 'react';
import { adminComplaints, statusColors, priorityColors } from '../../data/dummyData.js';
import StatusBadge from '../../components/ui/StatusBadge';
import Select from '../../components/ui/Select';

const AdminComplaints = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">All Complaints</h1>
        <p className="mt-1 text-slate-600">Manage and track all campus complaints</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">Complaints List</h2>
            <div className="flex items-center gap-2">
              <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option value="IT Infrastructure">IT Infrastructure</option>
                <option value="Facilities">Facilities</option>
                <option value="Food Services">Food Services</option>
                <option value="Safety">Safety</option>
                <option value="Academic">Academic</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {adminComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-slate-500">{complaint.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-950">{complaint.title}</td>
                  <td className="px-6 py-4 text-slate-600">Student User</td>
                  <td className="px-6 py-4 text-slate-600">{complaint.category}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[complaint.priority]}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{complaint.assignedTo || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(complaint.submittedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                      <button className="text-slate-600 hover:text-slate-800 font-medium">Assign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;
