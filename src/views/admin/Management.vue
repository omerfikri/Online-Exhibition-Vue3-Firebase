<template>
  <div class="row">
    <div class="col s12 m12 hoverable">
      <div class="card blue-grey lighten-2">
        <div class="card-content black-text">
          <span class="card-title">Admin List</span>
          <ul class="collection">
            <li
              class="collection-item avatar"
              v-for="user in users"
              :key="user.id"
            >
              <img :src="user.photoURL" alt="" class="circle" />
              <span class="title red-text">{{ user.userName }}</span>
              <p>Position : {{ user.position }}</p>
              <a class="secondary-content btn-floating black">
                <i
                  class="fas fa-key red-text text-darken-2"
                  @click="showPosition(user.id)"
                ></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="row" v-if="show">
    <div class="col s12 m12 hoverable">
      <div class="card black">
        <div class="card-content white-text">
          <span class="card-title red-text text-darken-3"
            >{{ userName }} for Edit</span
          >
          <p class="white-text">
            Position :
            <span class="red-text text-darken-3">{{ position }}</span>
          </p>
          <!-- <p>
            <label>
              <input
                class="with-gap"
                type="radio"
                name="grup1"
                value="no"
                v-model="positionType"
              />
              <span>NO</span>
            </label>
          </p>
          <p>
            <label>
              <input
                class="with-gap"
                type="radio"
                name="grup1"
                value="manager"
                v-model="positionType"
              />
              <span>Manager</span>
            </label>
          </p>
          <p>
            <label>
              <input
                class="with-gap"
                type="radio"
                name="grup1"
                value="admin"
                v-model="positionType"
              />
              <span>Admin</span>
            </label>
          </p> -->
          <p>Choose Position</p>
          <p v-for="position in positions" :key="position">
            <label>
              <input
                class="with-gap"
                type="radio"
                name="grup1"
                :value="position.positionType"
                v-model="positionType"
              />
              <span>{{ position.positionName }}</span>
            </label>
          </p>
        </div>
        <div class="card-action">
          <a @click="changePosition" class="white-text btn red darken-4"
            >Change Position</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import { db } from "@/firebase/config";
  import {
    collection,
    onSnapshot,
    query,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    orderBy,
  } from "firebase/firestore";
  export default {
    setup() {
      const users = ref([]);
      const show = ref(false);
      const userName = ref("");
      const position = ref("");
      const positionType = ref("");
      const docId = ref("");
      const positions = ref([]);

      onMounted(async () => {
        const res = query(collection(db, "users"));

        onSnapshot(res, (snap) => {
          users.value = [];
          snap.docs.forEach((doc) => {
            users.value.push({ ...doc.data(), id: doc.id });
          });
        });

        const positionSnap = await getDocs(
          query(collection(db, "positions"), orderBy("order"))
        );
        positionSnap.docs.forEach((doc) => {
          positions.value.push(doc.data());
        });
      });

      const showPosition = async (id) => {
        show.value = true;
        docId.value = id;

        const snap = await getDoc(doc(db, "users", id));

        userName.value = snap.data().userName;
        position.value = snap.data().position;
      };

      const changePosition = async () => {
        const userRef = doc(db, "users", docId.value);
        await updateDoc(userRef, {
          position: positionType.value,
        });
      };

      return {
        users,
        show,
        userName,
        position,
        positionType,
        positions,
        showPosition,
        changePosition,
      };
    },
  };
</script>

<style></style>
