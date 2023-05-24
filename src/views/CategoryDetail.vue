<template>
    <div class="category-detail">

        <div class="left">
            <!-- 分类简介 -->
            <el-skeleton :loading="loading" :count="1">
                <template #template>
                    <div class="blog-item-skeleton">
                        <el-skeleton-item variant="image" style="width: 110px; height: 110px" />
                        <div class="right">
                            <el-skeleton-item variant="p" style="width: 50%" />
                            <el-skeleton-item variant="p" style="width:80%" />
                            <el-skeleton-item variant="p" style="width: 65%" />
                        </div>
                    </div>
                </template>
                <template #default>
                    <div class="category">
                        <div class="category-left">
                            <Cover :src="currentCategoryObj.cover" :height="'90px'" :width="'90px'" />
                        </div>
                        <div class="category-right">
                            <div class="title">{{ currentCategoryObj.categoryName }}</div>
                            <div class="summary">{{ currentCategoryObj.categoryDesc || '暂无简介' }}</div>
                            <div class="count">文章数：{{ currentCategoryObj.blogCount }}</div>
                        </div>
                    </div>
                    <!-- <el-empty v-else :image-size="300" :description="'暂无数据'"></el-empty> -->
                </template>
            </el-skeleton>
            <!-- 博客列表 -->
            <el-skeleton :loading="blogListLoading" :count="1">
                <template #template>
                    <div class="blog-item-skeleton">
                        <el-skeleton-item variant="image" style="width: 110px; height: 110px" />
                        <div class="right">
                            <el-skeleton-item variant="p" style="width: 50%" />
                            <el-skeleton-item variant="p" style="width:80%" />
                            <el-skeleton-item variant="p" style="width: 65%" />
                        </div>
                    </div>
                </template>
                <template #default>
                    <div class="blog-list">
                        <template v-if="blogList.totalCount">
                            <BlogItem v-for="item in blogList.list" :data="item" :key="item.blogId" />
                            <div class="pagination">
                                <el-pagination background :current-page="blogList.pageNo" :page-size="blogList.pageSize"
                                    layout="prev, pager, next,total, " :total="blogList.totalCount"
                                    @current-change="handleCurrentChange" />
                            </div>
                        </template>
                        <el-empty v-else :image-size="300" :description="'暂无数据'"></el-empty>
                    </div>
                </template>
            </el-skeleton>
        </div>

        <!-- 侧边 -->
        <aside :style="{ transform: `translateY(${scrollTop}px)` }">
            <AsideContent :title="'分类专栏'" :to="'/category'">
                <template #default>
                    <el-skeleton :loading="loading" :count="3">
                        <template #template>
                            <div class="aside-item-skeleton">
                                <el-skeleton-item variant="image" style="width: 60px; height: 60px" />
                                <div class="right">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 20px" />
                                </div>
                            </div>
                        </template>
                        <template #default>
                            <template v-if="categoryList.length">
                                <CategoryItem v-for="item in categoryList" :key="item.categoryId"
                                    :to="'/category/' + item.categoryId" :count="item.blogCount" :cover="item.cover"
                                    :name="item.categoryName" :active="item.categoryId == categoryId" />
                            </template>
                            <el-empty v-else :image-size="40" :description="'暂无数据'"></el-empty>
                        </template>
                    </el-skeleton>
                </template>
            </AsideContent>
        </aside>
    </div>
</template>

<script setup>
import Cover from '@/components/Cover.vue'
import { reactive, ref, watch, inject } from 'vue';
import { useRoute } from 'vue-router'
import { useScroll } from '@/utils/hooks'
import api from '@/api'
const settings = inject('settings')
const route = useRoute()
const categoryId = ref(route.params.categoryId)

const blogList = reactive({
    list: [],
    pageNo: 1,
    pageSize: 15,
    pageTotal: 0,
    totalCount: 0,
})
// 获取博客列表
const blogListLoading = ref(true)
const getBlogList = async () => {
    blogListLoading.value = true
    const result = await api.loadBlogList({
        pageNo: blogList.pageNo,
        pageSize: blogList.pageSize,
        categoryId: categoryId.value,
    })
    if (!result) {
        return
    }
    Object.assign(blogList, result.data)
    setTimeout(() => {
        blogListLoading.value = false
    }, settings.skeletonDelayTime)
}
const handleCurrentChange = async (page) => {
    blogList.pageNo = page
    getBlogList()
}

const categoryList = reactive([])
const currentCategoryObj = reactive({})
const loading = ref(true)
// 获取分类专栏
const getCategory = async () => {
    loading.value = true
    const result = await api.loadCategory()
    if (!result) {
        return
    }
    categoryList.splice(0, categoryList.length, ...result.data)
    const temp = result.data.find(el => {
        return el.categoryId == categoryId.value
    })
    Object.assign(currentCategoryObj, temp)
    setTimeout(() => {
        loading.value = false
    }, settings.skeletonDelayTime)

}

// 滚动
const { scrollTop } = useScroll()

const init = async () => {
    await getBlogList()
    await getCategory()
}

init()
watch(route, (newV) => {
    categoryId.value = newV.params.categoryId
    init()
}, { immediate: true, deep: true })

</script>

<style lang="scss" scoped>
.category-detail {
    width: 100%;
    display: flex;
    justify-content: flex-start;

    

    .left>.blog-list,
    .left>.category,
    aside {
        height: max-content;
        padding: 0 15px;
        border-radius: 5px;
        background-color: #fff;
    }

    .left {
        width: calc(100% - 310px);

        .blog-item-skeleton {
            padding: 10px;
            background-color: #fff;
        }

        .category {
            margin-bottom: 10px;
            padding: 15px !important;
            display: flex;

            .category-left {
                width: 90px;
                height: 90px;
                margin-right: 10px;
                flex-shrink: 0;
                border-radius: 5px;
                overflow: hidden;
            }

            .category-right {
                flex-grow: 1;
                overflow: hidden;

                .title {

                    display: block;
                    color: #4bcffa;
                    font-size: 18px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .summary {
                    padding: 10px 0;
                    font-size: 16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .count {
                    font-size: 14px;
                    color: #808e9b;
                }
            }
        }

        .blog-list {

            .pagination {
                display: flex;
                justify-content: flex-end;
                padding: 20px;
            }

            .el-empty {
                &:deep(.el-empty__description) {
                    p {
                        font-size: 40px;
                    }
                }
            }
        }
    }

    aside {
        width: 300px;
        margin-left: 10px;
        padding-bottom: 5px;
    }
    
}
</style>