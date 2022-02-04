addEventListener('wheel', e => {
    e.preventDefault()
    scrollBy(e.deltaX + e.deltaY, 0)
}, {passive: false})