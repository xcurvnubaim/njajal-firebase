<template>
  <div>
    <h1>Google Sign-In</h1>
    <button @click="handleGoogleSignIn">Sign in with Google</button>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app"; // Correct import for useNuxtApp

const errorMessage = ref(null);
const { $firebase } = useNuxtApp(); // Use injected Firebase instance

const handleGoogleSignIn = async () => {
  try {
    const { auth, provider, signInWithPopup } = $firebase;
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken(); // Get the Firebase ID Token

    console.log("User ID Token:", idToken);

    // Send the ID Token to your server
    const { data, error } = await useFetch("http://localhost:3000/google-auth", {
      method: "POST",
      body: { idToken },
    });

    if (error.value) {
      errorMessage.value = error.value.message || "Unknown error occurred";
    } else {
      console.log("Server response:", data.value);
    }
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    errorMessage.value = error.message || "Error during sign-in";
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
