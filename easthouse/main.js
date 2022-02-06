const consult = document.querySelector('#consult')
const form = document.querySelector('form')
const main = document.querySelector('main')
const rect = document.querySelector('#history-rect')
const footer = document.querySelector('footer')
main.addEventListener('wheel', e => {
    e.preventDefault()
    const delta = e.deltaX + e.deltaY
    main.scrollBy(delta, 0)
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
for (let i = 0; i < footer.children.length; i++) {
    const tab = footer.children[i]
    const line = document.createElement('div')
    tab.prepend(line)
    line.style.height = '1px'
    line.style.marginBottom = '.5em'
}
function update() {
    for (let i = 0; i < main.children.length; i++) {
        const part = main.children[i]
        const tab = footer.children[i]
        const line = tab.children[0]
        const {left, right, width} = part.getBoundingClientRect()
        if (left <= visualViewport.width / 2 && right >= visualViewport.width / 2) {
            const percent = 100 * (visualViewport.width - left) / width
            const rightPercent = Math.max(0, -100 * left / (width - visualViewport.width))
            part.classList.remove('fade')
            tab.style.opacity = '1'
            line.style.background = `linear-gradient(to right, goldenrod ${percent}%, lightgray ${percent}%)`
            if (i === 3) {
                rect.setAttribute('width', `${rightPercent}%`)
                if (rightPercent < 50) {
                    part.classList.remove('gray')
                } else {
                    part.classList.add('gray')
                }
            }
            continue
        }
        part.classList.add('fade')
        tab.style.opacity = '.5'
        line.style.background = 'lightgray'
    }
}
setTimeout(() => {
    update()
}, 100)
main.addEventListener('scroll', update)
main.addEventListener('touchmove', update)