<template>
  <aside
    id="sidenav-main"
    class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 ms-3"
    :class="`${
      isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'
    } ${sidebarType}`"
  >
    <div class="sidenav-header" style="height: none !important">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>
      <a style="padding: none !important; margin-top: -8px !important;" class="m-0 navbar-brand" href="/">
        <img
        style="max-height: none !important; max-width:130% !important;"
          :src="
            sidebarType === 'bg-white' ||
            (sidebarType === 'bg-transparent' && !isDarkMode)
              ? logoDark
              : logo
          "
          class="navbar-brand-img h-100"
          alt="main_logo"
        />
        <span class="ms-2 font-weight-bold text-white"
          >نظـام بلديتي</span
        >
      </a>
    </div>
    <hr class="horizontal light mt-0 mb-2" style="margin-top: 0px !important;"/>
    <sidenav-list />
  </aside>
</template>
<script>
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/playstore.png";
import logoDark from "@/assets/img/logo-ct-dark.png";
import { mapState } from "vuex";

export default {
  name: "index",
  components: {
    SidenavList,
  },
  data() {
    return {
      logo,
      logoDark,
    };
  },
  computed: {
    ...mapState(["isRTL", "sidebarType", "isDarkMode"]),
  },
};
</script>
<style>
.sidenav-header {
  height: none !important;
}
</style>