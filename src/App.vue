<script>
import Navbar from '@/components/Navbar.vue'
export default {
  components: {
    Navbar,
  }
}
</script>
<template>
  <v-app>
    <v-toolbar>
      <Navbar />
    </v-toolbar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>

</template>