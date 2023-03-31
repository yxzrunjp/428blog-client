<template>
    <div class="category-item">
        <div class="left">
            <div class="category-cover">
                <Cover :src="cover" :height="'60px'" :width="'60px'" />
            </div>
            <router-link :class="['category-title', active ? 'active-title' : '']" :to="to">
                {{ name }}
            </router-link>
        </div>
        <div class="right">{{ count }}篇</div>
    </div>
</template>

<script setup>
import Cover from '@/components/Cover.vue'
const prop = defineProps({
    count: {
        type: Number,
        default: 0,
    },
    name: {
        type: String,
        default: 'Name',
    },
    cover: {
        type: String,
        default: '',
    },
    active: {
        type: Boolean,
        default: false,
    },
    to: {
        type: String,
        default: '/',
    }
})
</script>

<style lang="scss" scoped>
.category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    cursor: pointer;

    .left {
        flex-grow: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        .category-title{
            color: #4bcffa;
        }

        .category-cover {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 5px;
        }

        .active-title {
            color: #3742fa;
        }
    }

    .right {
        flex-shrink: 0;
        width: 40px;
        font-size: 12px;
        text-align: right;
    }
}
</style>