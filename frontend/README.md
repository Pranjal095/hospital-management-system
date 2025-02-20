# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Setting Up the Development Environment
1. **Clone the Repository**
   ```bash
   git clone https://github.com/TinkerersLabIITH/hospital-management-fe.git
   cd hospital-management-fe

2. **Install Dependencies**
    ```bash
    npm install

3. **Configure Environment Variables**
    - Create a .env file in the root directory and add the necessary environment variables:
    ```bash
    VITE_FIREBASE_API_KEY="example"
	VITE_FIREBASE_AUTH_DOMAIN="example"
	VITE_FIREBASE_PROJECT_ID="example"
	VITE_FIREBASE_STORAGE_BUCKET="example"
	VITE_FIREBASE_MESSAGING_SENDER_ID="example"
	VITE_FIREBASE_APP_ID="example"
	VITE_SERVER_URI="http://localhost:5000" (for local hosting)
