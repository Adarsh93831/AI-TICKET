import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicketStore } from '../store/useTicketStore';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Mail,
  Phone,
  Badge,
  Trash2,
  Sparkles,
  ExternalLink,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { currentTicket, fetchTicket, deleteTicket, isLoading, error, clearCurrentTicket } = useTicketStore();

  useEffect(() => {
    if (id) {
      const loadTicket = async () => {
        try {
          await fetchTicket(id);
        } catch (error) {
          toast.error('Failed to load ticket');
          navigate('/dashboard');
        }
      };
      
      loadTicket();
    }

    return () => {
      clearCurrentTicket();
    };
  }, [id, fetchTicket, clearCurrentTicket, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'TODO': return Clock;
      case 'IN_PROGRESS': return TrendingUp;
      case 'COMPLETED': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(currentTicket._id);
        toast.success('Ticket deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete ticket');
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !currentTicket) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || 'The ticket you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const StatusIcon = getStatusIcon(currentTicket.status);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words">
                {currentTicket.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Ticket #{currentTicket._id.slice(-8)}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 ml-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentTicket.status)}`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {currentTicket.status.replace('_', ' ')}
              </span>
              
              {currentTicket.priority && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(currentTicket.priority)}`}>
                  {currentTicket.priority.toUpperCase()}
                </span>
              )}

              <button
                onClick={handleDeleteTicket}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Delete ticket"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {currentTicket.description}
                </p>
              </div>
            </div>

            {/* Helpful Notes (for admins/moderators) */}
            {authUser?.role !== 'user' && currentTicket.helpfulNotes && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">AI Analysis & Helpful Notes</h3>
                    <p className="text-sm text-gray-500">Generated insights to help resolve this ticket</p>
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-blue-100">
                  <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:marker:text-blue-500">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a 
                            {...props} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                          >
                            {props.children}
                            <ExternalLink className="h-3 w-3 inline" />
                          </a>
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 flex items-center gap-2" {...props}>
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            {props.children}
                          </h1>
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2 border-b border-gray-200 pb-1" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-base font-medium text-gray-800 mt-3 mb-1" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc list-inside space-y-1 my-2 ml-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal list-inside space-y-1 my-2 ml-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-gray-700 leading-relaxed" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-gray-700 leading-relaxed my-2" {...props} />
                        ),
                        code: ({ node, inline, ...props }) => (
                          inline 
                            ? <code className="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                            : <code className="block bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-2 italic text-gray-700" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold text-gray-900" {...props} />
                        ),
                      }}
                    >
                      {currentTicket.helpfulNotes}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Related Skills */}
            {currentTicket.relatedSkills && currentTicket.relatedSkills.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Related Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {currentTicket.relatedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      <Badge className="h-3 w-3 mr-1" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Ticket Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(currentTicket.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {currentTicket.updatedAt && currentTicket.updatedAt !== currentTicket.createdAt && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600">
                        {new Date(currentTicket.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {currentTicket.deadline && (
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Deadline</p>
                      <p className="text-sm text-gray-600">
                        {new Date(currentTicket.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment Info (for admins/moderators) */}
            {authUser?.role !== 'user' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Assignment</h2>
                
                {currentTicket.assignedTo ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Assigned To</p>
                        <p className="text-sm text-gray-600">{currentTicket.assignedTo.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Badge className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Role</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {currentTicket.assignedTo.role}
                        </p>
                      </div>
                    </div>

                    {currentTicket.assignedTo.skills && currentTicket.assignedTo.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {currentTicket.assignedTo.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Not assigned yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      AI will assign this ticket based on skills and availability
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TicketDetailPage;