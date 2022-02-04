const main = document.body.children[1]
main.addEventListener('wheel', e => {
    e.preventDefault()
    main.scrollBy(e.deltaX + e.deltaY, 0)
}, {passive: false})