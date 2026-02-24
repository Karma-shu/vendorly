# Fix for Blank Page Issue

The preview shows a blank page because the application requires a web server to run properly, but the Vite preview server cannot start due to an Application Control policy blocking the terminal.

## Root Cause
- The Vendorly application is built with Vite and uses ES modules
- ES modules require a proper web server to run (they don't work when opened directly in browser)
- The preview server cannot start due to a Windows Application Control policy blocking conpty.node

## Solution

### Method 1: Run via Command Prompt
1. Open **Command Prompt as Administrator**
2. Navigate to the vendorly directory:
   ```
   cd c:\Users\ASUS\Desktop\vendorly
   ```
3. Run the preview server:
   ```
   npm run preview
   ```
4. Visit `http://localhost:4173` in your browser

### Method 2: Use the Provided Scripts
1. Double-click `run_vendorly.bat` to run the application using Command Prompt
2. Or right-click and "Run with PowerShell" on `run_vendorly.ps1`

### Method 3: Alternative Web Servers
If the above methods don't work due to the policy issue:

1. Install Python (if available) and run:
   ```
   python -m http.server 8000 --directory dist
   ```

2. Install PHP (if available) and run:
   ```
   php -S localhost:8000 -t dist
   ```

3. Use VS Code Live Server extension to serve the `dist` folder

### Method 4: Fix the Application Control Policy
Contact your system administrator to allow the conpty.node file, which is required for the terminal to function properly in development environments.

## Additional Notes
- Make sure Node.js and npm are installed on your system
- The built application is in the `dist` folder
- Environment variables might be required for full functionality (see `.env.example`)