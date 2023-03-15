<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import znCn from 'element-plus/lib/locale/lang/zh-cn'
import { reactive } from 'vue'
const locale = znCn
const config = reactive({
  max:1,
})
</script>

<style lang="scss" scoped></style>