<template>
  <HomeNavbar />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
  import HomeNavbar from "@/components/home/HomeNavbar.vue";
  export default {
    components: {
      HomeNavbar,
    },
  };
</script>
