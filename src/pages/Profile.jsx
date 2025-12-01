import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                {user.role}
              </span>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;