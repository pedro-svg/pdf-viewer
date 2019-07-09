(function(){
  'use strict'

  const url = '../doc/log.pdf'

  let 
  pdfDoc = null, 
  pageNum = 1, 
  pageIsRendering = false,
  scale = 1.5,
  pageNumIsPending = null 

  const  
  canvas = document.querySelector('#pdf-canvas'),
  ctx = canvas.getContext('2d')



  // get doc
  pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_
  
    document.querySelector('#page-count').textContent = pdfDoc.numPages
  
    renderPage(pageNum)
  })




  //  render the page
  function renderPage(num){
    pageIsRendering = true; 

    // get page
    pdfDoc.getPage(num).then(page => {
      // set scale
      const viewport = page.getViewport({ scale })
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderCtx = {
        canvasContext: ctx,
        viewport
      }

      page.render(renderCtx).promise.then( _ => {
        pageIsRendering = false

        if(pageNumIsPending !== null){
          renderPage(pageNumIsPending)
          pageIsRendering = null
        }
      })

      // output current page 
      document.querySelector('#page-num').textContent = num

    })
  }

  
  
  // check for pages rendering
  function queueRenderPage(num){
    if(pageIsRendering){
      pageNumIsPending = num 
    }

    else{
      renderPage(num)
    }
  }
  
  
  
  //show prev page 
  const showPrevPage = _ => {
    if(pageNum <= 1){
      return
    }

    pageNum--
    queueRenderPage(pageNum)
  }

// show nxt page

  const showNextPage = _ => {
    if(pageNum >= pdfDoc.numPages){
      return
    }

    pageNum++ 
    queueRenderPage(pageNum)
  }

  function fadeScale(){
  
    if(scale <= 0.8){
      return;
    }

    scale-=0.2
    console.log(scale)
  }

  function growScale(){
  
    if(scale >= 3){
      return;
    }

    scale+=0.2
    console.log(scale)
  }

  function showMenu(){
    document.querySelector('').style.display = ''
  }

  function downloadDoc(){
    document.getElementById('dl').setAttribute('href',`${url}`)
  }



  // button events 
  document.querySelector('[data-js="prev"]').addEventListener('click',  showPrevPage, false ) 
  document.querySelector('[data-js="next"]').addEventListener('click',  showNextPage, false ) 
  document.querySelector('[data-js="fadeScale"]').addEventListener('click', fadeScale, false)
  document.querySelector('[data-js="growScale"]').addEventListener('click', growScale, false)
  // document.querySelector('[data-js="options"]').addEventListener('click', showMenu, false)
  document.getElementById('dl').addEventListener('click', downloadDoc, false)

})()