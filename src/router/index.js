import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/views/Layout.vue'),
        redirect: '/index',
        children: [
            {
                path: 'index',
                name: 'Index',
                meta: {
                    title: '博客'
                },
                component: () => import('@/views/Index.vue'),
            },
            {
                path: 'blogDetail/:blogId',
                name: 'BlogDetail',
                meta: {
                    title: '博客详情'
                },
                component: () => import('@/views/BlogDetail.vue'),
            },
            {
                path: 'category',
                name: "Category",
                meta: {
                    title: '分类专栏'
                },
                component: () => import('@/views/Category.vue'),
            },
            {
                path: 'category/:categoryId',
                name: "CategoryDetail",
                meta: {
                    title: '分类专栏'
                },
                component: () => import('@/views/CategoryDetail.vue'),
            },
            {
                path: 'special',
                name: "Special",
                meta: {
                    title: '专题'
                },
                component: () => import('@/views/Special.vue'),
            },
            {
                path: 'special/:id',
                name: "SpecialDetail",
                meta: {
                    title: '专题'
                },
                component: () => import('@/views/SpecialDetail.vue'),
            },
            {
                path: 'user',
                name: "User",
                meta: {
                    title: '成员'
                },
                component: () => import('@/views/User.vue'),
            },
            {
                path: 'message',
                name: "Message",
                meta: {
                    title: '留言板'
                },
                component: () => import('@/views/Message.vue'),
            },
            {
                path: '/:pathMatch(.*)*',
                name: 'NotFound',
                meta: {
                    title: '404'
                },
                component: () => import('@/views/NotFound.vue')
            }
        ],
    }
]
const router = createRouter({
    routes,
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHistory(),
})
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'blog'
    next()
})

export default router