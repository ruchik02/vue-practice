<script>
export default {
  data() {
    return {
      darkMode: false,
    };
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.darkMode ? "dark" : "light";
    },
  },
};
</script>
<template>
  <v-app-bar app color="primary" dark>
    <v-container class="d-flex align-center">
      <v-toolbar-title>My Portfolio</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text class="mx-2">Home</v-btn>
      <v-btn to="/about" text class="mx-2">About</v-btn>
      <v-btn to="/contact" text class="mx-2">Contact</v-btn>
      <v-btn to="/intro" text class="mx-2">Intro</v-btn>
      <v-switch
        v-model="darkMode"
        @change="toggleTheme"
        label="Dark Mode"
        hide-details
        class="ml-4"
      ></v-switch>
    </v-container>
  </v-app-bar>
</template>
<style scoped>
.v-btn {
  font-weight: bold;
}
.v-switch {
  display: flex;
  align-items: center;
}
</style>
