<template>
    <div v-if="src" class="cover" :style="{ backgroundImage: `url(${proxy.globalInfo.imageUrl + src})`, height, width }">
        <!-- <img :src="proxy.globalInfo.imageUrl+src" v-if="src">
            <span v-else>暂无封面</span> -->
    </div>
    <div v-else class="cover" :style="{ width, height }">暂无封面</div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
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