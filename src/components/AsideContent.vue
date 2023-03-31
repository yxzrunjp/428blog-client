<template>
    <div class="aside-content">
        <div class="aside-content-header">
            <div class="title">{{ title }}</div>
            <router-link v-if="to" :to="to" class="more">更多&gt;&gt;</router-link>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const prop = defineProps({
    title: {
        type: String,
        default: ''
    },
    to: {
        type: String,
        default:''
    }
})

</script>

<style lang="scss" scoped>
.aside-content {
    padding: 5px 0px;

    .aside-content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        border-bottom: 1px solid gray;
        padding: 5px 0;

        .title {}

        .more {
            font-size: 14px;
            cursor: pointer;
            color: #4bcffa;
        }
    }
}
</style>