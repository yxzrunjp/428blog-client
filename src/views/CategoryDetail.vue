<template>
    <div class="category-detail">
        <!-- 博客列表 -->
        <div class="left">
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

            <div class="blog-list">
                <template v-if="blogList.list.length">
                    <BlogItem v-for="item in blogList.list" :data="item" :key="item.blogId" />
                    <div class="pagination">
                        <el-pagination :current-page="blogList.pageNo" :page-size="blogList.pageSize"
                            layout="prev, pager, next,total, " :total="blogList.totalCount"
                            @current-change="handleCurrentChange" />
                    </div>
                </template>
                <template v-else>
                    <div class="not-content">空空如也</div>
                </template>
            </div>
        </div>

        <!-- 侧边 -->
        <aside :style="{ transform: `translateY(${scrollTop}px)` }">
            <AsideContent :title="'分类专栏'" :to="'/category'">
                <template #default>
                    <template v-for="item in categoryList" :key="item.categoryId">
                        <CategoryItem :to="'/category/' + item.categoryId" :count="item.blogCount" :cover="item.cover"
                            :name="item.categoryName" :active="item.categoryId == categoryId" />
                    </template>
                </template>
            </AsideContent>
        </aside>
    </div>
</template>

<script setup>
import Cover from '@/components/Cover.vue'
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useScroll } from '@/utils/hooks'
import api from '@/api'
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
const getBlogList = async (pageNo) => {
    const result = await api.loadBlogList({
        pageNo,
        pageSize: 7,
        categoryId: categoryId.value,
    })
    if (!result) {
        return
    }
    Object.assign(blogList, result.data)
}
const handleCurrentChange = async (page) => {
    getBlogList(page)
}

const categoryList = reactive([])
const currentCategoryObj = reactive({})
// 获取分类专栏
const getCategory = async () => {
    const result = await api.loadCategory()
    if (!result)
        return
    Object.assign(categoryList, result.data)
    const temp = result.data.find(el => {
        return el.categoryId == categoryId.value
    })
    Object.assign(currentCategoryObj, temp)
}

// 滚动
const { scrollTop } = useScroll()

const init = async () => {
    await getBlogList(1)
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

    .left {
        width: calc(100% - 310px);

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

            .not-content {
                text-align: center;
                color: #808e9b;
                font-size: 16px;
                padding: 10px 0;
            }
        }
    }


    aside {
        width: 300px;
        margin-left: 10px;
    }

    .left>.blog-list,
    .left>.category,
    aside {
        height: max-content;
        padding: 0 15px;
        border-radius: 5px;
        background-color: #fff;
    }
}
</style>