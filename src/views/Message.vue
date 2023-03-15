<template>
    <div class="message">
        <el-button @click="handleClick" size="large" type="primary">留言</el-button>
    </div>
</template>

<script setup>
const handleClick = () => {
    window.open('https://support.qq.com/product/514325')
}
</script>

<style lang="scss" scoped>
.message {
    border-radius: 5px;
    background-color: #fff;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>