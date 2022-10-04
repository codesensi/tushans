<template>
  <div>
    <el-dialog
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :title="!isedit?'添加目录':'修改目录'"
        :width="sumwidth(dialogVisible)"
        append-to-body
        draggable>
      <div class="menu_add">
        <el-input v-model="addInfo.name" placeholder="请输入分类名称"></el-input>
        <el-input v-model="addInfo.font_icon" placeholder="请输入图标类名 不要删除fa (fa 图标名称)"></el-input>
        <el-input
            v-model="addInfo.description"
            maxlength="300"
            placeholder="请输入站点描述（完整）"
            show-word-limit
            type="textarea"></el-input>
        <div class="other">
          <el-select v-model="addInfo.fid" placeholder="父级菜单，非必选">
            <el-option v-for="(it,index) in option" :key="index" :label="it.name" :value="it.id"></el-option>
          </el-select>
          <el-input v-model="addInfo.weight" placeholder="权重（0-99）" type="number"></el-input>
          <el-switch
              v-model="addInfo.property"
              active-color="#13ce66"
              inactive-color="#ff4949"
              inactive-text="是否公开">
          </el-switch>
        </div>
        <div style="margin:15px 0px;">图标查看地址 <a href="https://fontawesome.dashgame.com" target="_blank">https://fontawesome.dashgame.com</a>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bus from "@/util/bus";
import {memory} from "jsb-util";
import {add_menu, update_menu} from "@/api";

export default {
  name: "menuComponent",
  methods: {
    async submit() {
      if (this.addInfo.name === "") return this.$message.error("缺少目录名称")
      const data = {...this.addInfo};
      data.property = this.addInfo.property ? 0 : 1;
      const {code} = this.isedit ? await update_menu(data) : await add_menu(data)
      if (code === 0) {
        this.$message.success("添加成功")
        setTimeout(_ => location.reload(), 1000)
        this.dialogVisible = false
      } else {
        this.$message.error("添加失败")
      }

    },
    sumwidth() {
      if (outerWidth > 500) {
        return '500px'
      }
      return "375px"
    }
  },
  data() {
    return {
      dialogVisible: false,
      option: [],
      addInfo: {
        name: '',
        weight: '',
        property: true,
        description: '',
        font_icon: 'fa ',
        fid: ""
      },
      tmp: {
        name: '',
        weight: '',
        property: true,
        description: '',
        font_icon: 'fa ',
        fid: ""
      },
      isedit: false
    }
  },
  watch: {
    dialogVisible(e) {
      if (e === false) {
        window.scrolllock = false
      } else if (e === true) {
        this.addInfo = JSON.parse(JSON.stringify(this.tmp));
        window.scrolllock = true;
      }
    }
  },
  mounted() {
    bus.on("menushow", (info) => {
      this.dialogVisible = true
      this.$nextTick(_ => {
        let arr = [];
        memory.get("list").forEach(el => {
          if (el.fid == '0') {
            arr.push(el)
          }
        })
        this.option = arr;
        if (info !== true) {
          for (const item in this.addInfo) {
            this.addInfo[item] = info[item]
          }
          this.addInfo.property = Boolean(info["property"] !== 1)
          this.addInfo.id = info.id;
          this.addInfo.fid = info.fid;
          this.isedit = true
        }
      })

    })
  }
}
</script>

<style scoped>

</style>
