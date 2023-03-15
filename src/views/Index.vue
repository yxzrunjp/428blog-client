<template>
    <div class="index-page">
        <!-- 博客列表 -->
        <div class="blog-list">
            <BlogItem v-for="item in blogList.list" :data="item" :key="item.blogId" />
            <div class="pagination">
                <el-pagination :current-page="blogList.pageNo" :page-size="blogList.pageSize"
                    layout="prev, pager, next,total, " :total="blogList.totalCount" @current-change="handleCurrentChange" />
            </div>

        </div>
        <!-- 侧边 -->
        <aside :style="{ transform: `translateY(${scrollTop}px)` }">
            <AsideContent :title="'博客成员'" :to="'/user'">
                <template #default>
                    <!-- <CategoryItem v-for="item in members" :key="item.userId" :count="item.blogCount" :cover="item.avatar"
                        :name="item.nickName" /> -->
                    <template v-for="item in members" :key="item.userId">
                        <!-- <router-link :to="'/user?id=' + item.userId"> -->
                        <UserItem :data="item" />
                        <!-- </router-link> -->
                    </template>

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

            <AsideContent :title="'专题'" :to="'/special'">
                <template #default>
                    <template v-for="item in specialList.list" :key="item.categoryId">
                        <router-link :to="'/special/' + item.categoryId">
                            <CategoryItem :count="item.blogCount" :cover="item.cover" :name="item.categoryName" />
                        </router-link>
                    </template>

                </template>
            </AsideContent>
        </aside>
    </div>
</template>

<script setup>
import { reactive, getCurrentInstance, } from 'vue';
import { useScroll } from '@/utils/hooks'
import api from '@/api'
const { proxy } = getCurrentInstance()

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
// 获取分类专栏
const getCategory = async () => {
    const result = await api.loadCategory({ pageSize: 3 })
    if (!result)
        return
    Object.assign(categoryList, result.data)
}

// 获取专题
const specialList = reactive({
    list: [],
    pageNo: 1,
    pageSize: 5,
    pageTotal: 0,
    totalCount: 0,
})
const getSpecialList = async () => {
    const result = await api.loadSpecial({ pageSize: 5 })
    if (!result)
        return
    Object.assign(specialList, result.data)
}

// 获取成员
const members = reactive([])
const getMember = async () => {
    const result = await api.loadTeamUser({ pageSize: 5 })
    if (!result)
        return
    Object.assign(members, result.data)
}

// 滚动
const { scrollTop } = useScroll()

const init = async () => {
    await getBlogList(1)
    await getCategory()
    await getSpecialList()
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