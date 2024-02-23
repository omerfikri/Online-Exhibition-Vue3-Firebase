<template>
  <div class="card black">
    <div class="card-content">
      <div class="slider">
        <ul class="slides">
          <li v-for="image in images" :key="image.id">
            <img :src="image.imageURL" />
            <div class="caption left-align">
              <p>Image Name {{ image.imageName }}</p>
              <p class="light red-text text-lighten-3">
                {{ image.artistName }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { onMounted, ref, onUpdated } from "vue";
  import { useRoute } from "vue-router";
  import { db } from "@/firebase/config";
  import {
    query,
    where,
    collection,
    orderBy,
    getDocs,
  } from "firebase/firestore";
  export default {
    setup() {
      const route = useRoute();
      const images = ref([]);

      onMounted(async () => {
        const ref = collection(db, "images");
        const exhibitionImages = await getDocs(
          query(
            ref,
            where("exhibitionID", "==", route.params.exhibitionId),
            orderBy("imageOrder")
          )
        );

        exhibitionImages.docs.forEach((doc) => {
          images.value.push({ ...doc.data(), id: doc.id });
        });
      });

      onUpdated(() => {
        var elems = document.querySelectorAll(".slider");
        var instances = M.Slider.init(elems, {
          interval: 1200,
          duration: 3000,
          height: 400,
        });
      });

      return { images };
    },
  };
</script>

<style></style>
