import useAuthStore from "@/store/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/admin",
      component: () => import("../features/AdminLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "admin-dashboard",
          component: () => import("../views/admin/DashboardView.vue"),
          meta: { title: "Dashboard" },
        },
        {
          path: "posts",
          name: "admin-posts",
          component: () => import("../views/admin/PostsView.vue"),
          meta: { title: "Mis Posts" },
        },
        {
          path: "posts/:slug/collaborators",
          name: "admin-collaborators",
          component: () => import("../views/admin/CollaboratorsView.vue"),
          meta: { title: "Colaboradores" },
        },
        {
          path: "profile",
          name: "admin-profile",
          component: () => import("../views/admin/ProfileView.vue"),
          meta: { title: "Perfil", requiresProfile: true },
        },
        {
          path: "editor",
          name: "editor",
          component: () => import("../views/admin/EditorView.vue"),
          meta: { title: "Editor" },
        },
      ],
    },
    {
      path: "/full",
      name: "full",
      component: () => import("../views/FullView.vue"),
    },
    {
      path: "/full/:slug",
      name: "full-post",
      component: () => import("../views/FullView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/Register.vue"),
    },
    {
      path: "/auth/2fa",
      name: "auth-two-factor-login",
      component: () => import("../views/auth/LoginTwoFactor.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("../views/auth/ForgotPassword.vue"),
    },
    {
      path: "/forgot-password/:token",
      name: "reset-password",
      component: () => import("../views/auth/ResetPassword.vue"),
    },
    {
      path: "/confirm/:token",
      name: "confirm-account",
      component: () => import("../views/auth/ConfirmAccount.vue"),
    },
    {
      path: "/invite/:token",
      name: "accept-invitation",
      component: () => import("../views/auth/AcceptInvitation.vue"),
    },
    {
      path: "/generate-two-factor",
      name: "generate-two-factor",
      component: () => import("../views/auth/TwoFactor.vue"),
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ],
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, _) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const profileIncomplete =
    authStore.authenticated && authStore.authData?.fullProfile === false;

  if (requiresAuth && !authStore.loading && !authStore.authenticated) {
    await authStore.getSession();
  }

  if (requiresAuth && !authStore.authenticated) {
    return { path: "/login" };
  }

  if (
    authStore.authenticated &&
    (to.name === "login" ||
      to.name === "register" ||
      to.name === "auth-two-factor-login")
  ) {
    return {
      name:
        authStore.authData?.fullProfile === false
          ? "admin-profile"
          : "admin-dashboard",
    };
  }

  if (profileIncomplete && to.name !== "admin-profile") {
    return { name: "admin-profile" };
  }
});

export default router;
