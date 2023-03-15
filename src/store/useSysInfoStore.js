import { defineStore } from 'pinia'

export const useSysInfoStore = defineStore('sysInfo', {
    state: () => {
        return {
            changyanAppId: null,
            changyanAppKey: null,
            commentId: null,
            icpDomain: null,
            icpNo: null,
            openCommentType: null,
            policeNo: null,
            policeProvince: null,
            showIcp: null,
        }
    }
})