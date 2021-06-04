const script=document.createElement('script')
script.src='https://cdn.jsdelivr.net/gh/ddu6/st@0.1.5/dist/editor.js'
const current=document.currentScript
if(current instanceof HTMLScriptElement){
    const src=current.dataset.src
    if(typeof src==='string'&&src.length>0){
        script.dataset.src=src
    }
}
document.body.append(script)