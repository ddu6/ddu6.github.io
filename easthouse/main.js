addEventListener('wheel', e => {
    scrollBy(e.deltaX + e.deltaY, 0)
})