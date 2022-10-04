<template>
  <div v-cloak id="root">
    <div class="main-page" ctype="[6]">
      <div :class="{moveUp:drawer}" class="search">
        <div class="inp">
          <div class="search-type" @click="souStatus = !souStatus">
            <img :src="default_sou.icon"/>
          </div>
          <input v-model="search"
                 placeholder="搜一搜？"
                 @change="search_go"
                 @focus="searchPreviewRender"
                 @focusout="closePreview">
        </div>
        <div :class="{souShow:souStatus}" class="sou">
          <div class="sou-main">
            <img v-for="(item,index) in sou" :key="index" :alt="item.name" :src="item.icon" @click="set_sou(item)"/>
          </div>
        </div>
        <transition name="slide-fade">
          <div v-if="searchPreview" class="search-preview">
            <ul class="AppList">
              <li v-for="(li,index) in searchApp" :key="index" @click="to(li)">
                <div class="img">
                  <img :src="getIcon(li)"/>
                </div>
                <div class="text" v-html="li.title"></div>
              </li>
            </ul>
            <ul class="UrlList">
              <li v-for="(li,index) in searchList" :key="index" @click="selectedText(li)">
                <span v-html="li.title"></span>
              </li>
            </ul>
          </div>
        </transition>
        <transition name="showings">
          <div v-if="!drawer&&!searchPreview&&history.length!=0" class="history">
            <transition v-for="(item,index) in history" :key="index">
              <div :cdata="item.url" :title="item.description" class="item" ctype="[5]" @click="to(item)">
                <div class="img"><img :src="getIcon(item)"></div>
                <div class="span">{{ item.title }}</div>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>
    <div :class="{show:drawer}" class="drawer">
      <div class="drawer-main">
        <div v-for="(ite,index) in list" :key="index" class="x-list">
          <div :cdata="ite.id" class="title" ctype="[1,2]">
            <i :class="ite?.font_icon"></i>
            <span>{{ ite.name }}</span>
          </div>
          <div class="y-list">
            <div v-for="(item,i) in ite.children" :key='i' :cdata="item.id" :style="'width:'+width"
                 :title="item.description" class="dreaer-list"
                 ctype="[3,4,7]" @click="to(item) ">
              <div class="img">
                <img :alt="item.title" :src="getIcon(item)">
              </div>
              <div class="name">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tabBar.length!=0" :class="{shows:drawer}" class="bottomtab">
      <div :style="{width:tabBar.length*65+'px'}" class="al">
        <div v-for="(item,index) in tabBar" :key="index">
          <img :src="item.icon"/>
        </div>
      </div>
    </div>
    <Mouse></Mouse>
    <MenuCom></MenuCom>
    <Links></Links>
    <Settings nomouse></Settings>

    <footer v-show="!drawer">
        <span style="cursor: pointer" @click="login">Cifitr</span>
        <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
        <span style="cursor: pointer" @click="baidu">Baidu</span>
    </footer>
  </div>
</template>

<script>
import bus from "@/util/bus.js"
import {memory, throttle} from "jsb-util"
import {default_sou, set_sou, sou, sousearch} from "@/util/sou.js"
import {get_link, get_menu} from "@/api";
import events_info from "./event_info"
import Mouse from './component/mouse'
import MenuCom from "@/views/Index/component/menu";
import Links from "@/views/Index/component/links";
import Settings from "@/views/Index/component/settings";
import $ from "jquery";
import {apiHost} from "@/util/request";


