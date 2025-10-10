
  const taxToggle = document.querySelector(".option-tax-toggle");
  taxToggle.addEventListener("click", ()=>{
    let gstBtns = document.getElementsByClassName("gst");
    for(let gstBtn of gstBtns){
      if(gstBtn.style.display != "inline"){
        gstBtn.style.display="inline";
      } else {
        gstBtn.style.display="none";
      }
    }
  });
