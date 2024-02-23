<template>
  <div class="row">
    <div class="col s12 m12 l12">
      <div class="card orange lighten-4">
        <div class="card-content">
          <h4 class="card-title">Exhibitions</h4>
          <ul class="collapsible popout">
            <li v-for="exhibition in exhibitions" :key="exhibition.id">
              <div class="collapsible-header">
                {{ exhibition.exhibitionName }}
              </div>
              <div class="collapsible-body center-align">
                <span>Explanations</span><br />
                <router-link
                  :to="{
                    name: 'Exhibition',
                    params: { exhibitionId: exhibition.id },
                  }"
                  class="btn waves-effect waves-red red lighten-2"
                  >Sergiyi Gez</router-link
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import { db } from "@/firebase/config";
  import { query, where, collection, onSnapshot } from "firebase/firestore";
  export default {
    setup() {
      const exhibitions = ref([]);
      onMounted(async () => {
        M.AutoInit();
        const res = query(
          collection(db, "exhibitions"),
          where("activity", "==", true)
        );
        onSnapshot(res, (snap) => {
          exhibitions.value = [];
          snap.docs.forEach((doc) => {
            exhibitions.value.push({ ...doc.data(), id: doc.id });
          });
        });
      });
      return { exhibitions };
    },
  };
</script>

<style></style>
