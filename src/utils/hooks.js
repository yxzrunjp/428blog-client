import { ref, onMounted, onBeforeUnmount } from "vue";

export function useScroll() {
    const scrollTop = ref(0)
    const scrollEvent = () => {
        scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop
    }
    onMounted(() => {
        document.addEventListener('scroll', scrollEvent)
    })
    onBeforeUnmount(() => {
        document.removeEventListener('scroll', scrollEvent)
    })
    return {
        scrollTop
    }
}