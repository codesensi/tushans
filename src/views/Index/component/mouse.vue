<template>
  <div v-show="false" :style="{left:mouseRight.x,top:mouseRight.y}" class="tabar">
    <div @click="addmenu" v-if="islogin">新增目录</div>
    <div v-if="canshow(1)&&islogin" @click="updatemenu">修改目录</div>
    <div v-if="canshow(2)&&islogin" @click="delmenu">删除目录</div>
    <div v-if="islogin" @click="addlink">新增链接</div>
    <div v-if="canshow(3)&&islogin" @click="dellink">删除链接</div>
    <div v-if="canshow(4)&&islogin" @click="updatelink">修改链接</div>
    <div v-if="canshow(5)" @click="delhistory">删除记录</div>
    <div v-if="canshow(6)" @click="downbg">下载壁纸</div>
    <div @click="setting">个性设置</div>
  </div>
</template>

<script>
import {memory} from "jsb-util";
import bus from "@/util/bus";
import {delete_link, delete_menu, is_login} from "@/api";
import Cookie from "js-cookie"
import IdbKvStore from "idb-kv-store";

export default {
  name: "mouse",
  data() {
    return {
      mouseRight: {
        x: 0,
        y: 0
      },
      show: false,
      info: {},
      ctype: [],
      element: null,
      islogin: false
    }
  },
  props: ["xy", "type"],
  methods: {
    addmenu() {
      bus.emit("menushow", true)
    },
    downbg() {
      const store = new IdbKvStore('background')
      store.get('bg', function (err, value) {
        if (err) throw err
        if (value) {
          const url = URL.createObjectURL(value)
          let a = document.createElement("a");
          a.href = url
          a.download = "壁纸.jpg"
          a.click();
        }
      })

    },
    updatemenu() {
      const list = memory.get("list") || []
      const index = list.findIndex(e => e.id == this.info)
      if (index === -1) return false;
      const info = list[index];
      bus.emit("menushow", info)
      this.show = false
    },
    addlink() {
      bus.emit("show", true)
    },
    delhistory() {
      bus.emit("delhistory", this.info)
      this.show = false
    },
    async delmenu() {
      try {
        await this.$confirm("是否删除？")
      } catch (e) {
        return false;
      }
      const {code} = await delete_menu({id: this.info});
      if (code === 0) {
        this.element.parentNode.remove()
        this.$message.success("删除成功")
      } else {
        this.$message.error("删除失败")
      }
      this.show = false
    },
    async dellink() {
      try {
        await this.$confirm("是否删除？")
      } catch (e) {
        return false;
      }
      const lists = memory.get("lists") || []
      const index = lists.findIndex(e => e.id == this.info)
      if (index === -1) return false;
      const info = lists[index];
      const {code} = await delete_link({id: info.id});
      if (code === 0) {
        this.element.remove()
        this.$message.success("删除成功")
      } else {
        this.$message.error("删除失败")
      }
      this.show = false
    },
    setting() {
      bus.emit("settings")
      this.show = false;
    },
    updatelink() {
      const lists = memory.get("lists") || []
      const index = lists.findIndex(e => e.id == this.info)
      if (index === -1) return false;
      const info = lists[index];
      bus.emit("showandupdate", info)
      this.show = false
    },
    canshow(index) {
      return Boolean(this.ctype.indexOf(index) > -1)
    },
  },
  mounted() {
    is_login().then(el => {
      if (el.data=='true') {
        this.islogin = true
      }
    })
    Cookie.get("")
    document.addEventListener("click", (event) => {
      this.show = false;
    })
    // const touch = {
    //   isdown: false,
    //   time: null,
    // }
    // window.addEventListener("touchstart", (e) => {
    //   touch.isdown = true;
    //   touch.time = new Date().getTime();
    //   touch.time = setTimeout(_ => {
    //     this.mouseRight = {
    //       x: e.changedTouches[0].clientX + 'px',
    //       y: e.changedTouches[0].clientY + 'px'
    //     }
    //     try {
    //       let t = JSON.parse(e.target.attributes.ctype.value)
    //       if (t.length > 0) {
    //         this.ctype = t;
    //       }
    //     } catch (e) {
    //       this.ctype = []
    //     }
    //     try {
    //       let info = e.target.attributes.cdata.value;
    //       this.info = info
    //       this.element = e.target
    //     } catch (e) {
    //       console.log(e)
    //     }
    //     this.show = true;
    //   }, 500)
    // })
    // window.addEventListener("touchend", function () {
    //   touch.isdown = false;
    //   clearTimeout(touch.time)
    //   touch.time = null;
    // })
    // window.addEventListener("touchmove", function () {
    //   console.log(1)
    //   touch.isdown = false;
    //   clearTimeout(touch.time)
    //   touch.time = null;
    // })
    // 取消主题右键
    // document.querySelector("#root").addEventListener("mousedown", (e) => {
    //   if (e.button === 2) {
    //     let is_exit = false;
    //     e.path.map(el => {
    //       const id = el.attributes;
    //       try {
    //         if (id['nomouse']) {
    //           is_exit = true;
    //         }
    //       } catch (e) {
    //       }
    //     })
    //     if (is_exit) {
    //       return e;
    //     }
    //     this.mouseRight = {
    //       x: e.clientX + 'px',
    //       y: e.clientY + 'px'
    //     }
    //     try {
    //       let t = JSON.parse(e.toElement.attributes.ctype.value)
    //       if (t.length > 0) {
    //         this.ctype = t;
    //       }
    //     } catch (e) {
    //       this.ctype = []
    //     }
    //     try {
    //       let info = e.toElement.attributes.cdata.value;
    //       this.info = info
    //       this.element = e.target
    //     } catch (e) {

    //     }
    //     this.show = true;
    //     e.preventDefault()
    //     e.stopPropagation();
    //   }
    // }, {passive: false})
  },
}
</script>

<style scoped>

</style>
