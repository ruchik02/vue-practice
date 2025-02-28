<template>
    <v-card class="ma-4">
        <!-- Header Section -->
        <v-card-title class="d-flex align-center justify-space-between pa-4">
            <div class="d-flex align-center flex-grow-1">
                <!-- <h2 class="text-h5 font-weight-bold mr-4">User Management</h2> -->
                <v-text-field
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    label="Search users..."
                    hide-details
                    density="comfortable"
                    variant="outlined"
                    class="max-width-400"
                ></v-text-field>
            </div>
            <v-btn
                color="success"
                prepend-icon="mdi-plus"
                @click="openAddDialog"
            >
                Add User
            </v-btn>
        </v-card-title>

        <!-- Data Table -->
        <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            :loading="loading"
            :items-per-page="pageSize"
            hide-default-footer
        >
            <template v-slot:no-data>
                <v-alert type="info" text="No users available"></v-alert>
            </template>

            <template v-slot:item.role="{ item }">
                <v-chip
                    :color="getRoleColor(item.role)"
                    size="small"
                    class="text-capitalize"
                >
                    {{ item.role }}
                </v-chip>
            </template>

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
        </v-data-table>

        <!-- Pagination -->
        <user-pagination
            v-model:page-size="pageSize"
            :loading="loading"
            :is-prev-disabled="isPrevDisabled"
            :is-next-disabled="isNextDisabled"
            @previous="loadPreviousPage"
            @next="loadNextPage"
            @update:page-size="handlePageSizeChange"
        />

        <!-- User Dialog -->
        <user-dialog
            v-model="dialog"
            :user="editedUser"
            :is-editing="isEditing"
            @save="saveUser"
        />

        <!-- Delete Confirmation -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
                <v-card-title>Confirm Delete</v-card-title>
                <v-card-text>
                    Are you sure you want to delete this user?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" text @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="error" text @click="handleDelete">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Notifications -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            timeout="3000"
        >
            {{ snackbar.text }}
        </v-snackbar>
    </v-card>
</template>

<script>
import { useUsers } from '@/composables/useUsers'
import UserDialog from './UserDialog.vue'
import UserPagination from './UserPagination.vue'

export default {
    components: {
        UserDialog,
        UserPagination
    },

    setup() {
        const {
            users,
            loading,
            pageSize,
            isNextDisabled,
            isPrevDisabled,
            fetchUsers,
            addUser,
            updateUser,
            deleteUser
        } = useUsers()

        return {
            users,
            loading,
            pageSize,
            isNextDisabled,
            isPrevDisabled,
            fetchUsers,
            addUser,
            updateUser,
            deleteUser
        }
    },

    data() {
        return {
            search: '',
            dialog: false,
            deleteDialog: false,
            isEditing: false,
            editedUser: null,
            userToDelete: null,
            snackbar: {
                show: false,
                text: '',
                color: 'success'
            },
            headers: [
                { title: 'Name', key: 'name' },
                { title: 'Email', key: 'email' },
                { title: 'Role', key: 'role' },
                { title: 'Created At', key: 'createdAt' },
                { title: 'Actions', key: 'actions', sortable: false }
            ]
        }
    },

    methods: {
        openAddDialog() {
            this.isEditing = false
            this.editedUser = { name: '', email: '', role: '' }
            this.dialog = true
        },

        editUser(item) {
            this.isEditing = true
            this.editedUser = { ...item.columns }
            this.dialog = true
        },

        async saveUser(userData) {
            try {
                if (this.isEditing) {
                    await this.updateUser({
                        id: this.editedUser.id,
                        ...userData
                    })
                    this.showNotification('User updated successfully')
                } else {
                    await this.addUser(userData)
                    this.showNotification('User added successfully')
                }
                this.dialog = false
                await this.fetchUsers()
            } catch (error) {
                this.showNotification(error.message, 'error')
            }
        },

        confirmDelete(item) {
            this.userToDelete = {
                id: item.id,
                ...item
            }
            this.deleteDialog = true
        },

        async handleDelete() {
            try {
                if (!this.userToDelete?.id) {
                    throw new Error('User ID is missing')
                }
                await this.deleteUser(this.userToDelete.id)
                this.deleteDialog = false
                this.userToDelete = null
                await this.fetchUsers()
                this.showNotification('User deleted successfully')
            } catch (error) {
                this.showNotification(error.message, 'error')
            }
        },

        showNotification(text, color = 'success') {
            this.snackbar = {
                show: true,
                text,
                color
            }
        },

        getRoleColor(role) {
            const colors = {
                admin: 'error',
                teacher: 'warning',
                student: 'success',
                user: 'info'
            }
            return colors[role.toLowerCase()] || 'grey'
        },

        async handlePageSizeChange() {
            await this.fetchUsers(false)
        },

        async loadNextPage() {
            await this.fetchUsers(true)
        },

        async loadPreviousPage() {
            await this.fetchUsers(false)
        }
    },

    mounted() {
        this.fetchUsers()
    }
}
</script>

<style scoped>
.max-width-400 {
    max-width: 400px;
}

.gap-2 {
    gap: 8px;
}

.v-data-table {
    min-height: 400px;
}
</style> 