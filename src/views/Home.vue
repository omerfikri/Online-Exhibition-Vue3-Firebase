<template>
  <HomeNavbar />
  <div class="container">
    <!-- <ExhibitionList/> -->
    <router-view />
  </div>
</template>

<script>
  import HomeNavbar from "@/components/home/HomeNavbar.vue";
  import ExhibitionList from "./home/ExhibitionList.vue";
  export default {
    components: {
      HomeNavbar,
      ExhibitionList,
    },
  };
</script>
