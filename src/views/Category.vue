<template>
    <div class="category">
        <CategoryCard v-for="item in categoryList" 
            :to="'/category/'+item.categoryId"
            :key="item.categoryId" 
            :count="item.blogCount"
            :summary="item.categoryDesc" 
            :title="item.categoryName" 
            :cover="item.cover" 
            />
    </div>
</template>

<script setup>
import CategoryCard from '@/components/CategoryCard.vue'
import { reactive } from 'vue'
import api from '@/api'

const categoryList = reactive([])
// 获取分类专栏
const getCategory = async () => {
    const result = await api.loadCategory()
    if (!result)
        return
    Object.assign(categoryList, result.data)
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
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
</style>