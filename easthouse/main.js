const consult = document.querySelector('#consult')
const form = document.querySelector('form')
const main = document.querySelector('main')
const footer = document.querySelector('footer')
let scrolling = false
main.addEventListener('wheel', async e => {
    e.preventDefault()
    if (scrolling) {
        return
    }
    const delta = e.deltaX + e.deltaY
    for (let i = 0; i < main.children.length; i++) {
        const part = main.children[i]
        const {left, right} = part.getBoundingClientRect()
        if (
            delta > 0 && left > 0 && left < visualViewport.width + 1
            || delta < 0 && right > -1 && right < visualViewport.width
        ) {
            scrolling = true
            part.scrollIntoView({behavior: 'smooth', inline: 'start'})
            while (true) {
                await new Promise(r => setTimeout(r, 100))
                const {left} = part.getBoundingClientRect()
                if (delta > 0 && left < 1 || delta < 0 && left > -1) {
                    break
                }
            }
            await new Promise(r => setTimeout(r, 500))
            scrolling = false
            return
        }
    }
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
for (let i = 0; i < footer.children.length; i++) {
    const tab = footer.children[i]
    const line = document.createElement('div')
    tab.prepend(line)
    line.style.height = '1px'
    line.style.marginBottom = '.5em'
    if (i === 0) {
        line.style.background = 'goldenrod'
        continue
    }
    tab.style.opacity = '.5'
    line.style.background = 'lightgray'
}
main.addEventListener('scroll', () => {
    let index = 0
    let percent = 100
    for (let i = 0; i < main.children.length; i++) {
        const part = main.children[i]
        const {left, width} = part.getBoundingClientRect()
        if (left > 0) {
            break
        }
        index = i
        percent = 100 * Math.min(1, (visualViewport.width - left) / width)
    }
    for (let i = 0; i < footer.children.length; i++) {
        const tab = footer.children[i]
        const line = tab.children[0]
        if (i === index) {
            tab.style.opacity = '1'
            line.style.background = `linear-gradient(to right, goldenrod ${percent}%, lightgray ${percent}%)`
            continue
        }
        tab.style.opacity = '.5'
        line.style.background = 'lightgray'
    }
})