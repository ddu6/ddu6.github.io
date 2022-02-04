addEventListener('wheel', e => {
    e.preventDefault()
    scrollBy(e.deltaX + e.deltaY, 0)
}, {passive: false})
const consult = document.querySelector('#consult')
const form = document.querySelector('form')
consult.addEventListener('click', e => {
    e.stopPropagation()
    form.style.display = 'flex'
})
addEventListener('click', () => {
    form.style.display = 'none'
})