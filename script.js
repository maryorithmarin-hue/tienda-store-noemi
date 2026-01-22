const sheetURL = "https://docs.google.com/spreadsheets/d/1l3IuIq2WPCMI-72WcfwIX-7DDLGqYUWfSTEA2V6q7vA/export?format=csv&gid=0";

const container = document.getElementById("container");

const catBtns = document.querySelectorAll(".cat-btn");

const searchBox = document.getElementById("searchBox");

const closeSearch = document.getElementById("closeSearch");

let products = [];

function csvToJson(csv) {

  const lines = csv.split("\n");

  const headers = lines[0].split(",");

  const result = [];

  for (let i = 1; i < lines.length; i++) {

    const obj = {};

    const currentline = lines[i].split(",");

    if (currentline.length === headers.length) {

      for (let j = 0; j < headers.length; j++) {

        obj[headers[j].trim()] = currentline[j].trim();

      }

      result.push(obj);

    }

  }

  return result;

}

async function loadProducts() {

  const res = await fetch(sheetURL);

  const csv = await res.text();

  products = csvToJson(csv);

  showProducts(products);

}

function showProducts(list) {

  container.innerHTML = "";

  if (list.length === 0) {

    container.innerHTML = `<p>No hay productos disponibles</p>`;

    return;

  }

  list.forEach(product => {

    const card = document.createElement("div");

    card.className = "card";

    card.dataset.category = product.categoria;

    card.innerHTML = `

      <img class="product-img" src="${product.imagen}" alt="${product.producto}">

      <h3>${product.producto}</h3>

      <div class="price">${product.precio}</div>

      <button class="open-modal" data-img="${product.imagen}" data-price="${product.precio}" data-name="${product.producto}">

        Ver

      </button>

      <!-- ESTADO -->

      <div class="estado">${product.estado}</div>

      <!-- SOLO SI ESTÁ AGOTADO -->

      ${product.estado.toLowerCase() === "agotado" ? `

        <button class="solicitar-btn" data-name="${product.producto}">

          Solicitar más de este producto

        </button>

      ` : ""}

    `;

    container.appendChild(card);

  });

  document.querySelectorAll(".open-modal").forEach(btn => {

    btn.addEventListener("click", function() {

      const img = this.dataset.img;

      const price = this.dataset.price;

      const name = this.dataset.name;

      document.getElementById("modal").style.display = "flex";

      document.getElementById("modal-img").src = img;

      document.getElementById("modal-price").innerText = `${name} - ${price}`;

      const msg = encodeURIComponent(`Hola, quiero comprar: ${name} - ${price}`);

      document.getElementById("whatsappBtn").href = `https://wa.me/50584908088?text=${msg}`;

    });

  });

  document.querySelectorAll(".solicitar-btn").forEach(btn => {

    btn.addEventListener("click", function() {

      const name = this.dataset.name;

      const msg = encodeURIComponent(`Hola, quería solicitar más de este producto: ${name}`);

      window.open(`https://wa.me/50584908088?text=${msg}`, "_blank");

    });

  });

}

catBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    const cat = btn.dataset.cat;

    if (cat === "todos") {

      showProducts(products);

      return;

    }

    const filtered = products.filter(p => p.categoria.toLowerCase() === cat.toLowerCase());

    if (filtered.length === 0) {

      alert("Producto no existente en el inventario");

      showProducts(products);

      return;

    }

    showProducts(filtered);

  });

});

closeSearch.addEventListener("click", () => {

  searchBox.style.display = "none";

  showProducts(products);

});

loadProducts();
