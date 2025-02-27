<script>
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
export default {
    data() {
        return {
            search: "",
            headers: [
                { title: "Name", key: "name", sortable: true },
                { title: "Email", key: "email", sortable: true },
                { title: "Role", key: "role", sortable: true },
                { title: "Created At", key: "createdAt", sortable: true },
                { title: "Actions", key: "actions", sortable: false },
            ],
            users: [
                { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", createdAt: "2024-06-01" },
                { id: 2, name: "Bob", email: "bob@example.com", role: "User", createdAt: "2024-06-05" },
                { id: 3, name: "Charlie", email: "charlie@example.com", role: "Editor", createdAt: "2024-06-10" },
                { id: 4, name: "David", email: "david@example.com", role: "User", createdAt: "2024-06-12" },
                { id: 5, name: "Emma", email: "emma@example.com", role: "Admin", createdAt: "2024-06-14" },
                { id: 6, name: "Frank", email: "frank@example.com", role: "Editor", createdAt: "2024-06-16" },
                { id: 7, name: "Grace", email: "grace@example.com", role: "User", createdAt: "2024-06-18" },
                { id: 8, name: "Hannah", email: "hannah@example.com", role: "Admin", createdAt: "2024-06-20" },
                { id: 9, name: "Isaac", email: "isaac@example.com", role: "Editor", createdAt: "2024-06-22" },
                { id: 10, name: "Jack", email: "jack@example.com", role: "User", createdAt: "2024-06-24" },
                { id: 11, name: "Katherine", email: "katherine@example.com", role: "Admin", createdAt: "2024-06-26" },
                { id: 12, name: "Liam", email: "liam@example.com", role: "Editor", createdAt: "2024-06-28" },
                { id: 13, name: "Mia", email: "mia@example.com", role: "User", createdAt: "2024-06-30" },
                { id: 14, name: "Noah", email: "noah@example.com", role: "Admin", createdAt: "2024-07-02" }
            ],
        }
    },
    methods: {
        editUser(user) {
            alert(`Edit User: ${user.name}`);
        },
        deleteUser(user) {
            alert(`Delete User: ${user.name}`);
        },
    },
}
</script>
<template>
    <v-card>
        <v-card-title class="d-flex justify-space-between">
            <v-text-field v-model="search" label="Search users..." prepend-inner-icon="mdi-magnify" variant="outlined"
                density="compact"></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="users" :search="search" :items-per-page="10" class="elevation-2">
            <template v-slot:item.actions="{ item }">
                <v-btn size="small" icon color="blue" @click="editUser(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn size="small" icon color="red" @click="deleteUser(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </v-card>
</template>
<style scoped>
.v-btn {
    margin: 0 10px;
}
</style>