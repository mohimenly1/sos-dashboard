import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Billing from "../views/Billing.vue";
import RTL from "../views/Rtl.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import Classification from '../views/Classification/Classification.vue';
import Category from '../views/Category/Category.vue';
import News from '../views/News/News.vue';
import Reports from '../views/Reports/Reports.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/news",
    name: "News",
    component: News,
    meta: { requiresAuth: true },
  },
{
  path:"/classification-add",
  name:"classification-add",
  component:Classification
},
{
  path:"/reports",
  name:"reports",
  component:Reports,
},
{
  path:"/category-add",
  name:"category-add",
  component:Category
},
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("auth_token");

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: "SignIn" });
  } else {
    next();
  }
});

export default router;