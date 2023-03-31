<template>
    <div class="user-page">
        <el-skeleton :loading="listLoading" :count="1" :throttle="500">
            <template #template>
                <div class="blog-item-skeleton">
                    <el-skeleton-item variant="image" style="width: 150px; height: 150px" />
                    <div class="right">
                        <el-skeleton-item variant="p" style="width: 50%" />
                        <el-skeleton-item variant="p" style="width: 65%" />
                        <el-skeleton-item variant="p" style="width:80%" />
                    </div>
                </div>
            </template>
            <template #default>
                <template v-if="users.length">
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
                </template>
                <el-empty v-else :image-size="300" :description="'暂无数据'"></el-empty>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup>
import PreviewHtml from '@/components/PreviewHtml.vue';
import api from '@/api'
import { reactive, getCurrentInstance, ref } from 'vue';
const { proxy } = getCurrentInstance()

const users = reactive([])
const listLoading = ref(true)
const getUser = async () => {
    listLoading.value = true
    const result = await api.loadTeamUser()
    if (!result) {
        return
    }
    users.splice(0, users.length, ...result.data)
    listLoading.value = false
}
const init = async () => {
    await getUser()
}
init()
</script>

<style lang="scss" scoped>
.user-page {
    padding: 15px;

    .el-empty {
        &:deep(.el-empty__description) {
            p {
                font-size: 26px;
            }
        }
    }

    .blog-item-skeleton,
    .user-item {
        background-color: #fff;
        padding: 15px;
    }

    .user-item {
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
}</style>