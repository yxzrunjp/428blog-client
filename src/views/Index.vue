<template>
    <div class="index-page">
        <!-- 博客列表 -->
        <div class="blog-list">
            <el-skeleton :loading="blogListLoading" :count="5" :throttle="500">
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
                    <template v-if="blogList.totalCount">
                        <BlogItem v-for="item in blogList.list" :data="item" :key="item.blogId" />
                        <div class="pagination">
                            <el-pagination background :current-page="blogList.pageNo" :page-size="blogList.pageSize"
                                layout="prev, pager, next,total, " :total="blogList.totalCount"
                                @current-change="handleCurrentChange" />
                        </div>
                    </template>
                    <el-empty v-else :image-size="300" :description="'暂无数据'"></el-empty>
                </template>
            </el-skeleton>
        </div>
        <!-- 侧边 -->
        <aside :style="{ transform: `translateY(${scrollTop}px)` }">
            <AsideContent :title="'博客成员'" :to="'/user'">
                <template #default>
                    <el-skeleton :loading="membersListLoading" :count="1" :throttle="500">
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
                            <template v-if="members.length">
                                <UserItem v-for="item in members" :key="item.userId" :data="item" />
                            </template>
                            <el-empty v-else :image-size="40" :description="'暂无数据'"></el-empty>
                        </template>
                    </el-skeleton>
                </template>
            </AsideContent>

            <AsideContent :title="'分类专栏'" :to="'/category'">
                <template #default>
                    <el-skeleton :loading="categoryListLoading" :count="1" :throttle="500">
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
                                    :name="item.categoryName" />
                            </template>
                            <el-empty v-else :image-size="40" :description="'暂无数据'"></el-empty>
                        </template>
                    </el-skeleton>
                </template>
            </AsideContent>

            <AsideContent :title="'专题'" :to="'/special'">
                <template #default>
                    <el-skeleton :loading="specialListLoading" :count="1" :throttle="500">
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
                            <template v-if="specialList.totalCount">
                                <CategoryItem v-for="item in specialList.list" :key="item.categoryId"
                                    :to="'/special/' + item.categoryId" :count="item.blogCount" :cover="item.cover"
                                    :name="item.categoryName" />
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
import { reactive, ref } from 'vue';
import { useScroll } from '@/utils/hooks'
import api from '@/api'

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
        pageSize: 7,
    })
    if (!result) {
        return
    }
    Object.assign(blogList, result.data)
    blogListLoading.value = false
}
const handleCurrentChange = async (page) => {
    blogList.pageNo = page
    getBlogList()
}

const categoryList = reactive([])
// 获取分类专栏
const categoryListLoading = ref(true)
const getCategory = async () => {
    categoryListLoading.value = true
    const result = await api.loadCategory({ pageSize: 3 })
    if (!result) {
        return
    }
    categoryList.splice(0, categoryList.length, ...result.data)
    categoryListLoading.value = false
}

// 获取专题
const specialList = reactive({
    list: [],
    pageNo: 1,
    pageSize: 5,
    pageTotal: 0,
    totalCount: 0,
})
const specialListLoading = ref(true)
const getSpecialList = async () => {
    specialListLoading.value = true
    const result = await api.loadSpecial({ pageSize: 3 })
    if (!result)
        return
    Object.assign(specialList, result.data)
    specialListLoading.value = false
}

// 获取成员
const members = reactive([])
const membersListLoading = ref(true)
const getMember = async () => {
    membersListLoading.value = true
    const result = await api.loadTeamUser({ pageSize: 3 })
    if (!result) {
        return
    }
    members.splice(0, members.length, ...result.data)
    membersListLoading.value = false
}

// 滚动
const { scrollTop } = useScroll()

const init = async () => {
    // 获取博客列表
    await getBlogList()
    // 获取分类
    await getCategory()
    // 获取专题
    await getSpecialList()
    // 获取成员
    await getMember()
}

init()
</script>

<style lang="scss" scoped>
.index-page {
    width: 100%;
    display: flex;
    justify-content: flex-start;

    .blog-list {
        width: calc(100% - 310px);

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

    aside {
        width: 300px;
        margin-left: 10px;
    }

    .blog-list,
    aside {
        height: max-content;
        padding: 0 15px;
        border-radius: 5px;
        background-color: #fff;
    }
}
</style>