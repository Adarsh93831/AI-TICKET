import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useTicketStore } from '../store/useTicketStore';
import Layout from '../components/Layout';
import { 
  Users, 
  Ticket, 
  Shield, 
  Edit2, 
  Save, 
  X, 
  Search,
  Filter,
  UserCheck,
  Settings,
  Trash2,
  Clock,
  CheckCircle,
  TrendingUp,
  Plus,
  AlertCircle,
  ArrowRight,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { authUser } = useAuthStore();
  const { users, fetchUsers, updateUser, isLoading: usersLoading } = useUserStore();
  const { tickets, fetchTickets, fetchAssignedTickets, deleteTicket, isLoading: ticketsLoading } = useTicketStore();
  
  const [activeTab, setActiveTab] = useState(authUser?.role === 'admin' ? 'users' : 'assigned');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', role: '', skills: [] });
  const [newSkill, setNewSkill] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'ongoing', 'TODO', 'IN_PROGRESS', 'COMPLETED'
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all', 'assigned', 'unassigned'

  useEffect(() => {
    const loadData = async () => {
      try {
        if (authUser?.role === 'admin') {
          await Promise.all([fetchUsers(), fetchTickets()]);
        } else if (authUser?.role === 'moderator') {
          // For moderators, load their assigned tickets using fetchTickets
          // Backend now returns only assigned tickets for moderators
          await fetchTickets();
        }
      } catch (error) {
        toast.error('Failed to load data');
      }
    };
    
    loadData();
  }, [authUser?.role, fetchUsers, fetchTickets]);

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditForm({
      email: user.email,
      role: user.role,
      skills: user.skills || []
    });
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(editForm);
      setEditingUser(null);
      toast.success('User updated successfully!');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ email: '', role: '', skills: [] });
    setNewSkill('');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(ticketId);
        toast.success('Ticket deleted successfully');
      } catch (error) {
        toast.error('Failed to delete ticket');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ticket.assignedTo && ticket.assignedTo.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtered tickets for Status tab with additional filters
  const getStatusFilteredTickets = () => {
    let filtered = [...tickets];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.assignedTo?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.createdBy?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter === 'ongoing') {
      filtered = filtered.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    // Apply assignment filter
    if (assignmentFilter === 'assigned') {
      filtered = filtered.filter(t => t.assignedTo);
    } else if (assignmentFilter === 'unassigned') {
      filtered = filtered.filter(t => !t.assignedTo);
    }
    
    return filtered;
  };

  const statusFilteredTickets = getStatusFilteredTickets();

  const getStats = () => {
    return {
      totalUsers: users.length,
      totalTickets: tickets.length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      moderatorUsers: users.filter(u => u.role === 'moderator').length,
      regularUsers: users.filter(u => u.role === 'user').length,
      todoTickets: tickets.filter(t => t.status === 'TODO').length,
      inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      completedTickets: tickets.filter(t => t.status === 'COMPLETED').length,
    };
  };

  const stats = getStats();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {authUser?.role === 'admin' ? 'Admin Panel' : 'Moderator Panel'}
          </h1>
          <p className="text-gray-600">
            {authUser?.role === 'admin' 
              ? 'Manage users and monitor system activity'
              : 'Manage your assigned tickets'
            }
          </p>
        </div>

        {/* Stats Cards - Different for Admin vs Moderator */}
        {authUser?.role === 'admin' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Ticket className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTickets}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Moderators</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.moderatorUsers}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Moderator Stats - Only show their assigned tickets stats */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Ticket className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Assigned Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'COMPLETED').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          {authUser?.role === 'admin' && (
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  Users Management
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'tickets'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Ticket className="h-4 w-4 inline mr-2" />
                  Tickets Overview
                </button>
                <button
                  onClick={() => setActiveTab('status')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'status'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 inline mr-2" />
                  Ticket Status
                </button>
              </nav>
            </div>
          )}
          {authUser?.role === 'moderator' && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Ticket className="h-5 w-5 mr-2" />
                My Assigned Tickets
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Tickets that have been assigned to you for resolution
              </p>
            </div>
          )}

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Users Tab - Admin Only */}
            {activeTab === 'users' && authUser?.role === 'admin' && (
              <div className="space-y-4">
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                        {editingUser === user._id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                  readOnly
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Role
                                </label>
                                {authUser?.role === 'admin' ? (
                                  <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={editForm.role}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                    readOnly
                                  />
                                )}
                              </div>
                            </div>
                            
                            {/* Skills Management */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills
                              </label>
                              <div className="flex space-x-2 mb-2">
                                <input
                                  type="text"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  placeholder="Add a skill..."
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddSkill();
                                    }
                                  }}
                                />
                                <button
                                  onClick={handleAddSkill}
                                  disabled={!newSkill.trim()}
                                  className="px-3 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {editForm.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {skill}
                                    <button
                                      onClick={() => handleRemoveSkill(skill)}
                                      className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                                {editForm.skills.length === 0 && (
                                  <span className="text-sm text-gray-500">No skills added</span>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveUser}
                                disabled={usersLoading}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {user.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900">{user.email}</h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                    {user.phoneNumber && (
                                      <span className="text-xs text-gray-500">
                                        📞 {user.phoneNumber}
                                      </span>
                                    )}
                                  </div>
                                  {user.skills && user.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {user.skills.map((skill, index) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tickets Tab - Admin Only */}
            {activeTab === 'tickets' && authUser?.role === 'admin' && (
              <div className="space-y-4">
                {ticketsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading tickets...</p>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Ticket className="h-8 w-8 mx-auto mb-2" />
                    <p>No tickets found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {ticket.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                              {ticket.priority && (
                                <span className={`text-xs font-medium ${ticket.priority === 'high' ? 'text-red-600' : ticket.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {ticket.priority.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {ticket.description.length > 100 
                                ? `${ticket.description.substring(0, 100)}...`
                                : ticket.description
                              }
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                              {ticket.createdBy && (
                                <span>by {ticket.createdBy.email}</span>
                              )}
                              {ticket.assignedTo ? (
                                <div className="flex items-center">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  <span>Assigned to {ticket.assignedTo.email}</span>
                                </div>
                              ) : (
                                <span className="text-yellow-600">Unassigned</span>
                              )}
                            </div>
                            {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {ticket.relatedSkills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleDeleteTicket(ticket._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete ticket"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Moderator Assigned Tickets */}
            {authUser?.role === 'moderator' && (
              <div className="space-y-4">
                {ticketsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading your assigned tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Ticket className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No tickets assigned to you</p>
                    <p className="text-sm mt-1">New tickets will appear here when they are assigned to you</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets
                      .filter(ticket => 
                        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((ticket) => (
                      <div key={ticket._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {ticket.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status?.replace('_', ' ')}
                              </span>
                              {ticket.priority && (
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                  ticket.priority === 'high' 
                                    ? 'bg-red-100 text-red-600' 
                                    : ticket.priority === 'medium' 
                                    ? 'bg-yellow-100 text-yellow-600' 
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                  {ticket.priority.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {ticket.description.length > 100 
                                ? `${ticket.description.substring(0, 100)}...`
                                : ticket.description
                              }
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                              {ticket.createdBy && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  Requested by {ticket.createdBy.email}
                                </span>
                              )}
                            </div>
                            {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {ticket.relatedSkills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <a
                              href={`/tickets/${ticket._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="View ticket details"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ticket Status Tab - Admin Only */}
            {activeTab === 'status' && authUser?.role === 'admin' && (
              <div className="space-y-6">
                {/* Status Filter Buttons */}
                <div className="flex flex-wrap gap-4">
                  {/* Status Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
                        { value: 'ongoing', label: 'Ongoing', color: 'bg-purple-100 text-purple-800' },
                        { value: 'TODO', label: 'TODO', color: 'bg-yellow-100 text-yellow-800' },
                        { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
                        { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
                      ].map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => setStatusFilter(filter.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            statusFilter === filter.value
                              ? `${filter.color} ring-2 ring-offset-1 ring-blue-500`
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Assignment Filter */}
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Assignment:</span>
                    <div className="flex gap-2">
                      {[
                        { value: 'all', label: 'All' },
                        { value: 'assigned', label: 'Assigned' },
                        { value: 'unassigned', label: 'Unassigned' },
                      ].map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => setAssignmentFilter(filter.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            assignmentFilter === filter.value
                              ? 'bg-blue-100 text-blue-800 ring-2 ring-offset-1 ring-blue-500'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-500">
                  Showing {statusFilteredTickets.length} of {tickets.length} tickets
                </div>

                {/* Tickets Table */}
                {ticketsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading tickets...</p>
                  </div>
                ) : statusFilteredTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Ticket className="h-8 w-8 mx-auto mb-2" />
                    <p>No tickets match the current filters</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ticket
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Requested By
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned To
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {statusFilteredTickets.map((ticket) => (
                          <tr key={ticket._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                    {ticket.title}
                                  </div>
                                  <div className="text-xs text-gray-500 max-w-xs truncate">
                                    {ticket.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status === 'TODO' && <Clock className="h-3 w-3 mr-1" />}
                                {ticket.status === 'IN_PROGRESS' && <TrendingUp className="h-3 w-3 mr-1" />}
                                {ticket.status === 'COMPLETED' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {ticket.status?.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {ticket.priority ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  ticket.priority === 'high' 
                                    ? 'bg-red-100 text-red-800' 
                                    : ticket.priority === 'medium' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {ticket.priority === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                                  {ticket.priority.toUpperCase()}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {ticket.createdBy ? (
                                <div className="flex items-center">
                                  <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                    <User className="h-3 w-3 text-gray-600" />
                                  </div>
                                  <span className="text-sm text-gray-900">{ticket.createdBy.email}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Unknown</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {ticket.assignedTo ? (
                                <div className="flex items-center">
                                  <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                    <UserCheck className="h-3 w-3 text-white" />
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-900">{ticket.assignedTo.email}</span>
                                    {ticket.assignedTo.role && (
                                      <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getRoleColor(ticket.assignedTo.role)}`}>
                                        {ticket.assignedTo.role}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Unassigned
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => handleDeleteTicket(ticket._id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete ticket"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Status Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">TODO</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.todoTickets}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">In Progress</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.inProgressTickets}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Completed</p>
                        <p className="text-2xl font-bold text-green-900">{stats.completedTickets}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;