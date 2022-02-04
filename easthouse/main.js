addEventListener('wheel', e => {
    e.preventDefault()
    scrollBy(e.deltaX + e.deltaY, 0)
}, {passive: false})
setTimeout(() => {
    document.body.style.display = 'block'
})