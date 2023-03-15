<template>
    <div class="category-card">
        <div class="card-content">
            <div class="left">
                <Cover :src="cover" :height="'90px'" :width="'90px'" />
            </div>
            <div class="right">
                <router-link class="title" :to="to">{{ title }}</router-link>
                <div class="summary">{{ summary || '暂无简介' }}</div>
                <div class="count">文章数：{{ count }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Cover from '@/components/Cover.vue'
const prop = defineProps({
    cover: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },
    summary: {
        type: String,
        default: '',
    },
    count: {
        type: Number,
        default: 0,
    },
    to: {
        type: String,
        required: true,
    }
})
</script>

<style lang="scss" scoped>
.category-card {
    width: 25%;
    padding: 15px;

    .card-content {
        width: 100%;
        border: 1px solid #808e9b;
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;

        .left {
            width: 90px;
            height: 90px;
            margin-right: 10px;
            flex-shrink: 0;
            border-radius: 5px;
            overflow: hidden;
        }

        .right {
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
                font-size: 14px;
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
}
</style>