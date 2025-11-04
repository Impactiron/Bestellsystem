const apiBaseUrl = '/api/orders';

document.addEventListener('DOMContentLoaded', async () => {
    const locationSelect = document.getElementById('location');
    const productListDiv = document.getElementById('product-list');
    const submitBtn = document.getElementById('submit-order');

    // Holt Produkte dynamisch
    const products = await fetch('products.json').then(r => r.json());

    function renderProducts(products) {
        productListDiv.innerHTML = '';
        products.forEach(product => {
            productListDiv.innerHTML += `
              <div class="product-entry">
                <img src="${product.image}" alt="${product.product_name}" />
                <div class="product-details">
                  <div><strong>${product.product_name}</strong></div>
                  <div>${product.description}</div>
                  <div>Verpackung: ${product.packaging}</div>
                </div>
                <input class="product-quantity" type="number" min="0" data-product-id="${product.product_id}" placeholder="Menge" />
              </div>
            `;
        });
    }

    renderProducts(products);

    submitBtn.addEventListener('click', async () => {
        const location_id = locationSelect.value;
        const location_name = locationSelect.options[locationSelect.selectedIndex].text;
        const items = [];
        document.querySelectorAll('.product-quantity').forEach(input => {
            const qty = parseInt(input.value, 10) || 0;
            if(qty > 0) {
                items.push({
                    product_id: input.dataset.productId,
                    quantity: qty
                });
            }
        });

        if(items.length === 0) {
            alert('Bitte mindestens ein Produkt auswählen!');
            return;
        }

        const order = {
            location_id,
            location_name,
            created_by: 'Mitarbeiter',
            items
        };

        const res = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if(res.ok) {
            alert('Bestellung eingereicht!');
            document.querySelectorAll('.product-quantity').forEach(input => input.value = '');
        } else {
            alert('Fehler beim Einreichen der Bestellung');
        }
    });
});