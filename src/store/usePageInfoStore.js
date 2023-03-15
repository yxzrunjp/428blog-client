import { defineStore } from 'pinia'

export const usePageInfoStore = defineStore('pageInfo', {
    state: () => {
        return {
            headerHeight: 80,//header部分高80px
            footerHeight: 60,//footer的高
            headerAndMainSpace: 10,//header和main的间距
            mainWidth: 1200,//内容的宽
        }
    },
    getters: {
        topPartHeight: (state) => {
            return state.headerHeight + state.headerAndMainSpace
        },
        topPartAndFooterHeight: (state) => state.headerHeight + state.headerAndMainSpace + state.footerHeight,
    }
})