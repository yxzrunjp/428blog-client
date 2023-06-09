import Request from '@/utils/Request'

// 获取系统信息
const getSysInfo = async () => {
    return Request({
        url: '/view/getSysInfo'
    })
}

// 获取博客列表
const loadBlogList = async (params) => {
    return Request({
        url: '/view/loadBlogList',
        params,
        showLoading:false,
    })
}

// 获取分类专栏
const loadCategory = async (params) => {
    return Request({
        url: '/view/loadCategory',
        params,
        showLoading:false,
    })
}

// 获取专题列表
const loadSpecial = async (params) => {
    return Request({
        url: '/view/loadSpecial',
        params,
        showLoading:false,
    })
}

// 获取专题详情
const getSpecialDetail = async (params)=>{
    return Request({
        url:'/view/getSpecialDetail',
        params
    })
}

// 获取成员
const loadTeamUser = async (params) => {
    return Request({
        url: '/view/loadTeamUser',
        params,
        showLoading:false,
    })
}

// 获取博客详情
const getBlogDetail = async (params)=>{
    return Request({
        url:'/view/getBlogDetail',
        params
    })
}


export default {
    getSysInfo,
    loadBlogList,
    loadCategory,
    loadSpecial,
    loadTeamUser,
    getBlogDetail,
    getSpecialDetail,
}