import { createStore } from "vuex";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
const store = createStore({
  state: {
    user: null, // store user state
    isAuthChecked: false, // Firebase auth state is checked before loading app

  },
  mutations: {
    setUser(state,user){
        state.user = user;
        state.isAuthChecked = true;

    },
    clearUser(state){
        state.user = null;
        state.isAuthChecked = true;
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
    fetchUser({ commit }) {
        return new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              commit("setUser", user);
            } else {
              commit("clearUser");
            }
            resolve(); // the app waits for Firebase state check before mounting
          });
        });
      },
  },
  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => !!state.user
  },
})
export default store;