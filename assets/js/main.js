'use strict'

let req = new XMLHttpRequest();
req.onreadystatechange = () => {
  //if(req.readyState == 4 && req.status == 200) document.getElementById('data').innerHTML = req.responseText;
};
req.open('GET', '/api/items', true);
req.send();