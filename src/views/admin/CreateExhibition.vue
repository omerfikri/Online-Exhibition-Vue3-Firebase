<template>
  <div class="row">
    <div class="col s12 m6 l6">
      <div class="card grey darken-1">
        <div class="card-content">
          <p class="card-title">Create Exhibition</p>
          <form @submit.prevent="createExhibition">
            <label class="red-text text-darken-4">Exhibition Name:</label>
            <input class="input-field" v-model="exhibitionName" />
            <button class="btn red darken-3">Save</button>
          </form>
        </div>
      </div>
    </div>
    <div class="col s12 m6 l6">
      <div class="card grey darken-1">
        <div class="card-content">
          <p class="card-title">Exhibition List</p>
          <ul class="collection">
            <li
              class="collection-item"
              v-for="exhibition in exhibitions"
              :key="exhibition.id"
            >
              <span class="title">{{ exhibition.exhibitionName }}</span>
              <span>
                <a
                  style="cursor: pointer"
                  @click="exhibitionUpdate(exhibition.id)"
                  class="secondary-content"
                >
                  <i :class="exhibition.icon"></i>
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import { db, timestamp } from "@/firebase/config";
  import {
    addDoc,
    collection,
    orderBy,
    onSnapshot,
    query,
    getDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import getUser from "@/composables/getUser";
  export default {
    setup() {
      const exhibitionName = ref("");
      const { kullanici } = getUser();
      const exhibitions = ref([]);

      onMounted(async () => {
        const res = query(
          collection(db, "exhibitions"),
          orderBy("createdDate", "desc")
        );

        onSnapshot(res, (snap) => {
          exhibitions.value = [];
          snap.docs.forEach((doc) => {
            exhibitions.value.push({ ...doc.data(), id: doc.id });
          });
        });
      });

      const createExhibition = async () => {
        if (exhibitionName.value != "") {
          let exhibition = {
            exhibitionName: exhibitionName.value,
            activity: true,
            icon: "fas fa-level-down-alt red-text text-darken-2",
            createdDate: timestamp,
            creatorUID: kullanici.value.uid,
          };

          await addDoc(collection(db, "exhibitions"), exhibition).then(() => {
            exhibitionName.value = "";
          });
        }
      };

      const exhibitionUpdate = async (id) => {
        const data = await getDoc(doc(db, "exhibitions", id));
        let activity = data.data().activity == true ? false : true;
        let icon =
          data.data().icon == "fas fa-level-down-alt red-text text-darken-2"
            ? "fas fa-level-up-alt green-text text-darken-2"
            : "fas fa-level-down-alt red-text text-darken-2";

        const dataRef = doc(db, "exhibitions", id);
        await updateDoc(dataRef, {
          icon: icon,
          activity: activity,
        });
      };
      return {
        exhibitionName,
        exhibitions,
        createExhibition,
        exhibitionUpdate,
      };
    },
  };
</script>

<style></style>
