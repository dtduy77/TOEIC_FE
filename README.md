# TOEIC Learning App

A web application for learning TOEIC vocabulary with features like flashcards, quizzes, and personalized vocabulary lists.

## Features

- User authentication with Google
- Personalized vocabulary lists
- Interactive flashcards
- Vocabulary quizzes
- Modern and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Firebase account
- FastAPI backend (TOEIC_BE)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install frontend dependencies:

```bash
npm install
```

3. Configure Firebase:

   - Create a new Firebase project
   - Enable Google Authentication
   - Create a Firestore database
   - Update the Firebase configuration in `firebase.js`

4. Start the FastAPI backend:

```bash
cd TOEIC_BE
uvicorn main:app --reload
```

5. Start the React development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
|── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (auth, etc.)
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── TOEIC_BE/           # FastAPI backend
```

## Technologies Used

- React
- TypeScript
- Material-UI
- Firebase Authentication
- Firebase Firestore
- FastAPI
- Axios

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
