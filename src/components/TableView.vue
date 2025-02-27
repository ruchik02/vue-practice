<script>
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
export default {
    data() {
        return {
            search: "",
            dialog: false, // Controls visibility of edit dialog
            editedUser: { name: "", email: "", role: "" }, // Stores user being edited
            headers: [
                { title: "Name", key: "name", sortable: true },
                { title: "Email", key: "email", sortable: true },
                { title: "Role", key: "role", sortable: true },
                { title: "Created At", key: "createdAt", sortable: true },
                { title: "Actions", key: "actions", sortable: false },
            ],
            users: [],
        }
    },
    methods: {
        // fetch data from firestore
        async fetchUsers() {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                this.users = querySnapshot.docs.map(doc => {
                    let userData = doc.data();
                    return {
                        id: doc.id,
                        name: userData.name,
                        email: userData.email,
                        role: userData.role,
                        createdAt: userData.createdAt
                            ? new Date(userData.createdAt.seconds * 1000).toLocaleString()
                            : "N/A" // Convert Firestore Timestamp to readable date
                    };
                });
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        },
        editUser(user) {
            this.editedUser = { ...user };
            this.dialog = true;
        },
        // Save edited user to Firestore
        async updateUser() {
            if (!this.editedUser.id) return;

            try {
                const userRef = doc(db, "users", this.editedUser.id);
                await updateDoc(userRef, {
                    name: this.editedUser.name,
                    email: this.editedUser.email,
                    role: this.editedUser.role
                });

                // Close dialog and refresh list
                this.dialog = false;
                this.fetchUsers();
            } catch (error) {
                console.error("Error updating user:", error);
            }
        },
        // Delete user from Firestore
        async deleteUser(user) {
            try {
                await deleteDoc(doc(db, "users", user.id));
                this.fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    },
    mounted() {
        this.fetchUsers();
    }
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
    <!-- edit container -->
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>Edit User</v-card-title>
            <v-card-text>
                <v-text-field v-model="editedUser.name" label="Name"></v-text-field>
                <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
                <v-text-field v-model="editedUser.role" label="Role"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" text @click="dialog = false">Cancel</v-btn>
                <v-btn color="blue" text @click="updateUser">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.v-btn {
    margin: 0 10px;
}
</style>