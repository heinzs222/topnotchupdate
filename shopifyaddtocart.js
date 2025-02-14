export async function addToCartByProductName(productName, userChoices) {
  try {
    // For testing purposes, we'll bypass the lookup and use a hardcoded variantId:
    const variantId = 47292926427378; // Your known variant ID

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
