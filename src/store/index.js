import { createStore } from "vuex";
import { auth } from "@/firebaseConfig";
import createPersistedState from "vuex-persistedstate";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
const store = createStore({
  state: {
    user: null, // store user state

  },
  mutations: {
    setUser(state,user){
        state.user = user;

    },
    clearUser(state){
        state.user = null;
    }

  },
  actions: {
    async signup({commit}, {email,password}){
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            commit("setUser", userCredential.user);
        } catch (error) {
            throw error;
        }
    },
    async login({commit}, {email, password}){
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            commit("setUser", userCredential.user);
        } catch (error) {
            throw error;
        }

    },
    async signout({commit}){
        await signOut(auth);
        commit("clearUser");
    },
    fetchUser({commit}){
        onAuthStateChanged(auth, (user) => {
            if(user){
                commit("setUser", user);
            } else {
                commit("clearUser");
            }
        })
    }
  },
  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => !!state.user
  },
  plugins: [createPersistedState()],
})
export default store;