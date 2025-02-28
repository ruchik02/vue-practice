<script>
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, endBefore, limitToLast } from "firebase/firestore";
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
            pageSize: 10, // Number of users per page
            lastVisible: null, // Stores last document of current page
            firstVisible: null, // Stores first document of current page
            isNextDisabled: false, // Disable next if no more users
            isPrevDisabled: true, // Disable prev on first page
            loading: false,
            deleteDialog: false,
            userToDelete: null,
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
        // Fetch users from Firestore with pagination
        async fetchUsers(isNext = true) {
            this.loading = true;
            try {
                let userQuery;
                const usersCollection = collection(db, "users");
                
                if (isNext && this.lastVisible) {
                    userQuery = query(
                        usersCollection, 
                        orderBy("createdAt", "desc"), 
                        startAfter(this.lastVisible), 
                        limit(this.pageSize)
                    );
                } else {
                    userQuery = query(
                        usersCollection, 
                        orderBy("createdAt", "desc"), 
                        limit(this.pageSize)
                    );
                    this.isPrevDisabled = true;
                }

                const querySnapshot = await getDocs(userQuery);
                
                if (!querySnapshot.empty) {
                    this.users = querySnapshot.docs.map(doc => {
                        let userData = doc.data();
                        return {
                            id: doc.id,
                            name: userData.name,
                            email: userData.email,
                            role: userData.role,
                            createdAt: userData.createdAt
                                ? new Date(userData.createdAt.seconds * 1000).toLocaleString()
                                : "N/A"
                        };
                    });

                    // Update pagination trackers
                    this.firstVisible = querySnapshot.docs[0];
                    this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                    
                    // Check for next page
                    const nextQuery = query(
                        usersCollection,
                        orderBy("createdAt", "desc"),
                        startAfter(this.lastVisible),
                        limit(1)
                    );
                    const nextSnapshot = await getDocs(nextQuery);
                    this.isNextDisabled = nextSnapshot.empty;
                    
                    if (isNext) {
                        this.isPrevDisabled = false;
                    }
                } else {
                    if (this.lastVisible !== null) {
                        // If no results and not on first page, reset and fetch first page
                        this.lastVisible = null;
                        this.firstVisible = null;
                        await this.fetchUsers(false);
                    } else {
                        // If on first page and no results, show empty state
                        this.users = [];
                        this.isNextDisabled = true;
                        this.isPrevDisabled = true;
                    }
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                this.users = [];
                this.isNextDisabled = true;
                this.isPrevDisabled = true;
            } finally {
                this.loading = false;
            }
        },
        // Fetch previous users
        async fetchPreviousUser() {
            this.loading = true;
            try {
                const usersCollection = collection(db, "users");
                
                if (!this.firstVisible) {
                    this.isPrevDisabled = true;
                    return;
                }

                const previousQuery = query(
                    usersCollection,
                    orderBy("createdAt", "desc"),
                    endBefore(this.firstVisible),
                    limitToLast(this.pageSize)
                );

                const querySnapshot = await getDocs(previousQuery);

                if (!querySnapshot.empty) {
                    this.users = querySnapshot.docs.map(doc => {
                        let userData = doc.data();
                        return {
                            id: doc.id,
                            name: userData.name,
                            email: userData.email,
                            role: userData.role,
                            createdAt: userData.createdAt
                                ? new Date(userData.createdAt.seconds * 1000).toLocaleString()
                                : "N/A"
                        };
                    });

                    // Update pagination trackers
                    this.firstVisible = querySnapshot.docs[0];
                    this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                    
                    // Enable next button since we moved backwards
                    this.isNextDisabled = false;

                    // Check if we're at the start
                    const prevQuery = query(
                        usersCollection,
                        orderBy("createdAt", "desc"),
                        endBefore(this.firstVisible),
                        limitToLast(1)
                    );
                    const prevSnapshot = await getDocs(prevQuery);
                    this.isPrevDisabled = prevSnapshot.empty;
                } else {
                    // If no previous results, we're at the start
                    this.isPrevDisabled = true;
                }
            } catch (error) {
                console.error("Error fetching previous users:", error);
            } finally {
                this.loading = false;
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
            if (!this.$refs.userForm.validate()) return;

            this.loading = true;
            try {
                const userRef = doc(db, "users", this.editedUser.id);
                await updateDoc(userRef, {
                    name: this.editedUser.name,
                    email: this.editedUser.email,
                    role: this.editedUser.role,
                    updatedAt: new Date() // Optional: track update time
                });

                // Close dialog first
                this.dialog = false;
                
                // Reset pagination to first page
                this.lastVisible = null;
                this.firstVisible = null;
                
                // Fetch fresh data
                await this.fetchUsers(true);
                
            } catch (error) {
                console.error("Error updating user:", error);
                // Show error message to user
                alert("Failed to update user. Please try again.");
            } finally {
                this.loading = false;
            }
        },
        // Add new user to Firestore
        async addUser() {
            if (!this.$refs.userForm.validate()) return;

            this.loading = true;
            try {
                // Add the new user
                await addDoc(collection(db, "users"), {
                    name: this.editedUser.name,
                    email: this.editedUser.email,
                    role: this.editedUser.role,
                    createdAt: new Date() // Store the created timestamp
                });

                // Close the dialog first
                this.dialog = false;

                // Reset pagination to first page
                this.lastVisible = null;
                this.firstVisible = null;
                this.isNextDisabled = false;
                this.isPrevDisabled = true;

                // Fetch fresh data
                await this.fetchUsers(false); // Pass false to fetch from the beginning
            } catch (error) {
                console.error("Error adding user:", error);
                alert("Failed to add user. Please try again.");
            } finally {
                this.loading = false;
                // Reset the form
                this.editedUser = { name: "", email: "", role: "" };
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
        getRoleColor(role) {
            const colors = {
                admin: 'error',
                teacher: 'warning',
                student: 'success',
                user: 'info'
            };
            return colors[role.toLowerCase()] || 'grey';
        },
        // Handle page size change
        async handlePageSizeChange() {
            // Reset pagination trackers
            this.lastVisible = null;
            this.firstVisible = null;
            this.isNextDisabled = false;
            this.isPrevDisabled = true;
            await this.fetchUsers(true);
        },
        // Load next page with validation
        async loadNextPage() {
            if (!this.isNextDisabled && !this.loading) {
                await this.fetchUsers(true);
            }
        },
        // Load previous page with validation
        async loadPreviousPage() {
            if (!this.isPrevDisabled && !this.loading) {
                await this.fetchPreviousUser();
            }
        },
        confirmDelete(item) {
            this.userToDelete = item;
            this.deleteDialog = true;
        },
        async deleteUser() {
            if (!this.userToDelete) return;
            
            this.loading = true;
            try {
                await deleteDoc(doc(db, "users", this.userToDelete.id));
                await this.fetchUsers();
                this.deleteDialog = false;
                this.userToDelete = null;
            } catch (error) {
                console.error("Error deleting user:", error);
            } finally {
                this.loading = false;
            }
        },
        // Add a refresh method
        async refreshData() {
            // Reset pagination
            this.lastVisible = null;
            this.firstVisible = null;
            this.isNextDisabled = false;
            this.isPrevDisabled = true;
            
            // Fetch fresh data
            await this.fetchUsers(true);
        },
        // Optional: Add a success notification method
        showSuccessNotification(message) {
            // If you have a notification system, implement it here
            console.log(message);
        }
    },
    mounted() {
        this.fetchUsers();
    }
}
</script>
<template>
    <v-card class="ma-4">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap pa-4">
            <div class="d-flex align-center flex-grow-1">
                <v-text-field
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    label="Search users..."
                    single-line
                    hide-details
                    density="comfortable"
                    variant="outlined"
                    class="flex-grow-1 max-width-400"
                ></v-text-field>
            </div>
            <v-btn
                color="success"
                prepend-icon="mdi-plus"
                @click="openAddUserDialog"
                class="ml-4"
            >
                Add User
            </v-btn>
        </v-card-title>

        <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            :loading="loading"
            :items-per-page="pageSize"
            class="elevation-1"
        >
            <!-- Add No Data Message -->
            <template v-slot:no-data>
                <v-alert
                    type="info"
                    class="ma-4"
                    text="No users available"
                ></v-alert>
            </template>

            <!-- Add Loading Message -->
            <template v-slot:loading>
                <v-skeleton-loader
                    type="table-row-divider@3"
                    :loading="loading"
                ></v-skeleton-loader>
            </template>

            <!-- Custom Header -->
            <template v-slot:header.actions>
                <span class="font-weight-bold">Actions</span>
            </template>

            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
                <div class="d-flex gap-2">
                    <v-btn
                        icon="mdi-pencil"
                        size="small"
                        color="primary"
                        variant="text"
                        @click="editUser(item)"
                    ></v-btn>
                    <v-btn
                        icon="mdi-delete"
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmDelete(item)"
                    ></v-btn>
                </div>
            </template>

            <!-- Role Column with Chip -->
            <template v-slot:item.role="{ item }">
                <v-chip
                    :color="getRoleColor(item.role)"
                    size="small"
                    class="text-capitalize"
                >
                    {{ item.role }}
                </v-chip>
            </template>

            <!-- Bottom Pagination -->
            <template v-slot:bottom>
                <div class="d-flex align-center justify-space-between pa-4">
                    <v-btn
                        :disabled="loading || isPrevDisabled"
                        @click="loadPreviousPage"
                        prepend-icon="mdi-chevron-left"
                        variant="text"
                    >
                        Previous
                    </v-btn>
                    <div class="d-flex align-center">
                        <span class="mr-4">Items per page:</span>
                        <v-select
                            v-model="pageSize"
                            :items="[5, 10, 15, 20]"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="page-size-select"
                            @update:model-value="handlePageSizeChange"
                        ></v-select>
                    </div>
                    <v-btn
                        :disabled="loading || isNextDisabled"
                        @click="loadNextPage"
                        append-icon="mdi-chevron-right"
                        variant="text"
                    >
                        Next
                    </v-btn>
                </div>
            </template>
        </v-data-table>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h5">Confirm Delete</v-card-title>
                <v-card-text>
                    Are you sure you want to delete this user? This action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey-darken-1"
                        variant="text"
                        @click="deleteDialog = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="error"
                        variant="text"
                        @click="deleteUser"
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
    <!-- edit container -->
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>{{ isEditing ? "Edit User" : "Add User" }}</v-card-title>
            <v-card-text>
                <v-form ref="userForm">
                    <v-text-field v-model="editedUser.name" label="Name" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="editedUser.email" label="Email"
                        :rules="[rules.required, rules.email]"></v-text-field>
                    <v-text-field v-model="editedUser.role" label="Role" :rules="[rules.required]"></v-text-field>
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

.max-width-400 {
    max-width: 400px;
}

.page-size-select {
    width: 100px;
}

.gap-2 {
    gap: 8px;
}

/* Add transition for loading state */
.v-data-table {
    transition: opacity 0.3s ease;
}

.v-data-table--loading {
    opacity: 0.7;
}

.v-data-table {
    min-height: 400px; /* Add minimum height to prevent layout shift */
}

.v-alert {
    margin: 16px;
}
</style>