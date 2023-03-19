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
                <PreviewHtml :html="blogInfo.content" @load="htmlLoad" @click="previewClick" />
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
        <ImagePreview :urlList="urlList" :showIdx="showIdx" :show="showImg" @closeImg="closeImg" />
    </div>
</template>

<script setup>
import PreviewHtml from '@/components/PreviewHtml.vue';
import ImagePreview from '@/components/ImagePreview.vue';
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useScroll } from '@/utils/hooks'
import api from '@/api';
const route = useRoute()
const blogId = ref(route.params.blogId)
const blogInfo = reactive({})

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

// 锚点跳转
const handleJump = (item) => {
    const { id } = item
    document.location.hash = '#' + id
}

// 获取博客内容
const getBlogDetail = async () => {
    const result = await api.getBlogDetail({ blogId: blogId.value })
    if (!result)
        return
    Object.assign(blogInfo, result.data)
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