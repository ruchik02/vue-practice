<script>
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

export default {
  data() {
    return {
      user: auth.currentUser,
      drawer: false,
      links: [
        { title: "Home", route: "/dashboard/home", icon: "mdi-home" },
        { title: "Profile", route: "/dashboard/profile", icon: "mdi-account" },
        {
          title: "Messages",
          route: "/dashboard/messages",
          icon: "mdi-message",
        },
        {
          title: "Notifications",
          route: "/dashboard/notifications",
          icon: "mdi-bell",
        },
        { title: "Help", route: "/dashboard/help", icon: "mdi-help-circle" },
        {
          title: "About Us",
          route: "/dashboard/about",
          icon: "mdi-information",
        },
        { title: "Settings", route: "/dashboard/settings", icon: "mdi-cog" },
      ],
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
  <!-- Sidebar -->
  <v-navigation-drawer v-model="drawer" app class="custom-drawer">
    <v-list>
      <v-list-item v-for="(link, index) in links" :key="index" @click="$router.push(link.route)"
        :prepend-icon="link.icon" :class="{ 'active-link': $route.path === link.route }">
        <v-list-item-title>{{ link.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- Top App Bar -->
  <v-app-bar color="primary" dark app>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Dashboard</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="logout" variant="text">Logout</v-btn>
  </v-app-bar>
  <v-main>
    <router-view /> <!-- This will load child components -->
  </v-main>
</template>
<style scoped>
/* Sidebar background */
.custom-drawer {
  background-color: #1e1e2f;
  color: white;
}

/* List items styling */
.v-list-item {
  transition: background 0.3s ease;
  border-radius: 8px;
  margin: 5px;
}

/* Hover effect */
.v-list-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Active link styling */
.active-link {
  background-color: #4a90e2;
  color: white !important;
  font-weight: bold;
}

/* Icon color */
.v-icon {
  color: white;
}
.dashboard-card {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
}
</style>
