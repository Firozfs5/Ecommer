// Api's to use in this projects are
// https://dummyjson.com/products
// https://fakestoreapi.com/products


// api call for landing page and updationg

async function lpDataForcarousals(carosualName){
    let datas=(await axios.get(`https://dummyjson.com/products/category/${carosualName}`));
    // let datas=(await axios.get(`https://dummyjson.com/products/categories`));
    // console.log(datas.data);
    return datas;
}

async function settingLpCarousals(carousalLocation,carosualName){
    let component=document.querySelector(carousalLocation);  //".set1 .landing-carousal .carousal-cards"
    // console.log(component.children);

    let rawData=await lpDataForcarousals(carosualName)   //home-decoration
    // console.log(rawData.data.products);


    for(let i=0;i<rawData.data.products.length;i++){
    // console.log(rawData.data.products[i].thumbnail);

        let imgTag=document.createElement('img');
        imgTag.style.objectFit='contain';
        imgTag.style.width='100%'
        imgTag.style.height='100%'
        imgTag.classList.add('hover-oneCard')

        imgTag.setAttribute('src',rawData.data.products[i].thumbnail)

        component.children[i].append(imgTag);
    }
    


    
}

settingLpCarousals(".set1 .landing-carousal .carousal-cards",'mobile-accessories');
settingLpCarousals(".set2 .landing-carousal .carousal-cards",'beauty');
settingLpCarousals(".set3 .landing-carousal .carousal-cards",'mens-shirts');
settingLpCarousals(".set4 .landing-carousal .carousal-cards",'womens-dresses');

// end for landing page


// SEARCH completopn IMPLMENTATION
async function searchCompletion(){

    const url=`https://dummyjson.com/products/categories`;
    let rawData=await axios.get(url);
    // console.log(rawData.data);
    

    let searchBar=document.querySelector("form input");

    let completionContainer=document.querySelector(".search-res-container")
    let searchResult=[];
    searchBar.addEventListener('input',()=>{
        // console.log(searchBar.value);
        searchResult=rawData.data.filter((item)=>item.slug.toLowerCase().startsWith(searchBar.value.toLowerCase()))
        console.log(searchResult);


        completionContainer.innerText="";

        if(searchResult.length===0){
            let divInContainer=document.createElement('div');
            divInContainer.classList.add(".search-res-container-child");
            divInContainer.innerText="sorry no ,Result";
            completionContainer.append(divInContainer);
        }
        else{
            for(let i=0;i<searchResult.length;i++){
            let divInContainer=document.createElement('div');
            divInContainer.classList.add("search-res-container-child");
            divInContainer.innerHTML=`<div><i class="fa-solid fa-magnifying-glass"></i> ${searchResult[i].slug}</div>`;
            completionContainer.append(divInContainer);


            //creation of searched carts dynamically.
            divInContainer.addEventListener("click",async (e)=>{
                let contentPage=document.querySelector("#content");
                console.log(contentPage);
                contentPage.innerText="";
                completionContainer.classList.toggle("visibility")
                
                
                searchBar.value="";
                // console.log("clciked");

                // content page creation

                let resultedArrays=await getDataForSearch(e.target.innerText);
                console.log(resultedArrays);
                contentPage.classList.add("cart-display");

                // cards creation inside it
                for(let i=0;i<resultedArrays.length;i++){
                   
                    cartCreation(resultedArrays,i,contentPage);

                }

                // end of content page creation 
                
            })

            }
        }

    
        completionContainer.classList.add("visibility");

        if(searchBar.value===""){
            completionContainer.classList.toggle("visibility");
            completionContainer.innerText="";
        }


    })
}

searchCompletion();
// END OF SEARCH IMPLMENTATION

// getting dat by calling api when searched in search bar
async function getDataForSearch(categoryName){
    let name=categoryName.trim();
    console.log(name);
    
    let url=`https://dummyjson.com/products/category/${name}`
    

    let data=await axios.get(url);
    // console.log(data.data.products);
    return data.data.products;
    
}


// creation of the carts 
function cartCreation(resultedArrays,i,contentPage){
     // image
     let cartDiv=document.createElement('div');
     cartDiv.classList.add('cart-display-children')
     contentPage.append(cartDiv);

     let imgContainer=document.createElement("div");
     imgContainer.classList.add("img-container");

     let img=document.createElement("img");
     img.setAttribute('src',resultedArrays[i].thumbnail)
     imgContainer.append(img)
     
     cartDiv.append(imgContainer)
     // image container ends

     // brandname
     let brandname=document.createElement("p");
     brandname.classList.add("cart-info-bName");
     brandname.innerText=resultedArrays[i].brand;
     cartDiv.append(brandname);

     // brandname ends

     // product Details start
     let p=document.createElement("p");
     p.classList.add("cart-info-p")
     p.innerText=resultedArrays[i].description.slice(0,70)+"..."
     cartDiv.append(p);
     // product Details ends

     // product and offer price starts
     let priceOfferDiv=document.createElement("div");
     priceOfferDiv.classList.add("price-offer-div");

     let price=document.createElement("p");
     price.classList.add("cart-info-price");
     price.innerText=`$ ${resultedArrays[i].price}  `;
     priceOfferDiv.append(price);

     let offer=document.createElement("p");
     offer.innerText=` ${resultedArrays[i].discountPercentage}%off`
     offer.classList.add("cart-info-offer");
     priceOfferDiv.append(offer);

     cartDiv.append(priceOfferDiv);


     // product price ends

     // rating badge
     let ratingBadge=document.createElement("div")
     ratingBadge.classList.add("rating-btn");
     // ratingBadge.classList.add("btn-success");
     ratingBadge.innerHTML=`<div>${resultedArrays[i].rating} <i class="fa-solid fa-star"></i></div>`
     
     cartDiv.append(ratingBadge);
     
     //end of rating badge

     // like button 
     let likeContainer=document.createElement("div");
     likeContainer.classList.add("like-container");
     let likeBtn=document.createElement("div");
     likeBtn.innerHTML=`<i class="fa-regular fa-heart"></i>`
     likeContainer.append(likeBtn);

     cartDiv.append(likeContainer);

     // end of like button

     // add to cart button
     let addCartBtn=document.createElement("button");
     addCartBtn.classList.add("btn");
     addCartBtn.classList.add("btn-dark");
     addCartBtn.classList.add("addto-cart-btn");
     addCartBtn.innerText="Add Cart";
     cartDiv.append(addCartBtn);
     // add to cart button end

     contentPage.append(cartDiv);

     cartDiv.addEventListener("click",displayProductPanel);

}
// end of cart cart card creation ends here

function displayProductPanel(e){
    if(e.target.classList.contains('cart-info-p')){
        console.log("view");

        // making the disalog viewing by cliking
        let contentCotainer=document.querySelector("body");
        let cartViewContainer=document.createElement("dialog");
        cartViewContainer.classList.add("cart-view-container");
        cartViewContainer.innerText=e.target.innerText;
        contentCotainer.append(cartViewContainer);
        cartViewContainer.show();
        // making the disalog viewing by cliking ending


        // close of view cart displaying
        let closeCartViewContainer=document.createElement("div");
        closeCartViewContainer.innerHTML=`<i class="fa-solid fa-xmark"></i>`
        closeCartViewContainer.classList.add("close-cart-view")
        cartViewContainer.append(closeCartViewContainer);
        

        // adding event to the container
        closeCartViewContainer.addEventListener('click',()=>{
            console.log("close");
            cartViewContainer.close();
            console.log(cartViewContainer);
        })

        // close of view cart displaying

    }
        

 }
