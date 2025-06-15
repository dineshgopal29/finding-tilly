# Running the Finding Tilly Application

This guide provides step-by-step instructions for building, starting, and stopping the Finding Tilly educational game application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- Git (for cloning the repository)

## Getting the Code

If you haven't already cloned the repository:

```bash
git clone https://github.com/dineshgopal29/finding-tilly.git
cd finding-tilly
```

## Installation

1. Navigate to the React application directory:

```bash
cd finding-tilly-react
```

2. Install all dependencies:

```bash
npm install
```

This will install all the required packages specified in the `package.json` file.

## Building the Application

### Development Build

During development, you can use the built-in development server which provides features like hot reloading:

```bash
npm start
```

This will start the development server and automatically open the application in your default web browser at [http://localhost:3000](http://localhost:3000).

### Production Build

To create an optimized production build:

```bash
npm run build
```

This command:
- Bundles React in production mode
- Optimizes the build for performance
- Minifies the code
- Creates a `build` folder with all the production files

## Running the Production Build

After creating a production build, you can serve it using a static server:

1. Install the `serve` package globally (if not already installed):

```bash
npm install -g serve
```

2. Serve the production build:

```bash
serve -s build
```

By default, this will serve your application at [http://localhost:5000](http://localhost:5000).

To specify a different port:

```bash
serve -s build -l 8000
```

This will serve the application at [http://localhost:8000](http://localhost:8000).

## Stopping the Application

### Stopping the Development Server

To stop the development server:

1. Go to the terminal where the server is running
2. Press `Ctrl + C` (or `Cmd + C` on macOS)
3. Confirm by pressing `Y` if prompted

### Stopping the Production Server

To stop the production server (running with `serve`):

1. Go to the terminal where the server is running
2. Press `Ctrl + C` (or `Cmd + C` on macOS)

## Troubleshooting

### Port Already in Use

If you see an error like "Something is already running on port 3000":

1. Find the process using the port:

```bash
# On macOS/Linux
lsof -i :3000

# On Windows
netstat -ano | findstr :3000
```

2. Kill the process:

```bash
# On macOS/Linux
kill -9 $(lsof -ti:3000)

# On Windows (replace XXXX with the PID from the netstat command)
taskkill /PID XXXX /F
```

3. Try starting the server again

### Missing Dependencies

If you encounter errors about missing dependencies:

```bash
npm install
```

This will ensure all dependencies are properly installed.

## Environment Variables (Optional)

If you're using Firebase or other services that require environment variables:

1. Create a `.env` file in the `finding-tilly-react` directory
2. Add your environment variables:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# Add other variables as needed
```

3. Restart the development server for the changes to take effect

## Deployment

The Finding Tilly application can be deployed to various hosting services:

### GitHub Pages

```bash
npm install gh-pages --save-dev
```

Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/finding-tilly",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Then deploy:
```bash
npm run deploy
```

### Netlify, Vercel, or Firebase Hosting

These platforms offer simple deployment options through their respective CLIs or by connecting to your GitHub repository for automatic deployments.

## Additional Commands

- **Run tests**: `npm test`
- **Eject from Create React App**: `npm run eject` (Note: this is a one-way operation)
- **Analyze bundle size**: `npm run build -- --stats && npx webpack-bundle-analyzer build/bundle-stats.json`

## Need Help?

If you encounter any issues not covered in this guide, please:

1. Check the [React documentation](https://reactjs.org/docs/getting-started.html)
2. Open an issue on the [Finding Tilly GitHub repository](https://github.com/dineshgopal29/finding-tilly/issues)
