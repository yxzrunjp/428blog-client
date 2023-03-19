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
                <PreviewHtml :html="blogInfo.content" @load="htmlLoad" @click="previewClick" />
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
                            {{ item.title }}
                        </div>
                    </template>
                    <div v-else class="not-menu">
                        暂无目录信息
                    </div>
                </div>
            </div>
        </div>
        <ImagePreview :urlList="urlList" :showIdx="showIdx" :show="showImg" @closeImg="closeImg" />
    </div>
</template>

<script setup>
import Cover from '@/components/Cover.vue'
import PreviewHtml from '@/components/PreviewHtml.vue';
import ImagePreview from '@/components/ImagePreview.vue';
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useScroll } from '@/utils/hooks'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import api from '@/api'

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



const menus = reactive([])//目录
const urlList = reactive([])//图片url
const showImg = ref(false) //是否放大图片
const showIdx = ref(null) //显示索引
// 文章内容显示完成回调
const htmlLoad = (menuArr,imgs)=>{
    menus.splice(0,menus.length,...menuArr)
    urlList.splice(0,urlList.length,...imgs)
}
// 文章图片点击处理
const previewClick = (e) => {
    if (e.target.tagName === 'IMG') {
        // 获取图片url集合
        showIdx.value = urlList.findIndex(el => {
            return el === e.target.getAttribute('data-url')
        })
        // 放大图片
        showImg.value = true
    }
}
const closeImg = () => {
    showImg.value = false
    showIdx.value = null
}



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
    const result = await api.getBlogDetail({
        blogId
    })
    if (!result)
        return
    Object.assign(blogInfo, result.data)
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