<template>
    <div class="special">
        <div class="special-list">
            <CategoryCard v-for="item in specialList.list" :to="'/special/' + item.categoryId" :key="item.categoryId"
                :count="item.blogCount" :summary="item.categoryDesc" :title="item.categoryName" :cover="item.cover" />
        </div>
        <div class="pagination">
            <el-pagination :current-page="specialList.pageNo" :page-size="specialList.pageSize"
                layout="prev, pager, next,total, " :total="specialList.totalCount" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import CategoryCard from '@/components/CategoryCard.vue'
import { reactive } from 'vue'
import api from '@/api'

// 获取专题
const specialList = reactive({
    list: [],
    pageNo: 1,
    pageSize: 16,
    pageTotal: 0,
    totalCount: 0,
})
const handleCurrentChange = (pageNo) => {
    getSpecialList(pageNo)
}
const getSpecialList = async (pageNo) => {
    const result = await api.loadSpecial({ pageNo,pageSize:specialList.pageSize })
    if (!result)
        return
    Object.assign(specialList, result.data)
}
const init = async () => {
    await getSpecialList(1)
}
init()
</script>
<style lang="scss" scoped>
.special {
    background-color: #fff;
    padding: 15px;

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