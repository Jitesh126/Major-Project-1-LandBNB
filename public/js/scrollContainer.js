const forHorizontalListing = document.querySelector(".forHorizontalListing");

forHorizontalListing.addEventListener("click", function(event) {   
    
    if(event.target.className == "fa-solid fa-chevron-left"){
        let outer = event.target.parentElement.parentElement.parentElement.nextElementSibling;
        outer.scrollBy({left:-290, behavior: 'smooth'});
    }

    if(event.target.className == "fa-solid fa-chevron-right"){
        let outer = event.target.parentElement.parentElement.parentElement.nextElementSibling;
        outer.scrollBy({left:284, behavior: 'smooth'});
    }
});
