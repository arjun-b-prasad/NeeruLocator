# NeeruLocator

**NeeruLocator** is a web application that helps users locate water sources (Neeru means water) easily on an interactive map. The project uses [TypeScript](https://www.typescriptlang.org/), [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/) on the frontend, with [Firebase](https://firebase.google.com/) providing real-time database and authentication services.

## Features

- 🗺️ **Interactive Map Interface:** Explore and discover listed water sources.
- 🔒 **Admin Authentication:** Secure admin portal with Google Sign-In via Firebase Authentication.
- ✍️ **Add \& Update Water Sources:** Authenticated admins can submit and update information directly from the UI.
- ⚡ **Real-Time Database:** Data is instantly updated and displayed using Firebase Firestore.
- 🎨 **Modern UI:** Built with React, Vite, and styled using Tailwind CSS.
- 💡 **Type-Safe Codebase:** Developed with TypeScript for robust and maintainable code.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- npm or yarn


### Setup

1. **Clone the Repository**

```bash
git clone https://github.com/arjun-b-prasad/NeeruLocator.git
cd NeeruLocator
```

2. **Install Dependencies**

```bash
npm install
```

or, if you use yarn:

```bash
yarn install
```

3. **Configure Firebase**
    - Create a project on [Firebase Console](https://console.firebase.google.com/).
    - Set up Firestore Database and enable [Authentication with Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin).
    - In the project directory, create a file named `.env` and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

    - (Refer to your Firebase console's project settings for these values.)
4. **Run the Development Server**

```bash
npm run dev
```

    - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **View Public Map:** Anyone can explore water sources.
- **Admin Portal:** Click on the admin section and sign in with Google to add or update source information.


## Project Structure

```plaintext
NeeruLocator/
├── public/
├── src/
│   ├── components/      # React components
│   ├── firebase/        # Firebase configuration and API abstraction
│   ├── pages/           # Page components/views
│   ├── App.tsx
│   └── main.tsx
├── .env.local           # Firebase config (excluded from git)
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```


## Scripts

| Command | Action |
| :-- | :-- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Contributing

All contributions are welcome!

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/my-feature`)
3. **Commit** your changes (`git commit -am 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/my-feature`)
5. **Open a pull request**

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

**Happy Mapping! 🚀**


