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

    // id of the product
    let id=document.createElement("span");
    id.innerText=resultedArrays[i].id;
    id.style.opacity="0";
    brandname.append(id);
    // end of id

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

async function displayProductPanel(e){

    async function getClickedProduct(){
       let idNumber= e.target.parentElement.children[1].children[0].innerText;
       let productData=(await axios.get(`https://dummyjson.com/products/${idNumber}`)).data;

        console.log(productData)
        return productData;
    }

    // getClickedProduct();

    if(e.target.classList.contains('cart-info-p')){
        console.log("view");

        // making the disalog viewing by cliking
        let contentCotainer=document.querySelector("body");
        let cartViewContainer=document.createElement("dialog");
        cartViewContainer.classList.add("cart-view-container");
        // cartViewContainer.innerText=e.target.innerText;
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

        // adding a new div inside the cart container(dialog)
            let cartViewLayout=document.createElement("div");
            cartViewContainer.append(cartViewLayout);
            cartViewLayout.classList.add('cart-view-layout');

        //section 1 
        let productViewSection=document.createElement("div");
        //section 2
        let productDetailsSection=document.createElement("div");

        // productDetailsSection.classList.add("cart-view-layout-children");
        // productViewSection.classList.add("cart-view-layout-children");

        // productViewSection.style.backgroundColor="red";
        // productDetailsSection.style.backgroundColor="yellow";

        cartViewLayout.append(productViewSection);
        cartViewLayout.append(productDetailsSection);

        // end of the cartView

        // section one design
        productViewSection.classList.add("product-view-section");
        let smallImgPreview=document.createElement("div");
        let bigImgPreview=document.createElement("div");
        let cartBuyBtns=document.createElement("div");

        productViewSection.append(smallImgPreview);
        productViewSection.append(bigImgPreview);
        productViewSection.append(cartBuyBtns);

        let bigImgTag=document.createElement("img");
        bigImgTag.classList.add("big-img-tag")
        bigImgPreview.append(bigImgTag);

        // heart
        let heartLogoContainer=document.createElement('span');
        heartLogoContainer.innerHTML=`<i class="fa-regular fa-heart"></i>`
        heartLogoContainer.classList.add("heart-logo");
        productViewSection.append(heartLogoContainer);
        console.log(heartLogoContainer.parentElement); // Should log productViewSection

        // heart ends

        //data retriewer
        let productData=await getClickedProduct();

        // big img preview
        bigImgTag.src=(productData).images[0];
        

        //multiple img prview
        smallImgPreview.classList.add("small-img-preview") 

        let smallImgDiv=document.createElement('div');
        smallImgDiv.classList.add("small-img-div");
        smallImgPreview.append(smallImgDiv)

        for(let i=0;i<productData.images.length;i++){
            let smallImgTags=document.createElement("img");
            smallImgTags.classList.add("small-img-tags")
            smallImgTags.src=productData.images[i];
            smallImgDiv.append(smallImgTags)

            smallImgTags.addEventListener("click",(e)=>{
                bigImgTag.src=e.target.src;
            });
        }


        // buy and cart buttons
        cartBuyBtns.classList.add("cart-buybtns")
        let addCartBtn=document.createElement("button");
        addCartBtn.innerHTML='<i class="fa-solid fa-cart-shopping"></i> Add Cart';
        addCartBtn.classList.add("btn","btn-dark");


        let buyBtn=document.createElement("button");
        buyBtn.innerHTML='<i class="fa-solid fa-bolt"></i> Buy Now';
        buyBtn.classList.add("btn","btn-primary");

        cartBuyBtns.append(addCartBtn,buyBtn);
        // end of buy and cart btns
        

        // end os section 1


        // section 2 for the detrails showcase
        productDetailsSection.classList.add("product-details-section");

        let companyName=document.createElement("p");
        companyName.innerText=productData.brand;
        companyName.classList.add("company-name");
        productDetailsSection.append(companyName);

        let productName=document.createElement('span');
        productName.innerText=productData.title;
        productName.classList.add('product-name');
        productDetailsSection.append(productName);

        let tagContainer=document.createElement("div");
        tagContainer.classList.add("tag-container");
        productDetailsSection.append(tagContainer);

        for(let i=0;i<productData.tags.length;i++){
            let tagItems=document.createElement("span");
            tagItems.classList.add("tag-items");
            tagItems.innerText='#'+productData.tags[i];
            tagContainer.append(tagItems);
        }

        let description=document.createElement("p");
        description.classList.add("description");
        description.innerText=productData.description;
        productDetailsSection.append(description);

        let ratingBadge=document.createElement("button");
        ratingBadge.innerHTML=`<i class="fa-solid fa-star">&nbsp ${productData.rating}</i> `
        ratingBadge.classList.add('badge', 'rounded-pill', 'text-bg-success','rating-badge');
        productDetailsSection.append(ratingBadge);

        let priceOfferContainer=document.createElement("div");
        priceOfferContainer.classList.add('price-offer-container');
        priceOfferContainer.innerText=`$${productData.price} `;
        let spanOffer=document.createElement("span");
        spanOffer.innerText=`${productData.discountPercentage}% off`
        spanOffer.classList.add('span-offer');
        priceOfferContainer.append(spanOffer);
        productDetailsSection.append(priceOfferContainer);

        let offersDesciption=document.createElement("div");
        offersDesciption.classList.add('offer-description');

        let offerSpell=document.createElement('h5');
        offerSpell.innerText='Available Offers '
        offersDesciption.append(offerSpell);
        let offerItem1=document.createElement('p');
        offerItem1.innerHTML=`<i class="fa-solid fa-certificate"></i> Bank Offer5% Unlimited Cashback on Flipkart Axis Bank Credit CardT&C`;
        offerItem1.classList.add('offer-item');
        offersDesciption.append(offerItem1);
        let offerItem2=document.createElement('p');
        offerItem2.innerHTML=`<i class="fa-solid fa-certificate"></i> Bank Offer10% off up to ₹1,000 on all Axis Bank Credit Card (incl. migrated ones) EMI Txns of ₹7,490 and aboveT&C`;
        offerItem2.classList.add('offer-item');
        offersDesciption.append(offerItem2);
        let offerItem3=document.createElement('p');
        offerItem3.innerHTML=`<i class="fa-solid fa-certificate"></i> Bank Offer10% off on BOBCARD EMI Transactions, up to ₹1,500 on orders of ₹5,000 and aboveT&C`;
        offerItem3.classList.add('offer-item');
        offersDesciption.append(offerItem3);
        let offerItem4=document.createElement('p');
        offerItem4.classList.add('offer-item');
        offerItem4.innerHTML=`<i class="fa-solid fa-certificate"></i> No cost EMI ₹1,450/month. Standard EMI also availableView Plans`;
        offersDesciption.append(offerItem4);
        productDetailsSection.append(offersDesciption);

        let warranty=document.createElement('p');
        warranty.innerHTML=`<span> Warranty: </span>${productData.warrantyInformation}`;
        warranty.classList.add('warranty-policy');
        productDetailsSection.append(warranty);

        let policy=document.createElement('p');
        policy.innerHTML=`<span> Our Policy: </span>${productData.returnPolicy}`;
        policy.classList.add('warranty-policy');
        productDetailsSection.append(policy);

        let shipment=document.createElement('p');
        shipment.innerHTML=`<span> Shipment Details: </span>${productData.shippingInformation}`;
        shipment.classList.add('shipment');
        productDetailsSection.append(shipment);

        // section 2 end os displaying data

    }
        



 }
