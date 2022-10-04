<template>
  <div>
    <el-dialog v-model="dialogVisible"
               :close-on-click-modal="false"
               :title="!isedit?'添加链接':'修改链接'"
               :width="sumwidth(dialogVisible)"
               append-to-body
               draggable>
      <div class="menu_add">
        <el-input v-model="addInfo.url" placeholder="请输入完整的网址链接"></el-input>
        <el-input v-model="addInfo.url_standby" placeholder="请输入备用链接，没有请留空"></el-input>
        <el-input v-model="addInfo.title" placeholder="请输入标题"></el-input>
        <el-input v-model="addInfo.description" maxlength="300" placeholder="请输入站点描述（完整）" show-word-limit
                  type="textarea"></el-input>
        <div class="other">
          <el-select v-model="addInfo.fid" placeholder="请选择目录">
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
import {add_link, update_link} from "@/api";

export default {
  name: "links",
  methods: {
    async submit(type) {
      if (this.addInfo.url === "") return this.$message.error("缺少url地址")
      if (this.addInfo.title === "") return this.$message.error("缺少标题")
      const data = {...this.addInfo};
      data.property = this.addInfo.property ? 0 : 1;
      const {code} = this.isedit ? await update_link(data) : await add_link(data);
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
      addInfo: {},
      tmp: {//这个是为了在下次打开的时候清空内容的数据结构
        url: '',
        weight: '',
        title: '',
        property: true,
        fid: "",
        url_standby: '',
        description: ''
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
    bus.on("show", () => {
      this.option = memory.get("list") || [];
      this.dialogVisible = true
    })
    bus.on("showandupdate", (e) => {
      this.dialogVisible = true
      this.isedit = true
      this.$nextTick(_ => {
        this.option = memory.get("list") || [];
        this.addInfo = e
        this.addInfo.property = e.property == 0 ? true : false
      })
    })
  }
}
</script>

<style scoped>
.dialog-footer {
  margin-top: 15px;
}
</style>
