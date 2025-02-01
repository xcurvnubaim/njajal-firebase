<template>
  <div>
    <h1>Google Sign-In</h1>
    <button v-if="!user" @click="handleGoogleSignIn">Sign in with Google</button>
    <button v-if="user" @click="handleLogout">Logout</button>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="user">
      <h2>Welcome, {{ user.displayName }}</h2>
      <div>
        <h3>Create Note</h3>
        <input v-model="newNote" placeholder="Enter note" />
        <button @click="createNote">Create Note</button>
      </div>
      <div>
        <h3>Notes</h3>
        <ul>
          <li v-for="note in notes" :key="note.id">{{ note.notes }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app"; // Correct import for useNuxtApp

const errorMessage = ref(null);
const user = ref(null);
const newNote = ref("");
const notes = ref([]);
const { $firebase } = useNuxtApp(); // Use injected Firebase instance

const handleGoogleSignIn = async () => {
  try {
    const { auth, provider, signInWithPopup } = $firebase;
    const result = await signInWithPopup(auth, provider);
    user.value = result.user;
    const idToken = await user.value.getIdToken(); // Get the Firebase ID Token

    console.log("User ID Token:", idToken);

    // Save user to local storage
    localStorage.setItem("user", JSON.stringify(user.value));

    // Send the ID Token to your server
    const { data, error } = await useFetch("http://localhost:3000/google-auth", {
      method: "POST",
      body: { idToken },
    });

    if (error.value) {
      errorMessage.value = error.value.message || "Unknown error occurred";
    } else {
      console.log("Server response:", data.value);
      fetchNotes(); // Fetch notes after successful sign-in
    }
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    errorMessage.value = error.message || "Error during sign-in";
  }
};

const handleLogout = async () => {
  try {
    const { auth } = $firebase;
    await auth.signOut();
    user.value = null;
    notes.value = [];
    localStorage.removeItem("user");
    console.log("User logged out");
  } catch (error) {
    console.error("Error during logout:", error);
    errorMessage.value = error.message || "Error during logout";
  }
};

const createNote = async () => {
  if (!newNote.value) return;
  try {
    const { data, error } = await useFetch("http://localhost:3000/notes", {
      method: "POST",
      headers: {
        Authorization: `${await user.value.getIdToken()}`,
      },
      body: { notes: newNote.value },
    });

    if (error.value) {
      errorMessage.value = error.value.message || "Unknown error occurred";
    } else {
      console.log("Note created:", data.value);
      notes.value.push(data.value);
      newNote.value = "";
    }
  } catch (error) {
    console.error("Error creating note:", error);
    errorMessage.value = error.message || "Error creating note";
  }
};

const fetchNotes = async () => {
  try {
    const { data, error } = await useFetch("http://localhost:3000/notes", {
      method: "GET",
      headers: {
        Authorization: `${await user.value.getIdToken()}`,
      },
    });

    if (error.value) {
      errorMessage.value = error.value.message || "Unknown error occurred";
    } else {
      notes.value = data.value;
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    errorMessage.value = error.message || "Error fetching notes";
  }
};

// Load user from local storage on mount
onMounted(() => {
  const storedUser = localStorage.getItem("user");
  console.log("Stored user:", storedUser);
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    const { auth } = $firebase;

    auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          // Refresh ID token
          const idToken = await currentUser.getIdToken(true);
          console.log("Refreshed ID Token:", idToken);
          user.value = currentUser;

          // Store updated user details
          localStorage.setItem("user", JSON.stringify(user.value));

          fetchNotes(); // Fetch notes after token refresh
        } catch (error) {
          console.error("Error refreshing token:", error);
          errorMessage.value = "Session expired. Please sign in again.";
          handleLogout();
        }
      } else {
        user.value = null;
        localStorage.removeItem("user");
      }
    });
  }
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
