const consult = document.querySelector('#consult')
const form = document.querySelector('form')
const main = document.querySelector('main')
main.addEventListener('wheel', e => {
    e.preventDefault()
    main.scrollBy(e.deltaX + e.deltaY, 0)
}, {passive: false})
consult.addEventListener('click', e => {
    e.stopPropagation()
    form.style.display = 'flex'
})
addEventListener('click', e => {
    form.style.display = 'none'
    // fix #
    for (const target of e.composedPath()) {
        if (!(target instanceof HTMLAnchorElement)) {
            continue
        }
        const href = target.getAttribute('href')
        if (href === null || !href.startsWith('#')) {
            break
        }
        e.stopPropagation()
        e.preventDefault()
        if (href.length === 1) {
            main.children[0].scrollIntoView({behavior: 'smooth', inline: 'start'})
            break
        }
        const id = decodeURIComponent(href.slice(1))
        const result = document.body.querySelector(`[id=${JSON.stringify(id)}]`)
        if (result !== null) {
            result.scrollIntoView({behavior: 'smooth', inline: 'start'})
        }
        break
    }
})