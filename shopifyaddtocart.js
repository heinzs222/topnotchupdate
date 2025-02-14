// shopifyaddtocart.js

/**
 * Given a product name and userChoices, this function attempts to convert the product name
 * into a Shopify product handle, fetches the product data, and then adds the first variant
 * to the cart with the custom properties.
 *
 * Note: This assumes your product names map directly to your product handles (all lowercase,
 * spaces replaced with dashes, etc.). If not, you’ll need to adjust the logic.
 */
export async function addToCartByProductName(productName, userChoices) {
  try {
    // Convert the product name to a handle (adjust as needed)
    const handle = productName.toLowerCase().trim().replace(/\s+/g, "-");

    // Fetch the product JSON from Shopify
    const productResponse = await fetch(`/products/${handle}.js`);
    if (!productResponse.ok) {
      throw new Error(`Product not found for handle: ${handle}`);
    }
    const productData = await productResponse.json();

    // For simplicity, choose the first variant (you may choose differently if needed)
    const variantId = productData.variants[0].id;

    // Create custom properties from userChoices.
    const properties = {
      Texture: userChoices.texture,
      "Jacket Design": JSON.stringify(userChoices.design.jacket),
      "Pants Design": JSON.stringify(userChoices.design.pants),
      Embroidery: JSON.stringify(userChoices.embroidery),
      Measurements: JSON.stringify(userChoices.measurements),
    };

    const data = {
      items: [
        {
          id: variantId,
          quantity: 1,
          properties: properties,
        },
      ],
    };

    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error adding to cart");
    }

    const cart = await response.json();
    console.log("Item added to cart:", cart);
    return cart;
  } catch (error) {
    console.error("Error adding to cart by product name:", error);
  }
}
