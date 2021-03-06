'use strict';

let goitem = ({ x_large_image_url, discount_percent, current_price, sale_story, brand, name, description }) => 
  ` 
  <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 text-center">
    <div class="card">
      <div class="card-image" style="background-image: url('${x_large_image_url}')">
        <p class="card-label-top-left ${discount_percent ? '' : 'hidden' }">
          <b style="color: #FFFFFF;">${discount_percent}% OFF</b>
        </p>
        <p class="card-label-bottom-right"><b><i>${current_price ? Number(current_price).toFixed(2) : '' }</i></b></p>
      </div>
      <div class="card-description">
        <small>${sale_story ? sale_story.split('.')[0] : '' }</small>
        <p><b>${brand ? brand.substr(0, 30) : ''}<br />${name ? name.substr(0, 60) : ''}</b></p>
        <small>${description ? description.substr(0, 35) : ''}</small>
      </div>
    </div>
  </div>
  `;

let luckyitem = ({ ImageUrl, Price, ProductName, ProductDescription }) => 
  ` 
  <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 text-center">
    <div class="card">
      <div class="card-image" style="background-image: url('${ImageUrl}')">
        <p class="card-label-top-left ${(Price.split('<br>').length > 1 && Price.split('<br>')[1] !== 'of equal or' && Price.split('<br>')[1].indexOf('Buy') < 0) ? '' : 'hidden'}">
          <b style="color: #FFFFFF;">${Price.indexOf('Buy') >= 0 ? Price.split('<br>').join(' ') : Price.split('<br>')[1] + ' ' + (Price.split('<br>')[2] ? Price.split('<br>')[2] : '')}</b>
        </p>
        <p class="card-label-bottom-right ${(Price.split('<br>')[0].indexOf('Buy') >= 0) ? 'hidden' : ''}"><b><i>${Price.split('<br>')[0].substr(0, 12)}</i></b></p>
      </div>
      <div class="card-description">
        <p><b>${ProductName ? ProductName.substr(0, 60) : ''}</b></p>
        <small>${ProductDescription ? ProductDescription.substr(0, 70) : ''}</small>
      </div>
    </div>
  </div>
  `;

//Make request to get more items
let makeAdRequest = (storeName, page, firstPageLoad) => {
  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if(req.readyState == 0) {
      document.getElementById('grocery-items').innerHTML = 
        '<p class="text-center"><img alt="loading" src="/images/loading.gif" /></p>';
    }
    if(req.readyState == 4 && req.status == 200) {
      let json = JSON.parse(req.responseText);
      document.getElementById('grocery-items').innerHTML = json.items.map(storeName === 'lucky' ? luckyitem : goitem).join('');
      if(firstPageLoad) createPaging(json.totalPages, storeName, page);
    }
  };
  req.open('GET', '/api/items?store=' + storeName + '&page=' + page, true);
  req.send();
};

//Create paging container
let createPaging = (totalPages, storeName, currentPage) => {
  let pagingTop = document.getElementById('pagingTop');
  let pagingBottom = document.getElementById('pagingBottom');

  let paging = '';
  if(totalPages > 1) {
    for(let i = 1; i <= totalPages; i++) {
      paging += '<span class="paging' + (i == currentPage ? ' paging-active' : '' ) + 
        '" data-store="' + storeName + '" data-page="' + i + '">' + i + '</span>';
    }
  }
  pagingTop.innerHTML = paging;
  pagingBottom.innerHTML = paging;
    
  let pages = document.getElementsByClassName('paging');
  if(pages && pages.length) {
    let pagingClickEvent = (e) => {
      let pagingLi = e.target;
      if(pagingLi && pagingLi.getAttribute('class') === 'paging') {
        Array.from(pages).forEach((elem) => {
          if(elem.innerHTML == pagingLi.getAttribute('data-page')) elem.setAttribute('class', 'paging paging-active');
          else elem.setAttribute('class', 'paging');
        });
        
        makeAdRequest(pagingLi.getAttribute('data-store'), pagingLi.getAttribute('data-page'), false);
      }
    }

    pagingTop.addEventListener('click', pagingClickEvent);
    pagingBottom.addEventListener('click', pagingClickEvent);
  }
};

//Load items by store with paging
let loadItems = (() => {
  const url = window.location.href;
  const splitUrl = url.split('?');
  let storeName = '';
  let page = '';
  if(splitUrl.length > 1) {
    let splitQuery = splitUrl[1].split('&');
    for(let q of splitQuery) {
      let splitQ = q.split('=');
      if(splitQ[0] === 'store') storeName = splitQ[1];
      else if(splitQ[0] === 'page') page = splitQ[1];
    }
  }
  page = page === '' ? '1' : page;

  //Make sure the store dropdown is selected
  let storeSelect = document.getElementById('storeSelect');
  for(let i, j = 0; i = storeSelect.options[j]; j++) {
    if(i.value === storeName) {
      storeSelect.selectedIndex = j;
    }
  }
  makeAdRequest(storeName, page, true);

  //Reload the page when the store selection changes
  storeSelect.addEventListener('change', (e) => {
    makeAdRequest(e.target.value, '1', true);
  });
})();