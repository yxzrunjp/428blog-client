<template>
    <div class="special">
        <el-skeleton :loading="listLoading" :count="4" :throttle="500">
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
                <template v-if="specialList.totalCount">
                    <div class="special-list">
                        <CategoryCard v-for="item in specialList.list" :to="'/special/' + item.categoryId"
                            :key="item.categoryId" :count="item.blogCount" :summary="item.categoryDesc"
                            :title="item.categoryName" :cover="item.cover" />
                    </div>
                    <div class="pagination">
                        <el-pagination background :current-page="specialList.pageNo" :page-size="specialList.pageSize"
                            layout="prev, pager, next,total, " :total="specialList.totalCount"
                            @current-change="handleCurrentChange" />
                    </div>
                </template>
                <el-empty v-else :image-size="200" :description="'暂无数据'"></el-empty>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup>
import CategoryCard from '@/components/CategoryCard.vue'
import { reactive, ref } from 'vue'
import api from '@/api'

// 获取专题
const specialList = reactive({
    list: [],
    pageNo: 1,
    pageSize: 16,
    pageTotal: 0,
    totalCount: 0,
})
const listLoading = ref(true)
const handleCurrentChange = (pageNo) => {
    specialList.pageNo = pageNo
    getSpecialList()
}
const getSpecialList = async () => {
    listLoading.value = true
    const result = await api.loadSpecial({ pageNo: specialList.pageNo, pageSize: specialList.pageSize })
    if (!result) {
        return
    }
    Object.assign(specialList, result.data)
    listLoading.value = false
}
const init = async () => {
    await getSpecialList()
}
init()
</script>
<style lang="scss" scoped>
.special {
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

    .el-empty {
        &:deep(.el-empty__description) {
            p {
                font-size: 24px;
            }
        }
    }

    .special-list {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .pagination {
        padding-right: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

}
</style>