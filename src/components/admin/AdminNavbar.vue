<template>
  <nav class="black">
    <li class="brand-logo">Online Exhibition</li>
    <ul class="right">
      <span v-if="adminBtn || employeeBtn">
        <li>
          <router-link
            :to="{ name: 'CreateExhibition' }"
            class="waves-effect waves-red btn-flat navbar-btn"
            >Exhibition</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'AddImage' }"
            class="waves-effect waves-red btn-flat navbar-btn"
            >Picture</router-link
          >
        </li>
      </span>
      <span v-if="adminBtn">
        <li>
          <router-link
            :to="{ name: 'Management' }"
            class="waves-effect waves-red btn-flat navbar-btn"
            >Management</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'Messages' }"
            class="waves-effect waves-red btn-flat navbar-btn"
            >Messages</router-link
          >
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

  export default {
    setup() {
      const adminBtn = ref(false);
      const employeeBtn = ref(false);

      const router = useRouter();

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
