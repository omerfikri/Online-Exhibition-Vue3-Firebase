<template>
  <nav class="deep-purple lighten-3">
    <div>
      <router-link :to="{ name: 'ExhibitionList' }" class="brand-logo"
        >Online Exhibition</router-link
      >
      <ul class="right">
        <li>
          <a class="waves-effect waves-teal btn-flat" @click="handleLogin"
            ><i class="fab fa-google-plus-g"></i
          ></a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import { auth, db } from "@/firebase/config";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { useRouter } from "vue-router";
  import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
  } from "firebase/firestore";
  export default {
    setup() {
      const router = useRouter();
      const handleLogin = async () => {
        const provider = new GoogleAuthProvider();

        await signInWithPopup(auth, provider).then(async () => {
          const { uid, displayName, email, photoURL } = auth.currentUser;

          const q = query(collection(db, "users"), where("uid", "==", uid));
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            console.log("User Not Found");

            const newUser = {
              uid,
              userName: displayName,
              email,
              photoURL: photoURL,
              position: "yok",
            };

            await addDoc(collection(db, "users"), newUser).then(() => {
              router.push({ name: "Profile" });
            });
          } else {
            router.push({ name: "Profile" });
          }
        });
      };
      return { handleLogin };
    },
  };
</script>

<style></style>
