<script>
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    async signup() {
      this.errorMessage = "";
      // validation if field empty
      if (
        !this.name ||
        !this.email ||
        !this.password ||
        !this.confirmPassword
      ) {
        this.errorMessage = "All fields are required.";
        return;
      }
      // password less than 6 characters
      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters.";
        return;
      }
      // password and confirm do not match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }
      try {
        // Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Update user profile with name
        await updateProfile(user, { displayName: this.name });
        this.$router.push("/dashboard"); //redirect to dashboard
      } catch (error) {
        this.errorMessage = error.message;
        alert(error.message);
      }
    },
  },
};
</script>
<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center">Sign Up</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signup">
          <v-text-field v-model="name" label="Name" required></v-text-field>
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary" block>Sign Up</v-btn>
          <!-- Show error message -->
          <p v-if="errorMessage" class="text-red text-center mt-2">
            {{ errorMessage }}
          </p>
          <p class="text-center mt-2">
            Already have an account? <router-link to="/">Login</router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
