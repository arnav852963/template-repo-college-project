# Google OAuth Setup Guide for Dam_YET Research Portal

## 🔧 **Step-by-Step Configuration**

### **1. Google Cloud Console Setup**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing project
3. **Enable required APIs:**
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ Google+ API
     - ✅ Google OAuth2 API
     - ✅ Google Identity Services API

### **2. OAuth Consent Screen Configuration**

1. **Go to "APIs & Services" → "OAuth consent screen"**
2. **Choose "External" user type**
3. **Fill in required information:**
   ```
   App name: Dam_YET Research Portal
   User support email: your-email@example.com
   Developer contact information: your-email@example.com
   ```
4. **Add scopes:**
   - `email`
   - `profile` 
   - `openid`
5. **Add test users:**
   - Add your email address
   - Add any other test user emails

### **3. Create OAuth 2.0 Client ID**

1. **Go to "APIs & Services" → "Credentials"**
2. **Click "Create Credentials" → "OAuth 2.0 Client IDs"**
3. **Select "Web application"**
4. **Configure:**
   ```
   Name: Dam_YET Frontend
   
   Authorized JavaScript origins:
   - http://localhost:3000
   
   Authorized redirect URIs:
   - http://localhost:3000
   ```

### **4. Get Your Client ID**

After creation, you'll receive:
```
Client ID: 123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
Client Secret: GOCSPX-abcdefghijklmnopqrstuvwxyz (keep this secret!)
```

### **5. Update Frontend .env File**

Replace the placeholder in `frontend/.env`:

```env
# Replace this line:
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# With your actual Client ID:
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

### **6. Backend Configuration (Already Done)**

Your backend should already be configured with:
- Google OAuth credentials
- JWT token handling
- User authentication endpoints

## 🚀 **Testing the Setup**

1. **Start both servers:**
   ```bash
   # Backend
   cd C:\games\college
   npm run dev
   
   # Frontend  
   cd C:\games\college\frontend
   npm run dev
   ```

2. **Test Google Login:**
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google"
   - Should redirect to Google OAuth
   - After successful login, should redirect back to dashboard

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Invalid client" error:**
   - Check if Client ID is correct in .env
   - Ensure authorized origins include `http://localhost:3000`

2. **"Redirect URI mismatch" error:**
   - Add `http://localhost:3000` to authorized redirect URIs
   - Check for typos in the URI

3. **"Access blocked" error:**
   - Add your email to test users in OAuth consent screen
   - Ensure OAuth consent screen is properly configured

4. **CORS errors:**
   - Check if backend CORS is configured for `http://localhost:3000`
   - Ensure backend is running on port 8000

## 📋 **Environment Variables Summary**

Your `frontend/.env` should look like:

```env
# Frontend Environment Variables

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE

# SERP API Configuration (if needed on frontend)
VITE_SERP_API_KEY=your_serp_api_key_here

# Development Configuration
VITE_NODE_ENV=development
```

## 🔐 **Security Notes**

- ✅ Never commit your `.env` file to version control
- ✅ Keep your Client Secret secure (backend only)
- ✅ Use environment-specific Client IDs for production
- ✅ Regularly rotate your OAuth credentials
