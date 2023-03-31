<template>
    <div v-if="src" class="cover" :style="{ backgroundImage: `url(${globalInfo.imageUrl + src})`, height, width }">
    </div>
    <div v-else class="cover" :style="{ width, height }">暂无封面</div>
</template>

<script setup>
import { inject } from 'vue'
const globalInfo = inject('globalInfo')
const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: '110px'
    },
    width: {
        type: String,
        default: '110px'
    },
})

</script>

<style lang="scss" scoped>
.cover {
    color: gray;
    font-size: 12px;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 110px;
    // height: 110px;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    // img {
    //     width: 100%;
    // }
}
</style>