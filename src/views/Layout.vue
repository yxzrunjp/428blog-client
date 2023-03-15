<template>
    <div class="layout"
        :style="{ minWidth: pageInfoStore.mainWidth + 'px', paddingTop: pageInfoStore.topPartHeight + `px`, }">
        <header :style="{ height: pageInfoStore.headerHeight + 'px' }">
            <div class="header-nav" :style="{ width: pageInfoStore.mainWidth + 'px' }">
                <router-link class="nav-logo" :to="'/'">
                    <img src="../assets/img/cloud.png">
                </router-link>
                <router-link v-for="i in menu" :key="i.path"
                    :class="[currentPath === i.path ? 'nav-item-active' : 'nav-item']" :to="i.path">{{ i.name
                    }}</router-link>
            </div>
        </header>
        <main
            :style="{ width: pageInfoStore.mainWidth + 'px', minHeight: `calc(100vh - ${sysInfoStore.showIcp === 1 ? pageInfoStore.topPartAndFooterHeight : pageInfoStore.topPartHeight}px)` }">
            <RouterView></RouterView>
        </main>
        <footer v-if="sysInfoStore.showIcp === 1" :style="{ height: pageInfoStore.footerHeight + 'px' }">
            <div>2021-{{ new Date().getFullYear() }} {{ sysInfoStore.icpDomain }} All rights reserved. {{
                sysInfoStore.policeProvince }}ICP备{{
        sysInfoStore.icpNo }}</div>
            <div>{{ sysInfoStore.policeProvince }}公安备案 {{ sysInfoStore.policeNo }}</div>
        </footer>
    </div>
</template>

<script setup>
import api from '@/api'
import { watch, ref } from 'vue'
import { useSysInfoStore } from '@/store/useSysInfoStore'
import { useRoute } from 'vue-router'
import { usePageInfoStore } from '@/store/usePageInfoStore.js'
const pageInfoStore = usePageInfoStore()
const sysInfoStore = useSysInfoStore()
const route = useRoute()

const menu = [
    {
        path: '/index',
        name: '博客',
    },
    {
        path: '/category',
        name: '分类专栏',
    },
    {
        path: '/special',
        name: '专题',
    },
    {
        path: '/user',
        name: '成员',
    },
    {
        path: '/message',
        name: '留言板',
    },
]


// 监听路由变化
const currentPath = ref('')
watch(route, (v) => {
    currentPath.value = v.path
}, { immediate: true, deep: true })

// 获取系统信息
const getSysInfo = async () => {
    const result = await api.getSysInfo()
    if (!result) {
        return
    }
    sysInfoStore.$patch({
        ...result.data
    })
}
// 初始化
const init = async () => {
    await getSysInfo()
}
init()
</script>

<style lang="scss" scoped>
.layout {
    background-color: #f4f4f4;
    position: relative;

    header {
        width: 100%;
        background-color: #70a1ff;
        box-shadow: 0px 0px 5px gray;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;

        .header-nav {
            margin: 0 auto;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .nav-logo {
                // color: rgb(111, 225, 225);
                // font-weight: bold;
                // font-size: 30px;
                font-size: 0;

                img {
                    width: 70px;
                }
            }

            .nav-item {
                font-size: 18px;
                font-weight: bold;
                color: #fff;

                &:hover {
                    color: #3742fa;
                }
            }

            .nav-item-active {
                font-size: 18px;
                font-weight: bold;
                color: #3742fa;
            }

            a[class*="nav-"] {
                margin-right: 20px;
            }
        }
    }

    main {
        margin: 0 auto;
    }

    footer {
        line-height: 30px;
        text-align: center;
        font-size: 12px;
    }
}
</style>