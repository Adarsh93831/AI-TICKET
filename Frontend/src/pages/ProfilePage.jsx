import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout';
import { User, Mail, Phone, Shield, Edit2, Save, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, addOrUpdateSkills, addOrUpdatePhoneNumber, isLoading } = useAuthStore();
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [skills, setSkills] = useState(authUser?.skills || []);
  const [phoneNumber, setPhoneNumber] = useState(authUser?.phoneNumber || '');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (authUser) {
      setSkills(authUser.skills || []);
      setPhoneNumber(authUser.phoneNumber || '');
    }
  }, [authUser]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSaveSkills = async () => {
    try {
      await addOrUpdateSkills(skills);
      setIsEditingSkills(false);
      toast.success('Skills updated successfully!');
    } catch (error) {
      toast.error('Failed to update skills');
    }
  };

  const handleSavePhone = async () => {
    try {
      await addOrUpdatePhoneNumber(phoneNumber);
      setIsEditingPhone(false);
      toast.success('Phone number updated successfully!');
    } catch (error) {
      toast.error('Failed to update phone number');
    }
  };

  const handleCancelSkills = () => {
    setSkills(authUser?.skills || []);
    setNewSkill('');
    setIsEditingSkills(false);
  };

  const handleCancelPhone = () => {
    setPhoneNumber(authUser?.phoneNumber || '');
    setIsEditingPhone(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-bold text-gray-900">{authUser?.email}</h2>
                  <div className="flex items-center mt-1">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(authUser?.role)}`}>
                      {authUser?.role?.charAt(0).toUpperCase() + authUser?.role?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{authUser?.email}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed as it's linked to your Google account
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditingPhone ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSavePhone}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelPhone}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">
                        {authUser?.phoneNumber || 'Not provided'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Skills - Only visible for moderators and admins */}
              {(authUser?.role === 'moderator' || authUser?.role === 'admin') && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Skills
                    </label>
                    {!isEditingSkills && (
                      <button
                        onClick={() => setIsEditingSkills(true)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditingSkills ? (
                    <div className="space-y-3">
                      {/* Add new skill */}
                      <div className="flex space-x-2">
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

                      {/* Skills list */}
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
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
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveSkills}
                          disabled={isLoading}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save Skills
                        </button>
                        <button
                          onClick={handleCancelSkills}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {authUser?.skills?.length > 0 ? (
                        authUser.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              {authUser?.role === 'user' ? 'Profile Information' : 'Profile Management'}
            </h3>
            {authUser?.role === 'user' ? (
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep your contact information up to date</li>
                <li>• Phone number enables SMS notifications for your tickets</li>
                <li>• Your skills are managed by moderators and administrators</li>
              </ul>
            ) : (
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Skills help our AI system assign tickets to the right team members</li>
                <li>• Phone number enables SMS notifications for urgent tickets</li>
                <li>• Complete profiles improve overall system efficiency</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;