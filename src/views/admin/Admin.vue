<template>
  <AdminNavbarVue />
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script>
  import AdminNavbarVue from "@/components/admin/AdminNavbar.vue";

  export default {
    components: {
      AdminNavbarVue,
    },
  };
</script>

<style></style>
