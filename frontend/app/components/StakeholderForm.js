import React, { useState } from 'react';
import { User, Building2, Mail, Phone, FileText, Upload, CheckCircle } from 'lucide-react';

export default function StakeholderForm() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organization: '',
    email: '',
    phone: '',
    expertise: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    'Govt. Official',
    'Teacher',
    'NGO Member',
    'Counselor'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    // Check if all required fields are filled
    if (!formData.name || !formData.role || !formData.organization || 
        !formData.email || !formData.phone || !formData.expertise) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form
    setFormData({
      name: '',
      role: '',
      organization: '',
      email: '',
      phone: '',
      expertise: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // Common input styles with explicit text color
  const inputStyle = {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '16px',
    color: '#111827', // Dark gray text color
    backgroundColor: '#ffffff',
    outline: 'none'
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
    pointerEvents: 'none'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
          <User className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Stakeholder Registration</h2>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-green-800">Registration successful! Welcome to our stakeholder network.</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User style={iconStyle} size={18} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Role *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              ...inputStyle,
              paddingLeft: '1rem',
              color: formData.role ? '#111827' : '#9ca3af'
            }}
          >
            <option value="" style={{ color: '#9ca3af' }}>Select your role</option>
            {roles.map((role) => (
              <option key={role} value={role} style={{ color: '#111827' }}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Organization *
          </label>
          <div className="relative">
            <Building2 style={iconStyle} size={18} />
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Organization name"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail style={iconStyle} size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone style={iconStyle} size={18} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Area of Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Area of Expertise *
          </label>
          <div className="relative">
            <FileText style={{ ...iconStyle, top: '1rem' }} size={18} />
            <textarea
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your areas of expertise and how you can contribute to student guidance..."
              style={{
                ...inputStyle,
                resize: 'none',
                minHeight: '100px'
              }}
            />
          </div>
        </div>

        {/* Upload Document */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Upload Document (Optional)
          </label>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            style={{ cursor: 'pointer' }}
          >
            <Upload className="text-gray-500" size={20} />
            <span className="text-gray-600">Click to upload credentials or documents</span>
          </button>
          <p className="text-xs text-gray-500 mt-1">PDF, DOC, or image files up to 5MB</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Registering...
            </div>
          ) : (
            'Register as Stakeholder'
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        By registering, you agree to collaborate in providing guidance and resources to students.
      </p>
    </div>
  );
}