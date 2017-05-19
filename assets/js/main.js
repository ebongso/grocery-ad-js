'use strict'

let item = ({ x_large_image_url, discount_percent, current_price, sale_story, brand, name, description }) => 
  ` 
  <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 text-center">
    <div class="card">
      <div class="card-image" style="background-image: url('${x_large_image_url}')">
        <p class="card-label-top-left">
          <b style="color: #FFFFFF;">${discount_percent}% OFF</b>
        </p>
        <p class="card-label-bottom-right"><b><i>$${Number(current_price).toFixed(2)}</i></b></p>
      </div>
      <div class="card-description">
        <small>${sale_story.split(',')[0]}</small>
        <p><b>${brand.substr(0, 30)}<br />${name.substr(0, 60)}</b></p>
        <small>${description.substr(0, 35)}</small>
      </div>
    </div>
  </div>
  `;

let req = new XMLHttpRequest();
req.onreadystatechange = () => {
  if(req.readyState == 4 && req.status == 200) {
    var items = JSON.parse(req.responseText);
    document.getElementById('grocery-items').innerHTML = items.map(item).join('');
  }
};
req.open('GET', '/api/items', true);
req.send();