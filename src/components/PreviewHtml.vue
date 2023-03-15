<template>
    <v-md-preview-html :html="html" preview-class="github-markdown-body"></v-md-preview-html>
</template>

<script setup>
// html预览组件
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/preview-html.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';// 引入使用主题的样式

const props = defineProps({
    html: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped></style>