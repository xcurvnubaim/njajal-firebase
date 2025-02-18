// Import dependencies
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-config.json"); // Replace with your service account JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors());
// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

// Google Sign-In and Sign-Up
app.post("/google-auth", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;
    
    // Store user in Firestore if not exists
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({ email, name, picture, createdAt: new Date() });
      console.log("User signed up:", email);
    } else {
      console.log("User signed in:", email);
    }
    res.json({ uid, email, name, picture });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid Google ID Token" });
  }
});

// Get user data (protected route)
app.get("/user", verifyToken, async (req, res) => {
  const userRef = db.collection("users").doc(req.user.uid);
  const userDoc = await userRef.get();
  if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
  res.json(userDoc.data());
});

// Create note (protected route)
app.post("/notes", verifyToken, async (req, res) => {
  const { notes } = req.body;
  if (!notes) return res.status(400).json({ error: "Invalid request" });
  const noteRef = db.collection("notes").doc();
  await noteRef.set({ notes, createdAt: new Date(), userId: req.user.uid });
  res.json({ id: noteRef.id, notes });
});

// Get All notes (protected route)
app.get("/notes", verifyToken, async (req, res) => {
  const notesRef = db.collection("notes").where("userId", "==", req.user.uid);
  const snapshot = await notesRef.get();
  const notes = [];
  snapshot.forEach((doc) => {
    notes.push({ id: doc.id, ...doc.data() });
  });
  res.json(notes);
});

// Get All Chats (protected route)
app.get("/chats", verifyToken, async (_, res) => {
  const chatsRef = db.collection("chats").orderBy("createdAt", "asc").limit(50);
  const snapshot = await chatsRef.get();
  const chats = [];
  snapshot.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() });
  });
  res.json(chats);
});

// Create Chat (protected route)
app.post("/chats", verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Invalid request" });
  const chatRef = db.collection("chats").doc();
  await chatRef.set({ text, createdAt: new Date(), uid: req.user.uid, name: req.user.name, avatar: req.user.picture });
  res.json({ id: chatRef.id, text });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
