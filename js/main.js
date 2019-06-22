(function(){
  'use strict'

  const url = '../doc/propostas-agora.pdf'

  let pdfDoc = null 
  let pageNum = 1 
  let pageIsRendering = false
  let pageNumIsPending = null 

  const scale = 1.0,
    canvas = document.querySelector('#pdf-section'),
    ctx = canvas.getContext('2d')


  //  render the page

  const renderPage = num => {
    pageIsRendering = true; 

    // get page
    pdfDoc.getPage(num).then(page => {
      // set scale
      const viewport = page.getViewport({ scale})
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
  const queueRenderPage = num =>{
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
        return;
      }

      pageNum--
      queueRenderPage(pageNum)
    }

  // show nxt page

  const showNextPage = _ => {
    if(pageNum >= pdfDoc.numPages){
      return;
    }

    pageNum++ 
    queueRenderPage(pageNum)
  }




  // get doc
  pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_

    document.querySelector('#page-count').textContent = pdfDoc.numPages

    renderPage(pageNum)
  })

  console.log(pdfDoc)


  // button events 

  document.querySelector('[data-js="prev"]').addEventListener('click',  showPrevPage ) 
  document.querySelector('[data-js="next"]').addEventListener('click',  showNextPage ) 

})()