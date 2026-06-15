import { adminComplaints, statusColors, priorityColors } from '../data/dummyData.js';

function AdminComplaints() {
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

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {adminComplaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-mono text-slate-950">{complaint.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-950">{complaint.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">Student User</td>
                <td className="px-6 py-4 text-sm text-slate-600">{complaint.category}</td>
                <td className="px-6 py-4">
                  <select
                    defaultValue={complaint.status}
                    className="rounded-full border border-slate-300 px-2.5 py-0.5 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[complaint.priority]}`}>
                    {complaint.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{complaint.assignedTo || 'Unassigned'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{new Date(complaint.submittedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-700 hover:text-blue-900 text-sm font-medium">View</button>
                    <button className="text-green-700 hover:text-green-900 text-sm font-medium">Assign</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminComplaints;