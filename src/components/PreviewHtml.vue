<template>
    <v-md-preview-html :html="html" preview-class="github-markdown-body" @click="handleClick"></v-md-preview-html>
</template>

<script setup>
// html预览组件
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/preview-html.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';// 引入使用主题的样式
// import hljs from 'highlight.js';//atom-one-light
import img from '@/assets/img/placeholder.png'

import { watch, nextTick,onBeforeUnmount } from 'vue'
import { throttling } from '@/utils/commonFn.js'
import { useScroll } from '@/utils/hooks.js'

import hljs from '@/utils/hljs.js'

const { scrollTop } = useScroll()
const props = defineProps({
    html: {
        type: String,
        default: ''
    }
})
// 高亮代码
const highlightCode = () => {
    const all = document.querySelectorAll('pre code')
    all.forEach(el => {
        hljs.highlightElement(el);
    })
}
let imgUrls = []//图片src
let imgChildren = []//图片dom集合
// 对图片进行特殊处理
const setImages = () => {
    // 清空图片URL
    imgUrls = []
    imgChildren = document.querySelectorAll('.github-markdown-body p img')
    imgChildren.forEach(item => {
        const src = item.getAttribute('src')
        item.setAttribute('data-url', src)
        imgUrls.push(src)
        setImageUrl(item, img, '400px', '300px')
    })
    throttlingScroll()
    document.addEventListener('scroll', throttlingScroll)
}
const setImageUrl = (el, img, width, height) => {
    el.style.display = 'none'
    el.src = img
    el.style.width = width
    el.style.height = height
    el.style.display = 'inline'
}
// 窗口高度
const vHeight = document.documentElement.clientHeight || document.body.clientHeight
// 页面滚动事件
const scrollHandler = () => {
    // 滚动的距离 + 上视口的距离 = 图片距离顶部的距离
    const pageScroll = scrollTop.value
    imgChildren.forEach(el => {
        const offsetTop = el.offsetTop
        if (offsetTop < vHeight + pageScroll + 100) {
            const imgObj = new Image()
            imgObj.src = el.getAttribute('data-url')
            imgObj.onload = () => {
                setImageUrl(el, el.getAttribute('data-url'), '', '')
            }
        }
    })
}
// 节流处理
const throttlingScroll = throttling(500, scrollHandler)
onBeforeUnmount(() => {
    document.removeEventListener('scroll', throttlingScroll)
})

// 获取标题
const titleTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const menuArr = []
const getTitle = () => {
    // 清空menus
    menuArr.splice(0, menuArr.length)
    const children = Array.from(document.querySelector('.github-markdown-body').children)
    children.forEach((el, idx) => {
        const elTag = el.tagName.toLowerCase()
        if (titleTag.includes(elTag)) {
            const level = Number(elTag.slice(1))
            const id = `node-${idx}`
            el.setAttribute('id', id)
            menuArr.push({
                id,
                title: el.innerText,
                level,
                offsetTop: el.offsetTop,
            })
        }
    })
}

const emit = defineEmits(['click', 'load'])
const handleClick = (e)=>{
    emit('click',e)
}
watch(() => props.html, () => {
    document.removeEventListener('scroll', throttlingScroll)
    nextTick(() => {
        // 代码高亮
        highlightCode()
        // 设置懒加载
        setImages()
        // 获取标题
        getTitle()
        // 加载完成,返回数据
        emit('load', menuArr, imgUrls)
    })
})
</script>

<style lang="scss" scoped></style>