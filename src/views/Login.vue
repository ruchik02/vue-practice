<script>
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      this.errorMessage = ""; // Reset error message
      // if any field empty
      if (!this.email || !this.password) {
        this.errorMessage = "Both fields are required.";
        return;
      }
      try {
        // firebase login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        this.$router.push("/dashboard");
      } catch (error) {
        // Handle Firebase Error
        switch (error.code) {
          case "auth/user-not-found":
            this.errorMessage = "No user found with this email.";
            break;
          case "auth/wrong-password":
            this.errorMessage = "Incorrect password.";
            break;
          case "auth/invalid-email":
            this.errorMessage = "Invalid email format.";
            break;
          default:
            this.errorMessage = "Login failed. Please try again.";
        }
        alert(error.message);
      }
    },
  },
};
</script>
<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
          ></v-text-field>
          <v-btn type="submit" color="primary" block>Login</v-btn>
          <!-- Show error message -->
          <p v-if="errorMessage" class="text-red text-center mt-2">
            {{ errorMessage }}
          </p>
          <p class="text-center mt-2">
            Don't have an account?
            <router-link to="/signup">Sign Up</router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
