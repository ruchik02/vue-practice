<script>
// import TableView from '@/components/TableView.vue';
import TableView from '@/components/users/TableView.vue'

export default {
components:{
  TableView,
}
}
</script>
<template>
  <v-container fluid>
    <h1 class="text-h4 font-weight-bold ma-4">User Management</h1>
    <TableView />
  </v-container>
</template>