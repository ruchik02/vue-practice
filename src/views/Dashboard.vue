<script>
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

export default {
  data() {
    return {
        user: auth.currentUser
    };
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$router.push("/"); // Redirect to login after logout
      } catch (error) {
        console.error("Logout Error:", error);
        alert(error.message);
      }
    },
  },
};
</script>

<template>
  <v-container>
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" text>Logout</v-btn>
    </v-app-bar>

    <v-container class="text-center">
      <h1>Welcome, {{ user?.email }}</h1>
    </v-container>
  </v-container>
</template>
