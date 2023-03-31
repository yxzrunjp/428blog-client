<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import znCn from 'element-plus/lib/locale/lang/zh-cn'
import { reactive, provide, readonly } from 'vue'
const locale = znCn
const config = reactive({
  max: 1,
})
const settings = readonly({
  skeletonDelayTime: 500,
})
const globalInfo = readonly({
  imageUrl: '/api/file/getImage/',
})
provide('settings', settings)
provide('globalInfo', globalInfo)
</script>

<style lang="scss" scoped></style>