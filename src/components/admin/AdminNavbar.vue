<template>
  <nav class="black">
    <li class="brand-logo">Online Exhibition Admin</li>
    <ul class="right">
      <span v-if="adminBtn || employeeBtn">
        <li>
          <a class="waves-effect waves-red btn-flat navbar-btn">Sergi</a>
        </li>
        <li>
          <a class="waves-effect waves-red btn-flat navbar-btn">Resim</a>
        </li>
      </span>
      <span v-if="adminBtn">
        <li>
          <a class="waves-effect waves-red btn-flat navbar-btn">Yönetim</a>
        </li>
        <li>
          <a class="waves-effect waves-red btn-flat navbar-btn">Mesajlar</a>
        </li>
      </span>
      <li>
        <router-link
          :to="{ name: 'Profile' }"
          class="waves-effect waves-red btn-flat navbar-btn"
          >Profile</router-link
        >
      </li>
      <li>
        <a
          class="waves-effect waves-light btn-small red darken-4"
          @click="handleOut"
          >Log Out</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
  import { auth, db } from "@/firebase/config";
  import { useRouter } from "vue-router";
  import { signOut } from "firebase/auth";
  import { onMounted, ref } from "vue";
  import getUser from "@/composables/getUser";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import getAuthority from "@/composables/getAuthority";

  export default {
    setup() {
      const adminBtn = ref(false);
      const employeeBtn = ref(false);

      const router = useRouter();

      //  const {position} = getAuthority()

      onMounted(async () => {
        const { kullanici } = getUser();

        const q = query(
          collection(db, "users"),
          where("uid", "==", kullanici.value.uid)
        );
        const snap = await getDocs(q);

        snap.forEach((doc) => {
          if (doc.data().position == "admin") {
            adminBtn.value = true;
            employeeBtn.value = true;
          } else if (doc.data().position == "manager") {
            adminBtn.value = false;
            employeeBtn.value = true;
          } else {
            adminBtn.value = false;
            employeeBtn.value = false;
          }
        });
      });

      const handleOut = async () => {
        await signOut(auth).then(() => {
          router.push({ name: "ExhibitionList" });
        });
      };
      return { handleOut, adminBtn, employeeBtn };
    },
  };
</script>

<style></style>
