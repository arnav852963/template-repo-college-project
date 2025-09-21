import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { registerUser } from '../store/slices/authSlice';
import { SignupData } from '../types';

// Validation schema
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email address').refine(
    (email) => email.includes('@iiitnr.edu.in'),
    'Please use your IIIT Naya Raipur email address'
  ),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  researchInterest: z.string().min(1, 'Research interests are required'),
  isAdmin: z.boolean(),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  // Check if all required fields are filled
  const isFormValid = isValid && avatarFile && coverImageFile;

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image file selection
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected files
  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview('');
  };

  // Handle form submission
  const onSubmit = async (data: SignupFormData) => {
    if (!avatarFile || !coverImageFile) {
      return;
    }

    const signupData: SignupData = {
      ...data,
      avatar: avatarFile,
      coverImage: coverImageFile,
    };

    try {
      await dispatch(registerUser(signupData)).unwrap();
      navigate('/login');
    } catch (error) {
      // Error is handled by the thunk
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: "url('https://www.iiitnr.ac.in/sites/default/files/banner.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://www.iiitnr.ac.in/sites/all/themes/iiit/head.png"
            alt="IIIT Naya Raipur Logo"
            className="h-16 mb-4"
          />
        </div>

        <h1 className="text-center text-black text-2xl font-bold">
          {isLoading ? 'Processing...' : 'Sign Up'}
        </h1>
        <hr />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              placeholder="Enter your full name"
              className="input-field"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              placeholder="Choose a username"
              className="input-field"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your.email@iiitnr.edu.in"
              className="input-field"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-primary-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="form-label">
              Department
            </label>
            <select
              id="department"
              {...register('department')}
              className="input-field"
            >
              <option value="">Select Department</option>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
              <option value="Data Science and Artificial Intelligence">Data Science and Artificial Intelligence</option>
              
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label htmlFor="designation" className="form-label">
              Designation
            </label>
            <select
              id="designation"
              {...register('designation')}
              className="input-field"
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Research Scholar">Research Scholar</option>
              <option value="Post Doctoral Fellow">Post Doctoral Fellow</option>
            </select>
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>
            )}
          </div>

          {/* Research Interests */}
          <div>
            <label htmlFor="researchInterest" className="form-label">
              Research Interests
            </label>
            <input
              id="researchInterest"
              type="text"
              {...register('researchInterest')}
              placeholder="e.g., Machine Learning, AI, Data Science (comma separated)"
              className="input-field"
            />
            {errors.researchInterest && (
              <p className="text-red-500 text-sm mt-1">{errors.researchInterest.message}</p>
            )}
          </div>

          {/* Admin Role */}
          <div className="flex items-center space-x-2">
            <input
              id="isAdmin"
              type="checkbox"
              {...register('isAdmin')}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700">
              Admin Role
            </label>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="form-label">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload size={20} />
                <span>Choose Avatar</span>
              </label>
              {avatarPreview && (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            {!avatarFile && (
              <p className="text-red-500 text-sm mt-1">Profile picture is required</p>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="form-label">Cover Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload size={20} />
                <span>Choose Cover Image</span>
              </label>
              {coverImagePreview && (
                <div className="relative">
                  <img
                    src={coverImagePreview}
                    alt="Cover image preview"
                    className="w-24 h-16 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            {!coverImageFile && (
              <p className="text-red-500 text-sm mt-1">Cover image is required</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
              isFormValid && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Already have an account? Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
