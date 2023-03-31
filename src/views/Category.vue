<template>
    <div class="category">
        <el-skeleton :loading="listLoading" :count="4">
            <template #template>
                <div class="blog-item-skeleton">
                    <el-skeleton-item variant="image" style="width: 110px; height: 110px" />
                    <div class="right">
                        <el-skeleton-item variant="p" style="width: 50%" />
                        <el-skeleton-item variant="p" style="width:80%" />
                        <el-skeleton-item variant="p" style="width: 45%" />
                    </div>
                </div>
            </template>
            <template #default>
                <template v-if="categoryList.length">
                    <div class="list">
                        <CategoryCard v-for="item in categoryList" :to="'/category/' + item.categoryId"
                            :key="item.categoryId" :count="item.blogCount" :summary="item.categoryDesc"
                            :title="item.categoryName" :cover="item.cover" />
                    </div>
                </template>
                <el-empty v-else :image-size="200" :description="'暂无数据'"></el-empty>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup>
import CategoryCard from '@/components/CategoryCard.vue'
import { reactive, ref, inject } from 'vue'
import api from '@/api'

const settings = inject('settings')
const categoryList = reactive([])
const listLoading = ref(true)
// 获取分类专栏
const getCategory = async () => {
    listLoading.value = true
    const result = await api.loadCategory()
    if (!result) {
        return
    }
    categoryList.splice(0, categoryList.length, ...result.data)
    setTimeout(() => {
        listLoading.value = false
    }, settings.skeletonDelayTime)
}
const init = async () => {
    await getCategory()
}
init()
</script>
<style lang="scss" scoped>
.category {
    background-color: #fff;
    padding: 15px;

    .el-skeleton {
        display: flex;
        flex-wrap: wrap;

        .blog-item-skeleton {
            width: 25%;
            padding: 15px;
        }
    }

    .list {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;


    }

    .el-empty {
        &:deep(.el-empty__description) {
            p {
                font-size: 24px;
            }
        }
    }
}
</style>