export default {
  el: '#root',
  data() {
    return {
      searchPreview: false,
      searchList: [],
      searchApp: [],
      history: memory.get("history") || [],
      search: '',
      drawer: false,
      souStatus: false,
      sou: sou,
      default_sou,
      touch: {y: 0, time: 0},
      list: memory.get("list") || [],
      lists: [],
      mouseRight: {x: 0, y: 0,},
      tabBar: [],
      flag: true,
      width:""
    }
  },
  components: {Settings, Links, MenuCom, Mouse},
  mixins: [events_info],
  created() {
    this.sum_icon()
  },
  methods: {
    search_go() {
      if (/^http/.test(this.search)) {
        location.href = this.search;
      } else {
        location.href = "//" + this.search;
      }
      sousearch(this.search)
    },
    selectedText(e) {
      this.search = e.title
      this.search_go();
    },
    to({url}) {
      const index = this.lists.findIndex(el => el.url === url)//查找本地的信息
      const info = this.lists[index];
      const index1 = this.history.findIndex(it => it.url === url);
      if (index1 > -1) {//如果历史记录存在，则删除
        this.history.splice(index1, 1)
      }
      if (index > -1) {
        if (this.history.length === 8) {
          this.history.pop();
        }
        this.history.unshift({
          url: url,
          title: info.title,
          description: info.description
        })//删除后向数组最开始插入数据

        memory.set("history", this.history.slice(0, 8));
      }
      const temp_window = window.open();
      temp_window.location = apiHost + "/index.php?c=click&id=" + info.id;
    }
    ,
    getIcon(item) {
      if (item.url) {
        let str = ""
        try {
          str = "https://favicon.rss.ink/v1/" + btoa(encodeURI(item.url));
        } catch (e) {
          console.log(e);
          console.log(item)
          console.log(item.url)
        }
        return str
      }
    },
    login() {
      location.href = '/index.php?c=login'
    },
    baidu() {
      location.href = 'https://www.baidu.com'
    },
    mouseMenu(event) {
      const {clientX, clientY} = event;
      event.preventDefault()
    },
    set_sou(item) {
      set_sou(item);
      this.default_sou = item;
      this.souStatus = false
    }
    ,
    async fetchData() {
      let data = await get_menu()
      let list = await get_link()
      this.lists = list.data
      memory.set("lists", list.data)
      //下面是将目录和列表合并。将列表加入目录children里
      let menu = data.data;
      list.data.forEach((item) => {
        const {category_name: name} = item;
        const index = menu.findIndex(el => el.name === name);
        if (!menu[index].children) {
          menu[index].children = [];
        }
        menu[index].children.push(item)
      })
      this.list = menu
      memory.set("list", menu)
      await this.$nextTick(_ => {
        this.sum_icon()
      })
    }
    ,
    searchPreviewRender() {
      const val = this.search
      const list = memory.get("lists") || []
      let tmp = [];

      list.forEach(el => {
        if (el.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) {
          tmp.push({
            title: el.title.replace(RegExp(this.search, "ig"), `<b>${this.search}</b>`),
            url: el.url,
            description: el.description
          })
        }
      })

      this.searchPreview = true//Boolean(tmp.length > 0)
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          $.ajax({
            url: 'https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc',
            dataType: 'jsonp',
            jsonp: 'cb',
            data: {wd: this.search},
            success: ({g = []}) => {
              this.searchList = [];
              g.forEach(ell => {
                this.searchList.push({
                  title: ell.q,
                  url: '',
                })
              })
            }
          })
          this.flag = true
        }, 100)
      }
      this.searchApp = tmp.slice(0, 10)
      if (this.drawer)
        this.drawer = false;
    }
    ,
    closePreview() {
      setTimeout(_ => {
        this.searchPreview = false
      }, 100)
    }
    ,
    sum_icon() {
      let w = outerWidth - 60;
      let auto = Math.floor(w / 100);
      let l = w / auto
      if (outerWidth > 501) {
        this.width = l + 'px';
      } else {
        this.width = '';
      }
    }
  },
  async mounted() {
    await this.fetchData()
    bus.on("delhistory", (e) => {
      const index = this.history.findIndex(it => it.url === e);
      this.history.splice(index, 1)
      memory.set("history", this.history)
    })
    window.scrolllock = false
    window.addEventListener("resize", throttle(this.sum_icon, 200))
    window.addEventListener('load', this.sum_icon)
  }
  ,
  watch: {
    search(val) {
      this.searchPreviewRender()
    }
    ,
    drawer(val) {
      if (val)
        this.searchPreview = false
    }
  }
}
</script>
