import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase/config";
import getAuthority from "@/composables/getAuthority";
import Home from "../views/Home.vue";
import ExhibitionList from "@/views/home/ExhibitionList.vue";
import Admin from "@/views/admin/Admin.vue";
import Profile from "@/views/admin/Profile.vue";
import Management from "@/views/admin/Management.vue";
import Messages from "@/views/admin/Messages.vue";
import AddImage from "@/views/admin/AddImage.vue";
import CreateExhibition from "@/views/admin/CreateExhibition.vue";
import Exhibition from "@/views/home/Exhibition.vue";

const authControl = (to, from, next) => {
  let kullanici = auth.currentUser;

  if (!kullanici) {
    next({ name: "ExhibitionList" });
  } else {
    next();
  }
};

const adminControl = async (to, from, next) => {
  let kullanici = auth.currentUser;

  const { authority } = await getAuthority(kullanici.uid);

  if (authority.value != "admin") {
    next({ name: "Profile" });
  } else {
    next();
  }
};

const managerControl = async (to, from, next) => {
  let kullanici = auth.currentUser;

  const { authority } = await getAuthority(kullanici.uid);

  if (authority.value == "manager" || authority.value == "admin") {
    next();
  } else {
    next({ name: "Profile" });
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      children: [
        {
          path: "exhibition-list",
          name: "ExhibitionList",
          component: ExhibitionList,
        },
        {
          path: "exhibition-list/:exhibitionId",
          name: "Exhibition",
          component: Exhibition,
        },
      ],
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      children: [
        {
          path: "profile",
          name: "Profile",
          component: Profile,
        },
        {
          path: "messages",
          name: "Messages",
          component: Messages,
          beforeEnter: adminControl,
        },
        {
          path: "management",
          name: "Management",
          component: Management,
          beforeEnter: adminControl,
        },
        {
          path: "create-exhibition",
          name: "CreateExhibition",
          component: CreateExhibition,
          beforeEnter: adminControl,
        },
        {
          path: "add-image",
          name: "AddImage",
          component: AddImage,
          beforeEnter: managerControl,
        },
      ],
      beforeEnter: authControl,
    },
  ],
});

export default router;
