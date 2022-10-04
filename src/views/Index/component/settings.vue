<template>
  <div>
    <el-drawer
        v-model="drawer"
        :before-close="handleClose"
        :destroy-on-close="true"
        :direction="direction"
        size="500px"
        title="个性设置"

    >
      <div class="settings">
        <div class="left">
          <ul>
            <li :class="{selectedLi:index===1}" @click="nav(1)">壁纸设置</li>
          </ul>
        </div>
        <div class="right">
          <Background></Background>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import bus from "@/util/bus.js"
import Background from "@/views/Index/component/background";

const index = ref(1)

const drawer = ref(false)
const direction = ref('rtl')
const handleClose = (done) => {
  window.scrolllock = false;
  done()
}
const nav = (e) => {
  index.value = e
}
bus.on("settings", () => {
  window.scrolllock = true;
  drawer.value = true
})
</script>
<style lang="scss" scoped>
.settings {
  width: 100%;
  height: 100%;
  display: flex;

  > .left {
    width: 100px;
    height: 100%;
    flex-shrink: 0;

    > ul {
      list-style: none;

      > li {
        height: 40px;
        text-indent: 15px;
        line-height: 40px;
      }
    }
  }

  > .right {
    border-left: 1px solid #efefef;
    margin-left: 15px;
    flex: 1;
    height: 100%;
    padding: 10px 15px 15px 15px;
  }
}

.selectedLi {
  background-color: rgb(234, 234, 234);
  color: #C73420;
  border-radius: 5px;
}
</style>
