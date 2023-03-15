<template>
    <div class="blog-detail">
        <div class="blog-content">
            <h1 class="blog-title">{{ blogInfo.title }}</h1>
            <div class="blog-info">
                <span class="info-item">{{ blogInfo.createTime }}</span>
                <span class="info-item">作者：<router-link :to="'/user'" class="highlight-info">{{ blogInfo.nickName
                }}</router-link></span>
                <span class="info-item">分类专栏：<router-link :to="'/category/' + blogInfo.categoryId" class="highlight-info">{{
                    blogInfo.categoryName
                }}</router-link></span>
            </div>
            <article>
                <PreviewHtml :html="blogInfo.content" />
            </article>
        </div>
        <aside :style="{ transform: `translateY(${scrollTop}px)` }">
            <AsideContent :title="'目录'" :to="'/'" :showMore="false">
                <template #default>
                    <div v-if="menus.length === 0" class="no-menu-tip">暂无目录</div>
                    <div v-else class="menus">
                        <div v-for="item in menus" :key="item.id" class="menu-item"
                            :style="{ paddingLeft: `${(item.level) * 10}px` }" @click="handleJump(item)">
                            {{ item.title }}
                        </div>
                    </div>
                </template>
            </AsideContent>
            <AsideContent :title="'分类专栏'" :to="'/category'">
                <template #default>
                    <template v-for="item in categoryList" :key="item.categoryId">
                        <router-link :to="'/category/' + item.categoryId">
                            <CategoryItem :count="item.blogCount" :cover="item.cover" :name="item.categoryName" />
                        </router-link>
                    </template>
                </template>
            </AsideContent>
        </aside>
    </div>
</template>

<script setup>
import PreviewHtml from '@/components/PreviewHtml.vue';
import { ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useScroll } from '@/utils/hooks'
import api from '@/api';
import hljs from 'highlight.js';
import img from '@/assets/img/placeholder.png'
import { throttling } from '@/utils/commonFn.js'
const route = useRoute()
const blogId = ref(route.params.blogId)
const blogInfo = reactive({})

// 高亮代码
const highlightCode = () => {
    const all = document.querySelectorAll('pre code')
    all.forEach(el => {
        hljs.highlightElement(el);
    })
}

// 目录
const menus = reactive([])
// 获取目录
const getTitleEl = () => {
    const hTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    const children = document.querySelector('.github-markdown-body').children
    let temp = Array.from(children)
    temp.forEach((el, idx) => {
        if (hTag.includes(el.tagName.toLowerCase())) {
            const id = 'node-' + idx
            el.setAttribute('id', id)
            menus.push({
                id,
                title: el.innerText,
                level: Number(el.tagName.slice(1)),
            })
        }
    })
}
// 锚点跳转
const handleJump = (item) => {
    const { id } = item
    document.location.hash = '#' + id
}

// 获取图片
let imgChildren = []
// 窗口高度
const vHeight = document.documentElement.clientHeight || document.body.clientHeight
// 获取图片
const getImg = () => {
    imgChildren = document.querySelectorAll('.github-markdown-body p img')
    imgChildren.forEach(el => {
        const tempSrc = el.getAttribute('src')
        el.setAttribute('data-url', tempSrc)
        setImgAttr(el, img, '400px', '300px')
    })
    throttlingScroll()
    document.addEventListener('scroll', throttlingScroll)
}
// 设置图片属性
const setImgAttr = (el, src, width, height) => {
    el.style.display = 'none'
    el.src = src
    el.style.width = width
    el.style.height = height
    el.style.display = 'inline'
}
// 页面滚动事件
const scrollHandler = () => {
    // 滚动的距离 + 上视口的距离 = 图片距离顶部的距离
    const pageScroll = document.documentElement.scrollTop || document.body.scrollTop
    imgChildren.forEach(el => {
        const offsetTop = el.offsetTop
        if (offsetTop < vHeight + pageScroll + 100) {
            const imgObj = new Image()
            imgObj.src = el.getAttribute('data-url')
            imgObj.onload = () => {
                setImgAttr(el, el.getAttribute('data-url'), '', '')
            }
        }
    })
}
// 节流处理
const throttlingScroll = throttling(500, scrollHandler)
onBeforeUnmount(() => {
    document.removeEventListener('scroll', throttlingScroll)
})








// 获取博客内容
const getBlogDetail = async () => {
    const result = await api.getBlogDetail({ blogId: blogId.value })
    if (!result)
        return
    Object.assign(blogInfo, result.data)

    // 富文本编辑器的代码没有内联样式，需要自己额外做处理
    nextTick(() => {
        if (blogInfo.editorType === 0) {
            // 视图更新完毕后再高亮代码
            highlightCode()
        }
        getImg()
        getTitleEl()
    })
}

const categoryList = reactive([])
// 获取分类专栏
const getCategory = async () => {
    const result = await api.loadCategory({ pageSize: 3 })
    if (!result)
        return
    Object.assign(categoryList, result.data)
}

// 滚动
const { scrollTop } = useScroll()

const init = async () => {
    await getBlogDetail()
    await getCategory()
}
init()
</script>

<style lang="scss" scoped>
.blog-detail {
    width: 100%;
    display: flex;
    justify-content: flex-start;

    .blog-content {
        width: calc(100% - 310px);

        .blog-title {
            font-size: 24px;
            margin-top: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .blog-info {
            margin: 15px 0px;
            background-color: #f4f4f4;
            height: 40px;
            border-radius: 5px;
            font-size: 14px;
            line-height: 40px;
            padding: 0 10px;

            .info-item {
                margin-right: 10px;

                .highlight-info {
                    color: #4bcffa;
                    font-size: 16px;
                }
            }
        }
    }

    aside {
        width: 300px;
        margin-left: 10px;

        .no-menu-tip {
            font-size: 14px;
            line-height: 30px;
            text-align: center;
        }

        .menus {
            padding: 10px 0;

            .menu-item {
                display: block;
                font-size: 14px;
                line-height: 24px;
                cursor: pointer;
                font-weight: bold;

                &:hover {
                    background-color: #f4f4f4;
                }
            }
        }
    }

    .blog-content,
    aside {
        padding: 0 15px;
        border-radius: 5px;
        background-color: #fff;
        height: max-content;
    }
}
</style>