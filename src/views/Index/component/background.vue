<template>
  <div class="background">
    <div class="upbutton">
      <img src="@/assets/img/upfile.svg"/>
      <span class="upbuttontext" hover>点击上传JPEG/PNG/GIF图片</span>
      <input accept="image/*" cli multiple="multiple" type="file" @change="uplist"/>
    </div>
    <div class="now-background">
      <h4 style="margin-bottom: 10px">当前桌面</h4>
      <img :src="src"/>
    </div>
  </div>
</template>

<script setup>
import bus from "@/util/bus";
import {ref} from "vue";
import IdbKvStore from "idb-kv-store"
import {memory} from "jsb-util";

const store = new IdbKvStore('background')
const src = ref("")
store.get('bg', (err, value) => {
  if (value) {
    src.value = URL.createObjectURL(value);
  }
})
const uplist = (event) => {
  const file = event.target.files;
  if (file.length > 0) {
    let f = file[0];
    store.set('bg', f, function (err) {
      if (err) throw err
      memory.del('bg')
    })
    src.value = URL.createObjectURL(f);
    bus.emit('set_background')
  }
}
</script>

<style lang="scss" scoped>
.background {
  width: 100%;

  .upbutton {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    padding: 10px 0;
    cursor: pointer;

    &:hover {
      img, .upbuttontext {
        transform: scale(0.8);
      }
    }

    > img {
      margin: auto;
      width: 120px;
      height: 120px;
      transition: all 500ms;
    }

    > .upbuttontext {
      text-align: center;
      color: #000;
      font-size: 13px;
      transition: all 500ms;
    }


    > input {
      position: absolute;
      width: 100%;
      height: 100%;
      background: transparent;
      outline: none;
      top: 0px;
      left: 0px;
      opacity: 0;
      z-index: 1;
    }

  }

  > .now-background {
    margin-top: 15px;

    > img {
      width: 100%;
      border-radius: 10px;
    }
  }
}

</style>
