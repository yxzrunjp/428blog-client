<template>
    <div class="blog-item">
        <div class="blog-item-cover">
            <Cover :src="data.cover"></Cover>
        </div>
        <div class="blog-item-info">
            <router-link :to="`/blogDetail/${data.blogId}`" class="blog-title">{{ data.title }}</router-link>
            <div class="blog-summary">{{ data.summary }}</div>
            <div class="blog-info">
                <span class="info-item">{{ data.createTime }}</span>
                <span class="info-item">作者：<router-link :to="'/user'" class="highlight-info">{{ data.nickName
                }}</router-link></span>
                <span class="info-item">分类专栏：<router-link :to="'/category/'+data.categoryId" class="highlight-info">{{ data.categoryName
                }}</router-link></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Cover from '@/components/Cover.vue'
const prop = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>

<style lang="scss" scoped>
.blog-item {
    border-bottom: 1px solid black;
    padding: 10px 0;
    display: flex;

    .blog-item-cover {
        flex-shrink: 0;
    }

    .blog-item-info {
        margin-left: 10px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        .blog-title {
            color: #4bcffa;
            font-size: 20px;
        }

        .blog-summary {
            color: #808e9b;
            word-break: break-all;
            // 多行省略
            overflow: hidden;
            text-overflow: ellipsis;
            // white-space: nowrap;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }

        .blog-info {
            font-size: 14px;

            .info-item {
                margin-right: 10px;

                .highlight-info {
                    color: #4bcffa;
                    font-size: 16px;
                }
            }
        }
    }
}
</style>