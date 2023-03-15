<template>
    <div class="user-page">
        <div class="user-item" v-for="item in users" :key="item.userId">
            <div class="user-avatar">
                <el-avatar :size="150" :src="proxy.globalInfo.imageUrl + item.avatar">
                    <span :style="{ fontSize: '20px' }">暂无头像</span>
                </el-avatar>
            </div>
            <div class="user-info">
                <div class="nickname" :id="item.userId">{{ item.nickName }}</div>
                <div class="other-info">
                    <span class="profession">职位：{{ item.profession || '保密' }}</span>
                    <span class="blog-count">博客数量：{{ item.blogCount }}</span>
                </div>
                <PreviewHtml :html="item.introduction" />
            </div>
        </div>
    </div>
</template>

<script setup>
import PreviewHtml from '@/components/PreviewHtml.vue';
import api from '@/api'
import { reactive, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance()

const users = reactive([])
const getUser = async () => {
    const result = await api.loadTeamUser()
    if (!result)
        return
    Object.assign(users, result.data)
}
const init = async () => {
    await getUser()
}
init()
</script>

<style lang="scss" scoped>
.user-page {
    padding: 15px;

    .user-item {
        background-color: #fff;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-start;

        .user-avatar {
            width: 150px;
            margin-right: 10px;
        }

        .user-info {
            flex: 1;
            padding-top: 10px;

            .nickname {
                font-weight: bold;
                font-size: 18px;
            }

            .other-info {
                font-size: 16px;
                margin-top: 15px;
                margin-bottom: 15px;

                .profession {
                    margin-right: 30px;
                }

                .blog-count {}
            }

            .v-md-editor-preview {
                &:deep(.github-markdown-body) {
                    padding: 0;
                }
            }

        }
    }
}
</style>