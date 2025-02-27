<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      snackbar: false, // Controls Snackbar visibility
      errorMessage: "", // Stores error message for Snackbar
      formValid: false, // Tracks form validity
      rules: {
        required: (value) => !!value || "This field is required",
        email: (value) =>
          (!value || /.+@.+\..+/.test(value)) || "Enter a valid email", // Only check email if not empty
        minLength: (value) =>
          (!value || value.length >= 6) || "At least 6 characters", // Only check if not empty
      },
    };
  },
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      this.snackbar = false;
      this.errorMessage = "";

      // Validate the form first
      const { valid } = await this.$refs.loginForm.validate();
      if (!valid) return; // Stop if form is invalid

      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push("/dashboard");
      } catch (error) {
        this.errorMessage =
                error.code === "auth/invalid-email"
                ? "Invalid email format."
                : "Login failed. Please try again.";
        this.snackbar = true;
      }
    },
  },
};
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form ref="loginForm" v-model="formValid" @submit.prevent="handleLogin" >
          <v-text-field v-model="email" label="Email" type="email" :rules="[rules.required, rules.email]" />
          <v-text-field class="mt-2" v-model="password" label="Password" type="password" :rules="[rules.required, rules.minLength]" />
          <v-btn class="mt-2" type="submit" color="primary" block :disabled="!formValid">Login</v-btn>
          <p class="text-center mt-2">
            Don't have an account?
            <router-link to="/signup">Sign Up</router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Snackbar for Error Messages (Positioned at Top) -->
    <v-snackbar v-model="snackbar" color="red" location="top">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
