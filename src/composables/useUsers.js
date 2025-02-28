import { ref } from 'vue'
import { db } from '@/firebaseConfig'
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    limit, 
    startAfter, 
    endBefore, 
    limitToLast 
} from "firebase/firestore"

export function useUsers() {
    const users = ref([])
    const loading = ref(false)
    const pageSize = ref(10)
    const lastVisible = ref(null)
    const firstVisible = ref(null)
    const isNextDisabled = ref(false)
    const isPrevDisabled = ref(true)

    // Add resetState function
    function resetState() {
        users.value = []
        lastVisible.value = null
        firstVisible.value = null
        isNextDisabled.value = false
        isPrevDisabled.value = true
    }

    // Handle empty results
    function handleEmptyResults(isNext) {
        if (isNext) {
            isNextDisabled.value = true
        } else {
            isPrevDisabled.value = true
        }
    }

    // Fetch users with pagination
    async function fetchUsers(isNext = true) {
        loading.value = true
        try {
            const usersCollection = collection(db, "users")
            let userQuery

            if (isNext && lastVisible.value) {
                userQuery = query(
                    usersCollection,
                    orderBy("createdAt", "desc"),
                    startAfter(lastVisible.value),
                    limit(pageSize.value)
                )
            } else {
                userQuery = query(
                    usersCollection,
                    orderBy("createdAt", "desc"),
                    limit(pageSize.value)
                )
                isPrevDisabled.value = true
            }

            const querySnapshot = await getDocs(userQuery)
            
            if (!querySnapshot.empty) {
                users.value = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt
                        ? new Date(doc.data().createdAt.seconds * 1000).toLocaleString()
                        : "N/A"
                }))

                firstVisible.value = querySnapshot.docs[0]
                lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1]

                // Check for next page
                const nextSnapshot = await getDocs(
                    query(
                        usersCollection,
                        orderBy("createdAt", "desc"),
                        startAfter(lastVisible.value),
                        limit(1)
                    )
                )
                isNextDisabled.value = nextSnapshot.empty
                
                if (isNext) {
                    isPrevDisabled.value = false
                }
            } else {
                handleEmptyResults(isNext)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
            resetState()
        } finally {
            loading.value = false
        }
    }

    // Add new user
    async function addUser(userData) {
        try {
            const usersCollection = collection(db, "users")
            const newUserData = {
                ...userData,
                createdAt: new Date()
            }
            await addDoc(usersCollection, newUserData)
        } catch (error) {
            console.error("Error adding user:", error)
            throw new Error("Failed to add user")
        }
    }

    // Update existing user
    async function updateUser(userData) {
        try {
            const userRef = doc(db, "users", userData.id)
            const updateData = {
                name: userData.name,
                email: userData.email,
                role: userData.role
            }
            await updateDoc(userRef, updateData)
        } catch (error) {
            console.error("Error updating user:", error)
            throw new Error("Failed to update user")
        }
    }

    // Delete user
    async function deleteUser(userId) {
        try {
            if (!userId) {
                throw new Error("User ID is required for deletion")
            }
            const userRef = doc(db, "users", userId)
            await deleteDoc(userRef)
            await fetchUsers()
        } catch (error) {
            console.error("Error deleting user:", error)
            throw new Error("Failed to delete user")
        }
    }

    return {
        users,
        loading,
        pageSize,
        isNextDisabled,
        isPrevDisabled,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
    }
} 