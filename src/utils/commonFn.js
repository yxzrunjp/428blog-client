// 节流函数
export const throttling = (time, cb) => {
    let timer = null
    return () => {
        if (!timer) {
            timer = setTimeout(() => {
                cb()
                timer = null
            }, time)
        }
    }
}