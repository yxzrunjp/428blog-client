<template>
    <div class="user-item">
        <div class="user-avatar">
            <el-avatar v-if="data.avatar" :size="50" :src="globalInfo.imageUrl + data.avatar" />
            <el-avatar v-else :size="50">头像</el-avatar>
        </div>
        <div class="user-info">
            <router-link :to="'/user'">
                <div class="user-name">{{ data.nickName }}</div>
            </router-link>
            <div class="user-profession">{{ data.profession || '' }}</div>
        </div>
        <div class="count">{{ data.blogCount }}篇</div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
const globalInfo = inject('globalInfo')
const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
})
</script>

<style lang="scss" scoped>
.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // cursor: pointer;
    padding-top: 5px;

    .user-avatar {
        flex-shrink: 0;
    }

    .user-info {
        padding-left: 10px;
        height: 50px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .user-name {
            padding-top: 6px;
            color: #4bcffa;
            font-size: 14px;
        }

        .user-profession {
            margin-top: 4px;
            font-size: 12px;
            color: #808e9b;
        }
    }

    .count {
        width: 50px;
        flex-shrink: 0;
        font-size: 12px;
        text-align: right;
    }
}</style>