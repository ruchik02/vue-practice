<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      formValid: false,
      snackbar: false, // Snackbar state
      rules: {
        required: (value) => !!value || "This field is required.",
        email: (value) =>
          /.+@.+\..+/.test(value) || "E-mail must be valid.",
        passwordLength: (value) =>
          (value && value.length >= 6) || "Password must be at least 6 characters.",
        passwordMatch: () =>
          this.password === this.confirmPassword || "Passwords do not match.",
      },
    };
  },
  methods: {
    ...mapActions(["signup"]),
    async handleSignup() {
      this.snackbar = false;
      this.errorMessage = "";
      const { valid } = await this.$refs.signupform.validate();
      if (!valid) return; // Stop if form is invalid

      try {
        await this.signup({ email: this.email, password: this.password });
        this.$router.push("/dashboard"); // Redirect to dashboard
      } catch (error) {
        this.errorMessage = error.message;
        this.snackbar = true; // Show snackbar for error
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
        <v-form ref="signupform" v-model="formValid" @submit.prevent="handleSignup" >
          <v-text-field class="mt-2" v-model="name" label="Name" :rules="[rules.required]" required></v-text-field>
          <v-text-field class="mt-2" v-model="email" label="Email" type="email" :rules="[rules.required, rules.email]" required></v-text-field>
          <v-text-field class="mt-2" v-model="password" label="Password" type="password" :rules="[rules.required, rules.passwordLength]" required></v-text-field>
          <v-text-field class="mt-2" v-model="confirmPassword" label="Confirm Password" type="password" :rules="[rules.required, rules.passwordMatch]" required></v-text-field>

          <v-btn class="mt-2" type="submit" color="primary" block :disabled="!formValid">Sign Up</v-btn>

          <p class="text-center mt-2">
            Already have an account? <router-link to="/">Login</router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Snackbar for errors -->
    <v-snackbar v-model="snackbar" color="red" location="top">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
