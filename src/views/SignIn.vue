<template>

  <div
    class="page-header align-items-start min-vh-100"
    :style="{
      backgroundImage: `url(${require('@/assets/img/cover5.jpg')})`
    }"
  >
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                class="bg-gradient-success-new shadow-success border-radius-lg py-3 pe-1"
              >
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                  تسجيل الدخول
                </h4>
             
              </div>
            </div>
            <div class="card-body">
              <form @submit.prevent="loginUser" role="form" class="text-start mt-3">
                <div class="mb-3">
                  <label>البريد الإلكتروني</label>
                  <input
                        v-model="email"
                    id="email"
                    type="email"
                    label="Email"
                    name="email"
                  />
                </div>
                <div class="mb-3">
                  <label>كلمة المرور</label>
                  <input
                   v-model="password"
                    id="password"
                    type="password"
                    label="Password"
                    name="password"
                  />
                </div>
       
                <div class="text-center m-0 auto center" >
               
                  <button>
                    <span>تسجيل الدخول</span>
                  </button>
                  
                </div>
       
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer position-absolute bottom-2 py-2 w-100">
      <div class="container">
        <div class="row align-items-center justify-content-lg-between">
          <div class="col-12 col-md-8 my-auto">
            <div  class="copyright text-center text-sm text-white text-lg-start">
              © {{ new Date().getFullYear() }}, made with
              <i class="fa fa-heart" aria-hidden="true"></i> by
              <a
                href="https://www.creative-tim.com"
                class="font-weight-bold text-white"
                target="_blank"
                >Fadia & Tasnim</a
              >
              for a better web.
            </div>
          </div>
          <!-- <div class="col-12 col-md-6">
            <ul
              class="nav nav-footer justify-content-center justify-content-lg-end"
            >
              <li class="nav-item">
                <a
                  href="https://www.creative-tim.com"
                  class="nav-link text-white"
                  target="_blank"
                  >Fadia & Tasnim</a
                >
              </li>
              <li class="nav-item">
                <a
                  href="https://www.creative-tim.com/presentation"
                  class="nav-link text-white"
                  target="_blank"
                  >About Us</a
                >
              </li>
              <li class="nav-item">
                <a
                  href="https://www.creative-tim.com/blog"
                  class="nav-link text-white"
                  target="_blank"
                  >Blog</a
                >
              </li>
              <li class="nav-item">
                <a
                  href="https://www.creative-tim.com/license"
                  class="nav-link pe-0 text-white"
                  target="_blank"
                  >License</a
                >
              </li>
            </ul>
          </div> -->
        </div>
      </div>
    </footer>
  </div>
</template>

<script>


import { mapMutations } from "vuex";
import axios from "@/axios"; // Import the custom Axios instance
import { useRouter } from "vue-router";
export default {

  data() {
    return {
      email: "",
      password: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  name: "sign-in",

  beforeMount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    loginUser() {
      const credentials = {
        email: this.email,
        password: this.password,
      };

      axios
        .post("/login", credentials)
        .then((response) => {
          localStorage.setItem("auth_token", response.data.token);
          this.router.push("/dashboard");
        })
        .catch((error) => {
          alert("Login failed. Please check your credentials." + error);
        });
    },
  },
};
</script>


<style scoped>
@font-face {
  font-family: 'TajawalBold';
  src: url('@/assets/fonts/Tajawal-Bold.ttf') format('truetype');
}
.bg-gradient-success-new{
  background-image: linear-gradient(to top, #505285 0%, #585e92 12%, #65689f 25%, #7474b0 37%, #7e7ebb 50%, #8389c7 62%, #9795d4 75%, #a2a1dc 87%, #b5aee4 100%);
}
/* From Uiverse.io by abrahamcalsin */ 
button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: #183153;
  font-family: "TajawalBold", sans-serif;
  box-shadow: 0px 6px 24px 0px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;
  border: none;
  color: white;
}

button:after {
  content: " ";
  width: 0%;
  height: 100%;
  background: #ffd401;
  position: absolute;
  transition: all 0.4s ease-in-out;
  right: 0;
}

button:hover::after {
  right: auto;
  left: 0;
  width: 100%;
}

button span {
  text-align: center;
  text-decoration: none;
  width: 100%;
  padding: 18px 25px;
  color: #fff !important;
  font-size: 1.125em;
  font-weight: 700;

  z-index: 20;
  transition: all 0.3s ease-in-out;
}

button:hover span {
  color: #183153;
  animation: scaleUp 0.3s ease-in-out;
}

@keyframes scaleUp {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

</style>