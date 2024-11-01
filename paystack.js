  // Chceckout via PAYSTACK
document.getElementById('checkout-button').addEventListener('click', function() {
    // Check if cart has items
    if (cart.items.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Create and show the customer information form
    const hasShoes = cart.items.some(item => item.category === 'shoes');
    
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    `;

    modal.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem;">Delivery Information</h3>
        <form id="customerInfoForm" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="margin-bottom: 1rem;">
                <label for="name" style="display: block; margin-bottom: 0.5rem;">Full Name *</label>
                <input type="text" id="name" required 
                    style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="email" style="display: block; margin-bottom: 0.5rem;">Email Address *</label>
                <input type="email" id="email" required 
                    style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="phone" style="display: block; margin-bottom: 0.5rem;">Phone Number *</label>
                <input type="tel" id="phone" required placeholder="e.g., 0123456789 or +27123456789"
                    style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="address" style="display: block; margin-bottom: 0.5rem;">Delivery Address *</label>
                <textarea id="address" required rows="3" 
                    style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" 
                    style="flex: 1; padding: 0.75rem; background-color: #000; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Proceed to Payment
                </button>
                <button type="button" id="cancelButton"
                    style="padding: 0.75rem; background-color: #e0e0e0; border: none; border-radius: 4px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        </form>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Handle form submission
    const form = document.getElementById('customerInfoForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        // Validate name 
        if (name.length < 2) {
            alert('Please enter a valid full name');
            return;
        }

        // Validate phone number
        const phoneRegex = /^(\+27|0)[1-9][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid South African phone number (e.g., 0123456789 or +27123456789)');
            return;
        }

        // Calculate shipping cost
        const baseShippingRate = 100;
        const shoeShippingRate = 150;
        const shippingCost = hasShoes ? baseShippingRate + shoeShippingRate : baseShippingRate;

        // Calculate total amount including shipping
        const subtotal = cart.getTotal();
        const totalAmount = (subtotal + shippingCost) * 100;

        // Prepare products list
        const productsList = cart.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            category: item.category,
            total: (item.price * item.quantity).toFixed(2)
        }));

        // Initialize Paystack
        const handler = PaystackPop.setup({
            key: 'pk_test_fdab4190558d6df2be1b07d24789e1e184a3e225',
            email: email,
            amount: totalAmount,
            currency: 'ZAR',
            metadata: {
                custom_fields: [
                    {
                        display_name: "Full Name",
                        variable_name: "full_name",
                        value: name
                    },
                    {
                        display_name: "Products",
                        variable_name: "products",
                        value: JSON.stringify(productsList)
                    },
                    {
                        display_name: "Address",
                        variable_name: "address",
                        value: address
                    },
                    {
                        display_name: "Phone",
                        variable_name: "phone",
                        value: phone
                    },
                    {
                        display_name: "Shipping Cost",
                        variable_name: "shipping_cost",
                        value: shippingCost.toString()
                    },
                    {
                        display_name: "Special Handling",
                        variable_name: "special_handling",
                        value: hasShoes ? "Shoes included - Premium shipping" : "Standard shipping"
                    }
                ]
            },
            callback: function(response) {
                const orderSummary = `
                    Order Reference: ${response.reference}
                    Customer: ${name}
                    Subtotal: R${subtotal.toFixed(2)}
                    Shipping: R${shippingCost.toFixed(2)}
                    Total: R${(totalAmount/100).toFixed(2)}
                    
                    Delivery Details:
                    Address: ${address}
                    Phone: ${phone}
                    
                    Special Instructions: ${hasShoes ? 'Premium shipping for shoes included' : 'Standard shipping'}
                `;
                
                alert('Payment successful!\n\n' + orderSummary);
                
                // Clear cart and close modals
                cart.items = [];
                updateCartDisplay();
                toggleCart(event);
                document.body.removeChild(backdrop);
            },
            onClose: function() {
                alert('Transaction was not completed, window closed.');
            }
        });

        // Remove the form modal and open Paystack
        document.body.removeChild(backdrop);
        handler.openIframe();
    });

    // Handle cancel button
    document.getElementById('cancelButton').addEventListener('click', function() {
        document.body.removeChild(backdrop);
    });
});
