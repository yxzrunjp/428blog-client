<template>
    <div class="special-detail">
        <aside :style="{ transform: `translateY(${scrollTop}px)` }">
            <div class="sepcial-info">
                <div class="sepcial-info-left">
                    <Cover :src="specialData.blogCategory.cover" :width="'50px'" :height="'50px'" />
                </div>
                <div class="sepcial-info-right">
                    <div class="title">{{ specialData.blogCategory.categoryName }}</div>
                    <div class="count">文章数：{{ specialData.blogCategory.blogCount }}</div>
                </div>
            </div>
            <div class="intro">
                {{ specialData.blogCategory.categoryDesc }}
            </div>
            <div class="menu">
                <el-tree :expand-on-click-node="false" :default-expand-all="true" :data="specialData.blogList"
                    :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" ref="treeRef"
                    node-key="blogId">
                    <template #default="{ node, data }">
                        <div class="tree-label">{{ node.label }}</div>
                    </template>
                </el-tree>
            </div>
        </aside>
        <div class="blog-content">
            <h1 class="blog-title">{{ blogInfo.title }}</h1>
            <div class="blog-info">
                <span class="info-item">{{ blogInfo.createTime }}</span>
                <span class="info-item">作者：<router-link :to="'/user'" class="highlight-info">{{ blogInfo.nickName
                }}</router-link></span>
                <span class="info-item">分类专栏：<router-link
                        :to="'/special/' + blogInfo.categoryId + '?blogId=' + blogInfo.blogId" class="highlight-info">{{
                            blogInfo.categoryName
                        }}</router-link></span>
            </div>
            <article>
                <PreviewHtml :html="blogInfo.content" />
            </article>

            <div class="director" :style="{ transform: `translateY(${scrollTop}px)` }">
                <div class="title" @click="handleShowMenu">
                    <span>目录</span>
                    <el-icon size="22px">
                        <ArrowUp v-if="showMenu" />
                        <ArrowDown v-else />
                    </el-icon>
                </div>
                <div class="content" v-show="showMenu">
                    <template v-if="menus.length">
                        <div class="item" :style="{ paddingLeft: `${(item.level) * 10}px` }" v-for="item, idx in menus"
                            :key="idx" @click="menuClick(item)">
                            {{ item.label }}
                        </div>
                    </template>
                    <div v-else class="not-menu">
                        暂无目录信息
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Cover from '@/components/Cover.vue'
import PreviewHtml from '@/components/PreviewHtml.vue';
import { reactive, ref, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useScroll } from '@/utils/hooks'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import api from '@/api'
import hljs from 'highlight.js';
import img from '@/assets/img/placeholder.png'
import { throttling } from '@/utils/commonFn.js'
import { usePageInfoStore } from '@/store/usePageInfoStore.js'
const pageInfoStore = usePageInfoStore()
// 高亮代码
const highlightCode = () => {
    const all = document.querySelectorAll('pre code')
    all.forEach(el => {
        hljs.highlightElement(el);
    })
}

const route = useRoute()
const id = route.params.id
const queryId = route.query.blogId

const specialData = reactive({
    blogCategory: {},
    blogList: [],
})

// 树形控件
const treeRef = ref(null)
const defaultProps = {
    children: 'children',
    label: 'title',
    value: 'blogId',
}
const handleNodeClick = async (node) => {
    document.body.scrollTop = document.documentElement.scrollTop = 0
    getBlogDetail(node.blogId)
}
const setTreeItemActive = (blogId) => {
    treeRef.value.setCurrentKey(blogId)
}

// 滚动
const { scrollTop } = useScroll()

// 目录
const showMenu = ref(false)
const handleShowMenu = () => {
    showMenu.value = !showMenu.value
}
const menuClick = (item) => {
    const { id } = item
    document.location.hash = '#' + id
}
const menus = reactive([])
// 获取导航菜单
const getMenu = () => {
    if (menus.length) {
        menus.splice(0, menus.length)
    }
    const titleArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    const element = document.querySelector('.github-markdown-body')
    const children = Array.from(element.children)
    children.forEach((el, idx) => {
        const tagName = el.tagName.toLowerCase()
        if (titleArr.includes(tagName)) {
            const id = 'node-' + idx
            el.setAttribute('id', id)
            const level = Number(tagName.slice(1))
            menus.push({
                label: el.innerText,
                level,
                id: id
            })
        }
    })
}

let imgChildren = []
// 窗口高度
const vHeight = (document.documentElement.clientHeight || document.body.clientHeight) - pageInfoStore.topPartHeight
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


// 获取专题详情
const getSpecialDetail = async () => {
    const result = await api.getSpecialDetail({ categoryId: id })
    if (!result)
        return
    Object.assign(specialData, result.data)
}
// 获取博客详情
const blogInfo = reactive({})
const getBlogDetail = async (blogId) => {
    document.removeEventListener('scroll', throttlingScroll)
    const result = await api.getBlogDetail({
        blogId
    })
    if (!result)
        return
    Object.assign(blogInfo, result.data)
    nextTick(() => {
        // 富文本编辑器的代码没有内联样式，需要自己额外做处理
        if (blogInfo.editorType === 0) {
            // 视图更新完毕后再高亮代码
            highlightCode()
        }
        // 获取目录
        getMenu()
        // 获取图片
        getImg()
    })
}
const init = async () => {
    await getSpecialDetail()
    if (queryId) {
        await getBlogDetail(queryId)
        setTreeItemActive(queryId)
    } else {
        const firstId = specialData.blogList[0]?.blogId
        if (firstId) {
            await getBlogDetail(firstId)
            setTreeItemActive(firstId)
        }
    }

}
init()
</script>

<style lang="scss" scoped>
.special-detail {
    display: flex;
    justify-content: flex-start;

    aside {
        width: 300px;
        margin-right: 10px;
        padding-bottom: 10px;

        .sepcial-info {
            padding: 10px;
            display: flex;
            justify-content: flex-start;

            .sepcial-info-left {
                width: 50px;
                height: 50px;
                margin-right: 10px;
                flex-shrink: 0;
            }

            .sepcial-info-right {
                flex-grow: 1;
                overflow: hidden;

                .title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 16px;
                }

                .count {
                    margin-top: 6px;
                    font-size: 14px;
                    color: #808e9b;
                }
            }
        }

        .intro {
            padding: 0 10px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 10px;
        }

        .menu {
            overflow: hidden;

            .tree-label {
                width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .blog-content {
        padding: 0 15px;
        width: calc(100% - 310px);
        position: relative;

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

        .director {
            position: absolute;
            top: 15px;
            right: 20px;
            width: 300px;
            // height: 50px;
            background-color: #fff;
            // box-shadow: 0 0 5px gray;
            border: 1px solid gray;

            .title {
                border-bottom: 1px solid gray;
                padding: 0 10px;
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }

            .content {
                padding: 10px 0;

                .item {
                    cursor: pointer;
                    line-height: 24px;
                    font-size: 14px;
                    // padding: 0 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &:hover {
                        background-color: #f4f4f4;
                    }
                }

                .not-menu {
                    padding: 0 10px;
                    text-align: center;
                    font-size: 14px;
                }
            }
        }
    }

    aside,
    .blog-content {
        border-radius: 5px;
        background-color: #fff;
        height: max-content;
    }
}
</style>