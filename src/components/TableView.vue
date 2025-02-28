<script>
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
export default {
    data() {
        return {
            search: "",
            dialog: false, // Controls visibility of edit dialog
            isEditing: false,
            editedUser: { name: "", email: "", role: "" }, // Stores user being edited
            originalUser: null, // Store original data for comparison
            valid: false,
            rules: {
                required: value => !!value || "This field is required",
                email: value => /.+@.+\..+/.test(value) || "E-mail must be valid",
            },
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
    computed: {
        isFormValid() {
            return (
                this.editedUser.name.trim() !== "" &&
                this.editedUser.email.trim() !== "" &&
                /.+@.+\..+/.test(this.editedUser.email) &&
                this.editedUser.role.trim() !== ""
            );
        },
        isEdited() {
            return JSON.stringify(this.originalUser) !== JSON.stringify(this.editedUser);
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
        // Open dialog for adding a new user
        openAddUserDialog() {
            this.isEditing = false;
            this.editedUser = { name: "", email: "", role: "" };
            this.dialog = true;
        },
        // Open dialog for editing an existing user
        editUser(user) {
            this.isEditing = true;
            this.editedUser = { ...user };
            this.originalUser = { ...user }; // Store original user data for comparison
            this.dialog = true;
        },
        // Save edited user to Firestore
        async updateUser() {
            if (!this.$refs.userForm.validate()) return; // Validate form before submitting

            try {
                const userRef = doc(db, "users", this.editedUser.id);
                await updateDoc(userRef, {
                    name: this.editedUser.name,
                    email: this.editedUser.email,
                    role: this.editedUser.role
                });

                this.dialog = false;
                this.fetchUsers();
            } catch (error) {
                console.error("Error updating user:", error);
            }
        },
        // Add new user to Firestore
        async addUser() {
            if (!this.$refs.userForm.validate()) return; // Validate form before submitting

            try {
                await addDoc(collection(db, "users"), {
                    name: this.editedUser.name,
                    email: this.editedUser.email,
                    role: this.editedUser.role,
                    createdAt: new Date() // Store the created timestamp
                });

                this.dialog = false;
                this.fetchUsers();
            } catch (error) {
                console.error("Error adding user:", error);
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
        },
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
            <v-btn color="green" @click="openAddUserDialog">
                <v-icon left>mdi-plus</v-icon> Add User
            </v-btn>
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
            <v-card-title>{{ isEditing ? "Edit User" : "Add User" }}</v-card-title>
            <v-card-text>
                <v-form ref="userForm">
                    <v-text-field v-model="editedUser.name" label="Name" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="editedUser.email" label="Email"  :rules="[rules.required, rules.email]"></v-text-field>
                    <v-text-field v-model="editedUser.role" label="Role" :rules="[rules.required]"></v-text-field >
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" text @click="dialog = false">Cancel</v-btn>
                <v-btn :disabled="isEditing ? !isEdited : !isFormValid" color="blue" text
                    @click="isEditing ? updateUser() : addUser()">
                    {{ isEditing ? "Save Changes" : "Add User" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.v-btn {
    margin: 0 10px;
}
</style>