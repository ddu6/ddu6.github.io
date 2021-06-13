export function card(unit){
    const {name,desc,src,href}=unit.options.object
    const element=document.createElement('a')
    const nameEle=document.createElement('div')
    const descEle=document.createElement('div')
    if(typeof name==='string')nameEle.textContent=name
    if(typeof desc==='string')descEle.textContent=desc
    if(typeof src==='string'){
        element.href='?src='+encodeURIComponent(src)
    }else if(typeof href==='string'){
        if(href.endsWith('.pdf')){
            element.href='https://mozilla.github.io/pdf.js/web/viewer.html?file='+encodeURIComponent(href)
        }else{
            element.href=href
        }
    }
    element.target='_blank'
    element.classList.add('card')
    element.classList.add('pre')
    nameEle.classList.add('name')
    descEle.classList.add('desc')
    element.append(nameEle)
    element.append(descEle)
    return element
}