import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTicketStore } from '../store/useTicketStore';
import Layout from '../components/Layout';
import { 
  Plus, 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Search,
  Filter,
  Trash2,
  UserCheck,
  Eye,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { authUser, isAuthenticated } = useAuthStore();
  const { tickets, fetchTickets, fetchAssignedTickets, deleteTicket, isLoading, error } = useTicketStore();
  
  console.log('🏠 DashboardPage - authUser:', authUser);
  console.log('🏠 DashboardPage - isAuthenticated:', isAuthenticated);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        if (authUser?.role === 'user') {
          await fetchTickets();
        } else if (authUser?.role === 'moderator') {
          await fetchAssignedTickets();
        } else {
          if (viewMode === 'assigned') {
            await fetchAssignedTickets();
          } else {
            await fetchTickets();
          }
        }
      } catch (error) {
        toast.error('Failed to load tickets');
      }
    };
    
    loadTickets();
  }, [fetchTickets, fetchAssignedTickets, authUser?.role, viewMode]);

  const handleDeleteTicket = async (e, ticketId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(ticketId);
        toast.success('Ticket deleted successfully');
      } catch (error) {
        toast.error('Failed to delete ticket');
      }
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tickets.length,
    todo: tickets.filter(t => t.status === 'TODO').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tickets.filter(t => t.status === 'COMPLETED').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {authUser?.role === 'user' ? 'My Dashboard' : authUser?.role === 'moderator' ? 'Moderator Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600">
              Welcome back, {authUser?.email} 
              {authUser?.role !== 'user' && (
                <span className="text-blue-600 font-medium">({authUser?.role})</span>
              )}
            </p>
          </div>
          {authUser?.role === 'user' && (
            <Link
              to="/tickets/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {authUser?.role === 'user' ? 'My Tickets' : authUser?.role === 'moderator' ? 'My Assigned Tickets' : 'Total Tickets'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todo}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Role-specific information banner */}
        {authUser?.role === 'user' && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>User Dashboard:</strong> You can view and manage only the tickets you've created. 
                  For system-wide access, contact your administrator.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {authUser?.role === 'admin' && (
                <div className="flex items-center bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      viewMode === 'all' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4 mr-1" />
                    All
                  </button>
                  <button
                    onClick={() => setViewMode('assigned')}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      viewMode === 'assigned' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Assigned
                  </button>
                </div>
              )}
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {authUser?.role === 'user' 
                ? 'My Tickets' 
                : authUser?.role === 'moderator'
                  ? 'My Assigned Tickets'
                  : viewMode === 'assigned' 
                    ? 'Assigned to Me' 
                    : 'All Tickets'}
            </h2>
            {authUser?.role === 'user' && (
              <p className="text-sm text-gray-500 mt-1">
                Showing only tickets created by you
              </p>
            )}
            {authUser?.role === 'moderator' && (
              <p className="text-sm text-gray-500 mt-1">
                Showing tickets assigned to you for resolution
              </p>
            )}
            {authUser?.role === 'admin' && viewMode === 'assigned' && (
              <p className="text-sm text-gray-500 mt-1">
                Showing tickets assigned to you for resolution
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Ticket className="h-8 w-8 mx-auto mb-2" />
              <p>No tickets found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTickets.slice(0, 10).map((ticket) => (
                <div key={ticket._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/tickets/${ticket._id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {ticket.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        {ticket.priority && (
                          <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {ticket.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.assignedTo && (
                          <div className="flex items-center">
                            <UserCheck className="h-3 w-3 mr-1" />
                            <span>Assigned to: {ticket.assignedTo.email}</span>
                          </div>
                        )}
                        {!ticket.assignedTo && authUser?.role !== 'user' && (
                          <span className="text-yellow-600">Unassigned</span>
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => handleDeleteTicket(e, ticket._id)}
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
      </div>
    </Layout>
  );
};

export default DashboardPage;