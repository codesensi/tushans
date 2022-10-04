<template>
  <div class="body">
    <!-- 取消主题右键 -->
    <!-- <IndexPage @contextmenu.prevent.capture></IndexPage> -->
    <IndexPage></IndexPage>
  </div>
</template>
<script setup>
import IndexPage from "./views/Index/Index.vue";
import bus from "@/util/bus";
import IdbKvStore from "idb-kv-store"

const background = require("@/assets/img/bg.png")

const set_background = () => {
  const store = new IdbKvStore('background')
  store.get('bg', function (err, value) {
    if (err) throw err
    if (value) {
      const url = URL.createObjectURL(value)
      document.querySelector(".body").style.background = `url(${url}) no-repeat center/cover`
    } else {
      document.querySelector(".body").style.background = `url(${background}) no-repeat center/cover`
    }
  })
}
set_background()
bus.on("set_background", set_background)
</script>


<style lang="scss">
@import "assets/scss/index";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.body {
  width: 100vw;
  height: 100vh;
  transition: background 2s;
}
</style>
