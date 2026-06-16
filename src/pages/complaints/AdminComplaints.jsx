import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api.js';
import StatusBadge from '../../components/ui/StatusBadge';
import { priorityColors } from '../../data/dummyData.js';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/complaints');
        setComplaints(data);
      } catch (err) {
        console.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchesStatus && matchesCategory;
    });
  }, [complaints, statusFilter, categoryFilter]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  );

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
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
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
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-slate-500">{complaint.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-950">{complaint.title}</td>
                  <td className="px-6 py-4 text-slate-600">Student User</td>
                  <td className="px-6 py-4 text-slate-600">{complaint.category}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[complaint.priority] || 'bg-slate-100'}`}>
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
