document.getElementById('checkout-button').addEventListener('click', function() {
    const email = prompt("Please enter your email for the receipt:"); // Get email from the user
    if (!email) {
        alert('Email is required to proceed with the payment.');
        return;
    }

    const address = prompt("Please enter your street address:"); // New address prompt
    if (!address) {
        alert('Street address is required to proceed with the payment.');
        return;
    }

    const totalAmount = cart.getTotal() * 100;

    const productsList = cart.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: (item.price * item.quantity).toFixed(2)
    }));

    const handler = PaystackPop.setup({
        key: 'pk_test_fdab4190558d6df2be1b07d24789e1e184a3e225', // Replace with your Paystack public key
        email: email,
        amount: totalAmount, // Amount in rands
        currency: 'ZAR', // Currency
        metadata: {
            custom_fields: [
                {
                    display_name: "Products",
                    variable_name: "products",
                    value: JSON.stringify(productsList) // Optional: Include product details
                },
                {
                    display_name: "Address",
                    variable_name: "address",
                    value: address // Include the address in metadata
                }
            ]
        },
        callback: function(response) {
            alert('Payment successful! Reference: ' + response.reference);
            // Optionally clear the cart or redirect
            cart.items = [];
            updateCartDisplay();
            toggleCart(event);
        },
        onClose: function() {
            alert('Transaction was not completed, window closed.');
        }
    });
    handler.openIframe();
});
