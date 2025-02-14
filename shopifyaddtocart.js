export async function addToCartByProductName(productName, userChoices) {
  try {
    // Convert productName to a handle – this should match the handle in your products array.
    const handle = productName.toLowerCase().trim().replace(/\s+/g, "-");

    // Attempt to look up the product in the existing array (beigeProducts)
    let productData;
    if (typeof beigeProducts !== "undefined" && Array.isArray(beigeProducts)) {
      productData = beigeProducts.find((product) => product.handle === handle);
    }

    // If not found in the array, fall back to fetching from Shopify
    if (!productData) {
      const productResponse = await fetch(`/products/${handle}.js`);
      if (!productResponse.ok) {
        throw new Error(`Product not found for handle: ${handle}`);
      }
      productData = await productResponse.json();
    }

    // Use the first variant's ID.
    // Note: In your Liquid data the variant ID might be stored as 'variant_id' (or 'id').
    const variantId =
      productData.variants[0].variant_id || productData.variants[0].id;

    // Create custom properties from userChoices
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
