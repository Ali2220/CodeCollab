# CodeCollab - Collaborative Coding Platform

CodeCollab is a real-time collaborative coding platform designed to help developers write code together, communicate via video/audio, and leverage AI assistance. Built with the MERN stack, it offers a seamless environment for pair programming, technical interviews, and team collaboration.

## 🚀 Features

- **Real-time Code Collaboration**: Live code editing with syntax highlighting using Monaco Editor.
- **Video & Audio Calling**: Integrated WebRTC-based video and audio communication for face-to-face interaction.
- **AI Integration**: AI-powered code assistance and review features powered by Google Gemini.
- **Room Management**: Create and join private rooms for secure collaboration sessions.
- **Live Chat**: Text-based chat functionality alongside code.
- **Syntax Highlighting**: Support for multiple programming languages.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building the interface.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Monaco Editor**: The code editor that powers VS Code.
- **Socket.io-client**: Real-time bidirectional event-based communication.
- **Simple-peer**: WebRTC implementation for video/audio.
- **Lucide React**: Beautiful & consistent icons.

### Backend
- **Node.js & Express**: Runtime and web framework for the API.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **Socket.io**: Real-time server for signaling and code sync.
- **Google GenAI**: Integration with Gemini models for AI features.
- **JWT & Bcrypt**: Secure authentication and password hashing.

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:
- Node.js (v14+ recommended)
- MongoDB (Local or Atlas)
- Git

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd CodeCollab
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    GEMINI_API_KEY=your_google_gemini_api_key
    ```
    Start the backend server:
    ```bash
    npm run start
    ```

3.  **Frontend Setup**
    Open a new terminal window:
    ```bash
    cd frontend
    npm install
    ```
    Create a `.env` file in the `frontend` directory (if needed for API URLs, or rely on defaults):
    ```env
    VITE_API_URL=http://localhost:5000
    ```
    Start the development server:
    ```bash
    npm run dev
    ```

4.  **Access the Application**
    Open your browser and navigate to `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
