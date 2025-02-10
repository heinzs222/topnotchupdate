function generatePartItems(parts) {
  return parts
    .map((part) => {
      if (part.partName === "Pockets") {
        const topPockets = part.options.filter((meshName) =>
          ["4on2_pocket_4", "4on2_pocket_5", "4on2_pocket_6"].includes(meshName)
        );
        const bottomPockets = part.options.filter((meshName) =>
          [
            "4on2_pocket_1",
            "4on2_pocket_2",
            "4on2_pocket_3",
            "4on2_pocket_7",
            "4on2_pocket_8",
          ].includes(meshName)
        );

        return `
          <div class="part-item" data-part="${part.partName}">
            ${part.partName}
            <div class="part-options">
              <!-- Top Pockets Section -->
              <div class="sub-part top-pockets">
                <h4>Top Pockets</h4>
                ${topPockets
                  .map(
                    (meshName, index) =>
                      `<button class="part-option" data-part-name="Pockets" data-mesh-name="${meshName}">
                        Pockets Option ${index + 1}
                      </button>`
                  )
                  .join("")}
              </div>
              <!-- Bottom Pockets Section -->
              <div class="sub-part bottom-pockets">
                <h4>Bottom Pockets</h4>
                ${bottomPockets
                  .map(
                    (meshName, index) =>
                      `<button class="part-option" data-part-name="Pockets" data-mesh-name="${meshName}">
                        Pockets Option ${index + 1}
                      </button>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `;
      } else if (part.options && part.options.length > 1) {
        return `
          <div class="part-item" data-part="${part.partName}">
            ${part.partName}
            <div class="part-options">
              ${part.options
                .map(
                  (optionMeshName, index) =>
                    `<button class="part-option" data-part-name="${
                      part.partName
                    }" data-mesh-name="${optionMeshName}">
                      ${part.partName} Option ${index + 1}
                    </button>`
                )
                .join("")}
            </div>
          </div>
        `;
      } else {
        return `<div class="part-item" data-part="${part.partName}">${part.partName}</div>`;
      }
    })
    .join("");
}

function initializeTextureButtons() {
  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  const cardsWrapper = document.createElement("div");
  const cardsWrapperContainer = document.createElement("div");
  cardsWrapper.className = "cards-wrapper";
  cardsWrapperContainer.className = "cards-wrapper-container";

  const category1Items = textures["1"];

  Object.keys(textures).forEach((categoryId, index) => {
    const categoryItems = category1Items;
    const categoryCard = createCategoryCard(categoryId, categoryItems, index);
    cardsWrapper.appendChild(categoryCard);
  });

  textureContainer.appendChild(cardsWrapperContainer);
  textureContainer.appendChild(cardsWrapper);
  initializeCardsSlider();

  if (userChoices.texture) {
    const selectedItem = userChoices.texture.replace(".png", "");
    const selectedImage = textureContainer.querySelector(
      `img[alt="${selectedItem}"]`
    );
    if (selectedImage) {
      selectedImage.classList.add("selected");
    }
  } else if (category1Items.length > 0) {
    const firstFabricItem = category1Items[0];
    const firstCategoryCard = textureContainer.querySelector(
      ".card_cardContainer"
    );

    if (firstCategoryCard) {
      const firstImage = firstCategoryCard.querySelector(".card_cardImage");
      if (firstImage) {
        firstImage.classList.add("selected");

        const categoryId = Object.keys(textures)[0];
        selectFabric(categoryId, firstFabricItem, firstCategoryCard);
      }
    }
  }
}

function createCategoryCard(categoryId, categoryItems, index) {
  const cardContainer = document.createElement("div");
  cardContainer.className = "card_cardContainer";
  cardContainer.dataset.testId = categoryId;
  cardContainer.tabIndex = index + 1;

  const imageContainer = document.createElement("div");
  imageContainer.className = "card_cardImageContainer";

  const imagesToShow = textures["1"].slice(0, 4);
  imagesToShow.forEach((item) => {
    const img = document.createElement("img");
    img.className = "card_cardImage";
    img.loading = "lazy";
    img.src = `./batch1/${item}.png`;
    img.alt = item;
    imageContainer.appendChild(img);
  });

  const itemAmountContainer = document.createElement("div");
  itemAmountContainer.className = "card_itemAmountContainer";
  itemAmountContainer.dataset.testId = "item-amount";
  itemAmountContainer.textContent = textures["1"].length;
  imageContainer.appendChild(itemAmountContainer);

  const cardDetails = document.createElement("div");
  cardDetails.className = "card_cardDetails";

  const cardText = document.createElement("p");
  cardText.className = "card_cardText";
  cardText.dataset.testId = "card-text";
  cardText.textContent = `Category ${categoryId}`;

  cardDetails.appendChild(cardText);

  const arrowIcon = document.createElement("div");
  arrowIcon.className = "card_arrowIcon";
  arrowIcon.innerHTML = `<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" viewBox="0 0 330 330" xml:space="preserve">
    <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
       c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213  
       C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
       l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
       C255,161.018,253.42,157.202,250.606,154.389z"/>
  </svg>`;

  cardContainer.appendChild(imageContainer);
  cardContainer.appendChild(cardDetails);
  cardContainer.appendChild(arrowIcon);

  cardContainer.addEventListener("click", () => {
    showCategoryItems(categoryId);
  });

  return cardContainer;
}

function createFabricCard(categoryId, item, index) {
  const cardContainer = document.createElement("div");
  cardContainer.className = "card_cardContainer card_small";
  cardContainer.dataset.testId = index;
  cardContainer.tabIndex = index + 1;

  const imageContainer = document.createElement("div");
  imageContainer.className = "card_cardImageContainer";

  const img = document.createElement("img");
  img.className = "card_cardImage";
  img.loading = "lazy";
  img.src = `./batch1/${item}.png`;
  img.alt = item;
  imageContainer.appendChild(img);

  const infoSpaceContainer = document.createElement("div");
  infoSpaceContainer.className = "card_infoSpaceContainer card_dark";
  infoSpaceContainer.dataset.testId = "info-btn";
  infoSpaceContainer.innerHTML =
    '<p class="susu-pcons" translate="no">info</p>';

  imageContainer.appendChild(infoSpaceContainer);

  const cardDetails = document.createElement("div");
  cardDetails.className = "card_cardDetails card_hideMobileInfoText";

  const cardText = document.createElement("div");
  cardText.className = "card_cardText";
  cardText.dataset.testId = "card-text";
  cardText.textContent = getFabricName(item);

  const cardSubText = document.createElement("div");
  cardSubText.className = "card_cardSubText";
  cardSubText.dataset.testId = "card-subtext";
  cardSubText.textContent = "$0.00";

  cardDetails.appendChild(cardText);
  cardDetails.appendChild(cardSubText);

  cardContainer.appendChild(imageContainer);
  cardContainer.appendChild(cardDetails);

  cardContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    selectFabric(categoryId, item, cardContainer);
  });

  return cardContainer;
}

function getFabricName(filename) {
  return filename.replace(/_/g, " ").replace(".png", "");
}

function selectFabric(categoryId, item, cardElement) {
  document.querySelectorAll(".card_cardImage.selected").forEach((img) => {
    img.classList.remove("selected");
  });

  const img = cardElement.querySelector(".card_cardImage");
  if (img) {
    img.classList.add("selected");
  }

  const textureUrl = `./batch1/${item}.png`;
  applyTexture(textureUrl);

  userChoices.texture = `${item}.png`;
}

function showCategoryItems(categoryId) {
  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.classList.add("back-to-cat");
  confirmButton.addEventListener("click", () => {
    initializeTextureButtons();
  });
  textureContainer.appendChild(confirmButton);

  const category1Items = textures["1"];

  const cardsWrapper = document.createElement("div");
  cardsWrapper.className = "cards-wrapper";

  category1Items.forEach((item, index) => {
    const fabricCard = createFabricCard(categoryId, item, index);
    cardsWrapper.appendChild(fabricCard);
  });

  textureContainer.appendChild(cardsWrapper);

  initializeCardsSlider();

  if (userChoices.texture) {
    const selectedItem = userChoices.texture.replace(".png", "");
    const selectedImage = textureContainer.querySelector(
      `img[alt="${selectedItem}"]`
    );
    if (selectedImage) {
      selectedImage.classList.add("selected");
    }
  } else if (category1Items.length > 0) {
    const firstFabricItem = category1Items[0];
    const firstCategoryCard = textureContainer.querySelector(
      ".card_cardContainer"
    );

    if (firstCategoryCard) {
      const firstImage = firstCategoryCard.querySelector(".card_cardImage");
      if (firstImage) {
        firstImage.classList.add("selected");

        const categoryId = Object.keys(textures)[0];
        selectFabric(categoryId, firstFabricItem, firstCategoryCard);
      }
    }
  }
}

function applyTexture(url) {
  if (!material) return;
  if (material.diffuseTexture && material.diffuseTexture.name === url) {
    return;
  }
  const texture = new BABYLON.Texture(
    url,
    scene,
    false,
    true,
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
    () => {
      console.log(`Texture loaded: ${url}`);
    },
    (message, exception) => {
      console.error(`Failed to load texture: ${url}`, message, exception);
    }
  );
  texture.uScale = 5.0;
  texture.vScale = 5.0;
  material.diffuseTexture = texture;
  material.diffuseTexture.name = url;
  material.backFaceCulling = false;
  material.specularColor = new BABYLON.Color3(0, 0, 0);
  material.ambientColor = new BABYLON.Color3(1, 1, 1);
}

function showMobileCutOptions() {
  console.log("[showMobileCutOptions] Displaying cut options...");

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm Cut Choice";
  confirmButton.classList.add("back-to-cat");
  confirmButton.addEventListener("click", () => {
    console.log("[showMobileCutOptions] Confirm clicked => returning");
    showPantsDesignOptions();
  });
  textureContainer.appendChild(confirmButton);

  const cutOptions = [
    {
      src: "./assets/pants/cut/cut1.png",
      label: "Extra Slim",
      meshName: "cut1_mesh",
    },
    {
      src: "./assets/pants/cut/cut2.png",
      label: "Slim",
      meshName: "cut2_mesh",
    },
    {
      src: "./assets/pants/cut/cut3.png",
      label: "Straight",
      meshName: "cut3_mesh",
    },
    {
      src: "./assets/pants/cut/cut4.png",
      label: "Classic",
      meshName: "cut4_mesh",
    },
    {
      src: "./assets/pants/cut/cut5.png",
      label: "Relaxed Fit",
      meshName: "cut5_mesh",
    },
    {
      src: "./assets/pants/cut/cut6.png",
      label: "Tapered Leg",
      meshName: "cut6_mesh",
    },
    {
      src: "./assets/pants/cut/cut7.png",
      label: "Flat Front",
      meshName: "cut7_mesh",
    },
    {
      src: "./assets/pants/cut/cut8.png",
      label: "Pleated Front",
      meshName: "cut8_mesh",
    },
    {
      src: "./assets/pants/cut/cut9.png",
      label: "High waist",
      meshName: "cut9_mesh",
    },
    {
      src: "./assets/pants/cut/cut10.png",
      label: "Low rise",
      meshName: "cut10_mesh",
    },
  ];

  const mobileCutSlider = document.createElement("div");
  mobileCutSlider.id = "mobileCutSlider";
  mobileCutSlider.classList.add("slider-container");

  const cardsWrapper = document.createElement("div");
  cardsWrapper.classList.add("cards-wrapper");
  mobileCutSlider.appendChild(cardsWrapper);

  cutOptions.forEach((item) => {
    const cutCard = document.createElement("div");
    cutCard.classList.add("card_cardContainer", "part-option");
    cutCard.setAttribute("data-part-name", "Cut");
    cutCard.setAttribute("data-mesh-name", item.meshName);
    cutCard.tabIndex = 0;
    cutCard.style.touchAction = "pan-y";
    cutCard.style.cursor = "pointer";

    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("img-wrapper");
    imgWrapper.style.touchAction = "pan-y";

    const imgEl = document.createElement("img");
    imgEl.src = item.src;
    imgEl.alt = item.label;
    imgEl.style.touchAction = "pan-y";
    imgEl.style.width = "62px";
    imgEl.style.height = "auto";

    imgWrapper.appendChild(imgEl);

    const pEl = document.createElement("p");
    pEl.textContent = item.label;
    pEl.style.touchAction = "pan-y";

    cutCard.appendChild(imgWrapper);
    cutCard.appendChild(pEl);

    cutCard.addEventListener("click", () => {
      console.log("[showMobileCutOptions] Chosen cut:", item.label);

      cardsWrapper.querySelectorAll(".part-option").forEach((p) => {
        p.classList.remove("selected");
      });

      cutCard.classList.add("selected");

      userChoices.design.pants.cut = item.meshName;

      switchPartMesh("Cut", item.meshName);
    });

    cardsWrapper.appendChild(cutCard);
  });

  textureContainer.appendChild(mobileCutSlider);

  setupMobileSlider("#mobileCutSlider");
}

function setupAccordions() {
  if (isAccordionSetup) return;
  isAccordionSetup = true;

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.addEventListener("click", accordionClickHandler);
}

function accordionClickHandler(e) {
  const acc = e.target.closest(".accordion");
  const subAcc = e.target.closest(".sub_accordion");

  if (acc) {
    console.log("[accordionClickHandler] Top-level accordion clicked:", acc);
    acc.classList.toggle("active");

    const span = acc.querySelector(".sign-acc");
    const panel = acc.nextElementSibling;

    if (panel.style.maxHeight && panel.style.maxHeight !== "0px") {
      panel.style.maxHeight = "0px";
      span.innerHTML = "+";
      console.log("[accordionClickHandler] Collapsing panel");
    } else {
      panel.style.maxHeight = 300 + "px";
      span.innerHTML = "-";
      console.log(
        "[accordionClickHandler] Expanding panel to:",
        panel.style.maxHeight
      );
    }

    document.querySelectorAll(".accordion").forEach((otherAcc) => {
      if (otherAcc !== acc && otherAcc.classList.contains("active")) {
        otherAcc.classList.remove("active");
        const otherSpan = otherAcc.querySelector(".sign-acc");
        const otherPanel = otherAcc.nextElementSibling;
        if (otherPanel) {
          otherPanel.style.maxHeight = "0px";
          otherSpan.innerHTML = "+";
          console.log(
            `[accordionClickHandler] Closing other accordion: ${otherAcc.getAttribute(
              "data-category"
            )}`
          );
        }
      }
    });

    highlightLayer.removeAllMeshes();

    const category = acc.getAttribute("data-category");
    console.log("[accordionClickHandler] Category is:", category);

    if (category === "jacket") {
      console.log("[accordionClickHandler] Loading Jacket options...");
      loadJacketBasedOnUserChoices();
    } else if (category === "pants") {
      console.log("[accordionClickHandler] Loading Pants options...");
      loadPantsDesignOptions();
    } else if (category === "vest") {
      console.log(
        "[accordionClickHandler] Vest option clicked. (Example only)"
      );
      jacketMeshes.forEach((m) => m.setEnabled(false));
      pantsMeshes.forEach((m) => m.setEnabled(false));
      highlightLayer.removeAllMeshes();
      resetCamera();
    } else {
      console.log("[accordionClickHandler] Show all (fallback case).");
      jacketMeshes.forEach((m) => m.setEnabled(true));
      pantsMeshes.forEach((m) => m.setEnabled(true));
      Object.keys(partOptionsMeshes).forEach((partName) => {
        Object.keys(partOptionsMeshes[partName]).forEach((meshName) => {
          const mesh = partOptionsMeshes[partName][meshName];
          if (mesh) mesh.setEnabled(true);
        });
      });
      highlightLayer.removeAllMeshes();
      zoomToMeshes([...jacketMeshes, ...pantsMeshes]);
      resetCamera();
    }
  } else if (subAcc) {
    console.log("[accordionClickHandler] Sub-accordion clicked:", subAcc);
    subAcc.classList.toggle("active");

    const span = subAcc.querySelector(".sign-acc");
    const subPanel = subAcc.nextElementSibling;

    if (subPanel.style.maxHeight && subPanel.style.maxHeight !== "0px") {
      subPanel.style.maxHeight = "0px";
      span.innerHTML = "+";
      console.log("[accordionClickHandler] Collapsing sub-panel");
    } else {
      subPanel.style.maxHeight = subPanel.scrollHeight + "px";
      span.innerHTML = "-";
      console.log(
        "[accordionClickHandler] Expanding sub-panel to:",
        subPanel.style.maxHeight
      );
    }

    const subCategory = subAcc.getAttribute("data-category");
    console.log("[accordionClickHandler] Sub-category is:", subCategory);

    if (
      subCategory === "cut" &&
      window.matchMedia("(max-width: 1024.9px)").matches
    ) {
      console.log(
        "[accordionClickHandler] 'Cut' was clicked on MOBILE -> Show mobile cut function"
      );
      showMobileCutOptions();
    }
  }
}

function loadJacketBasedOnUserChoices(lockCamera = true) {
  Object.keys(partOptionsMeshes).forEach((partName) => {
    const selectedMeshName = userChoices.design.jacket[partName];
    if (selectedMeshName) {
      Object.keys(partOptionsMeshes[partName]).forEach((meshName) => {
        const mesh = partOptionsMeshes[partName][meshName];
        if (mesh) {
          if (meshName === selectedMeshName) {
            mesh.setEnabled(true);
            currentPartMeshes[partName] = mesh;
            highlightLayer.addMesh(mesh, BABYLON.Color3.White());
          } else {
            mesh.setEnabled(false);
          }
        }
      });
    }
  });

  zoomToMeshes(jacketMeshes, 0.2);

  if (userChoices.embroidery.jacket.length > 0 && step !== 4) {
    rotateModelTo(initialRotationY, () => {
      console.log("Jacket section selected.");
      currentOrientation = "front";
    });
  } else {
    parentNode.rotation.y = initialRotationY;
    currentRotationY = initialRotationY;
    currentOrientation = "front";
    console.log(
      "No embroidery selected or initializing Step 4. Orientation set to Front."
    );
  }

  enableCameraControls();
}

function setupPartSelection() {
  if (isPartSelectionSetup) return;
  isPartSelectionSetup = true;

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.addEventListener("click", partSelectionHandler);
}

function partSelectionHandler(e) {
  const partOptionButton = e.target.closest(".part-option");

  if (partOptionButton) {
    const partName = partOptionButton.getAttribute("data-part-name");
    const meshName = partOptionButton.getAttribute("data-mesh-name");

    if (!partName || !meshName) {
      console.warn("Missing data-part-name or data-mesh-name attributes.");
      return;
    }

    switchPartMesh(partName, meshName);

    document
      .querySelectorAll(`.part-option[data-part-name="${partName}"]`)
      .forEach((btn) => btn.classList.remove("selected"));
    partOptionButton.classList.add("selected");

    if (["Back", "Lapels", "Pockets"].includes(partName)) {
      const jacketAcc = document.querySelector(
        `.accordion[data-category="jacket"]`
      );
      if (jacketAcc && !jacketAcc.classList.contains("active")) {
        jacketAcc.click();
      } else {
        loadJacketBasedOnUserChoices();
      }
    }

    return;
  }

  const partItem = e.target.closest(".part-item");

  if (partItem) {
    const partName = partItem.getAttribute("data-part");

    if (!partName) {
      console.warn("Missing data-part attribute on part-item.");
      return;
    }

    const mesh = currentPartMeshes[partName];

    if (mesh) {
      highlightLayer.removeAllMeshes();

      highlightLayer.addMesh(mesh, BABYLON.Color3.White());

      document
        .querySelectorAll(".part-item")
        .forEach((item) => item.classList.remove("selected"));
      partItem.classList.add("selected");

      zoomToMesh(mesh);

      handlePartSelection(partName, mesh.name);
    }

    document
      .querySelectorAll(`.part-option[data-part-name="${partName}"]`)
      .forEach((btn) => btn.classList.remove("selected"));
    partItem.classList.add("selected");
  }
}

function switchPartMesh(partName, meshName) {
  if (!partOptionsMeshes[partName]) {
    console.warn(`Part "${partName}" does not exist.`);
    return;
  }

  Object.keys(partOptionsMeshes[partName]).forEach((name) => {
    const mesh = partOptionsMeshes[partName][name];
    if (mesh) {
      mesh.setEnabled(false);
    }
  });

  const selectedMesh = partOptionsMeshes[partName][meshName];
  if (selectedMesh) {
    selectedMesh.setEnabled(true);
    currentPartMeshes[partName] = selectedMesh;

    userChoices.design.jacket[partName] = meshName;

    highlightLayer.removeAllMeshes();
    highlightLayer.addMesh(selectedMesh, BABYLON.Color3.White());

    zoomToMesh(selectedMesh);

    if (
      meshName === "4on2_Back_1" ||
      meshName === "4on2_Back_2" ||
      meshName === "4on2_Back_3"
    ) {
      rotateModelTo(initialRotationY + Math.PI, () => {
        console.log("Model rotated to Back view");
        currentOrientation = "back";
      });
    } else {
      rotateModelTo(initialRotationY, () => {
        console.log("Model rotated to Front view");
        currentOrientation = "front";
      });
    }
  } else {
    console.warn(`Mesh "${meshName}" not found in part "${partName}".`);
  }
}

function setupPantsItemSelection() {
  if (isPantsItemSelectionSetup) return;
  isPantsItemSelectionSetup = true;

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.addEventListener("click", pantsItemSelectionHandler);
}

function pantsItemSelectionHandler(e) {}

function setupEmbroideryChoiceListener() {
  if (isEmbroideryChoiceListenerSetup) return;
  isEmbroideryChoiceListenerSetup = true;

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.addEventListener("click", embroideryChoiceHandler);
}

function embroideryChoiceHandler(event) {
  const target = event.target;
  const jacketChoice = target.closest(".jacket-embroidery-choice");

  if (jacketChoice) {
    const selectedLocation = jacketChoice.querySelector("p").innerText.trim();

    if (selectedLocation === "No Embroidery") {
      userChoices.embroidery.jacket = [];
      document
        .querySelectorAll(".jacket-embroidery-choice")
        .forEach((choice) => choice.classList.remove("selected"));
      jacketChoice.classList.add("selected");
    } else {
      const index = userChoices.embroidery.jacket.findIndex(
        (emb) => emb.location === selectedLocation
      );
      if (index === -1) {
        userChoices.embroidery.jacket.push({
          location: selectedLocation,
          text: "",
          color: null,
        });
        jacketChoice.classList.add("selected");
      } else {
        userChoices.embroidery.jacket.splice(index, 1);
        jacketChoice.classList.remove("selected");
      }

      if (userChoices.embroidery.jacket.length > 0) {
        const noEmbroideryChoice = document.querySelector(
          ".jacket-embroidery-choice.no-embroidery"
        );
        if (noEmbroideryChoice) {
          noEmbroideryChoice.classList.remove("selected");
        }
      } else {
        const noEmbroideryChoice = document.querySelector(
          ".jacket-embroidery-choice.no-embroidery"
        );
        if (noEmbroideryChoice) {
          noEmbroideryChoice.classList.add("selected");
        }
      }
    }

    userChoices.embroidery.hasEmbroidery =
      userChoices.embroidery.jacket.length > 0;
  }
}

function updateUserChoices(choice) {
  console.log("User choices:", choice);
}

const arrow = document.getElementById("arrow");
let rotationAngle = 0;

if (arrow) {
  arrow.addEventListener("click", function () {
    rotationAngle += Math.PI / 2;
    rotateMeshes(Math.PI / 2);
  });
}

function rotateMeshes(angle) {
  const totalRotation = parentNode.rotation.y + angle;
  const animation = new BABYLON.Animation(
    "rotateAnimation",
    "rotation.y",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const keys = [
    { frame: 0, value: parentNode.rotation.y },
    { frame: 120, value: totalRotation },
  ];

  animation.setKeys(keys);

  parentNode.animations = [];
  parentNode.animations.push(animation);
  scene.beginAnimation(parentNode, 0, 120, false, 1, () => {});

  parentNode.rotation.y = totalRotation;

  console.log(`Model rotated to Y=${totalRotation}`);
}

document.getElementById("backButton").addEventListener("click", function () {
  enableCameraControls();
  if (step > 1) {
    if (step === 5) {
      if (userChoices.embroidery.jacket.length === 0) {
        step = 3;
      } else {
        step = 4;
      }
    } else {
      step--;
    }
    initializeStep(step);
    enableCameraControls();
  }
});

document.getElementById("nextButton").addEventListener("click", function () {
  enableCameraControls();

  let selectedChoice = null;

  if (step === 1) {
    const selectedTexture = document.querySelector(".card_cardImage.selected");
    if (selectedTexture) {
      selectedChoice = { texture: selectedTexture.alt };
      userChoices.texture = selectedTexture.alt;
    } else {
      selectedChoice = { texture: "E5102-38.png" };
      userChoices.texture = "E5102-38.png";
    }
  } else if (step === 2) {
    selectedChoice = {
      design: userChoices.design,
    };
  } else if (step === 3) {
    selectedChoice = {
      jacketEmbroidery: userChoices.embroidery.jacket,
    };
  } else if (step === 4) {
    selectedChoice = {
      jacketEmbroideryCustomizations: userChoices.embroidery.jacket,
    };
  } else if (step === 5) {
    if (validateMeasurements()) {
      step++;
      initializeStep(step);
    } else {
      alert("Please fill in all measurements before proceeding.");
    }
    return;
  }

  console.log("Current Step: ", step);
  console.log("Selected Choice: ", selectedChoice);
  console.log("User Choices: ", userChoices);

  if (step < 5) {
    if (step === 3) {
      if (userChoices.embroidery.jacket.length === 0) {
        step = 5;
      } else {
        step++;
      }
    } else {
      step++;
    }

    initializeStep(step);
  } else if (step === 5) {
  } else {
    finalizeConfiguration();
  }
});

function validateMeasurements() {
  const requiredMeasurements = [
    "Waist",
    "Crotch Depth",
    "Seat",
    "Knee",
    "Inseam",
    "Hips",
    "Thigh",
    "Outseam",
    "Ankle",
  ];

  for (let measurement of requiredMeasurements) {
    if (
      !userChoices.measurements ||
      !userChoices.measurements[measurement] ||
      userChoices.measurements[measurement] === ""
    ) {
      return false;
    }
  }
  return true;
}

function showMobilePleatOptions() {
  console.log("[showMobilePleatOptions] Displaying pleat options...");

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm Pleat Choice";
  confirmButton.classList.add("back-to-cat");
  confirmButton.addEventListener("click", () => {
    console.log("[showMobilePleatOptions] Confirm clicked => returning");
    showPantsDesignOptions();
  });
  textureContainer.appendChild(confirmButton);

  const pleatOptions = [
    { src: "./assets/pants/pleat/pleat1.png", label: "Pleat 1" },
    { src: "./assets/pants/pleat/pleat2.png", label: "Pleat 2" },
    { src: "./assets/pants/pleat/pleat3.png", label: "Pleat 3" },
    { src: "./assets/pants/pleat/pleat4.png", label: "Pleat 4" },
    { src: "./assets/pants/pleat/pleat5.png", label: "Pleat 5" },
  ];

  const mobilePleatSlider = document.createElement("div");
  mobilePleatSlider.id = "mobilePleatSlider";
  mobilePleatSlider.classList.add("slider-container");

  const cardsWrapper = document.createElement("div");
  cardsWrapper.classList.add("cards-wrapper");
  mobilePleatSlider.appendChild(cardsWrapper);

  pleatOptions.forEach((item) => {
    const pleatCard = document.createElement("div");
    pleatCard.classList.add("card_cardContainer", "part-option");
    pleatCard.setAttribute("data-part-name", "Pleat");
    pleatCard.setAttribute("data-mesh-name", item.label);
    pleatCard.tabIndex = 0;
    pleatCard.style.touchAction = "pan-y";
    pleatCard.style.cursor = "pointer";

    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("img-wrapper");
    imgWrapper.style.touchAction = "pan-y";

    const imgEl = document.createElement("img");
    imgEl.src = item.src;
    imgEl.alt = item.label;
    imgEl.style.touchAction = "pan-y";
    imgEl.style.width = "100%";
    imgEl.style.height = "auto";

    imgWrapper.appendChild(imgEl);

    const pEl = document.createElement("p");
    pEl.textContent = item.label;
    pEl.style.touchAction = "pan-y";

    pleatCard.appendChild(imgWrapper);
    pleatCard.appendChild(pEl);

    pleatCard.addEventListener("click", () => {
      console.log("[showMobilePleatOptions] Chosen pleat:", item.label);

      cardsWrapper.querySelectorAll(".part-option").forEach((p) => {
        p.classList.remove("selected");
      });

      pleatCard.classList.add("selected");

      userChoices.design.pants.pleat = item.label;

      switchPartMesh("Pleat", item.label);
    });

    cardsWrapper.appendChild(pleatCard);
  });

  textureContainer.appendChild(mobilePleatSlider);

  setupMobileSlider("#mobilePleatSlider");
}

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    populateWidths = () =>
      items.forEach((el, i) => {
        widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px")) / widths[i]) * 100 +
            gsap.getProperty(el, "xPercent")
        );
      }),
    getTotalWidth = () =>
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      items[length - 1].offsetWidth *
        gsap.getProperty(items[length - 1], "scaleX") +
      (parseFloat(config.paddingRight) || 0),
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;
  populateWidths();
  gsap.set(items, {
    xPercent: (i) => xPercents[i],
  });
  gsap.set(items, { x: 0 });
  totalWidth = getTotalWidth();
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.updateIndex = () => (curIndex = Math.round(tl.progress() * items.length));
  tl.times = times;
  tl.items = items;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  if (config.draggable && typeof Draggable === "function") {
    let proxy = document.createElement("div"),
      wrap = gsap.utils.wrap(0, 1),
      ratio,
      startProgress,
      draggable,
      dragSnap,
      roundFactor,
      align = () =>
        tl.progress(
          wrap(startProgress + (draggable.startX - draggable.x) * ratio)
        ),
      syncIndex = () => tl.updateIndex();
    typeof InertiaPlugin === "undefined" &&
      console.warn(
        "InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club"
      );
    draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode,
      type: "x",
      onPress() {
        startProgress = tl.progress();
        tl.progress(0);
        populateWidths();
        totalWidth = getTotalWidth();
        ratio = 1 / totalWidth;
        dragSnap = totalWidth / items.length;
        roundFactor = Math.pow(
          10,
          ((dragSnap + "").split(".")[1] || "").length
        );
        tl.progress(startProgress);
      },
      onDrag: align,
      onThrowUpdate: align,
      inertia: true,
      snap: (value) => {
        let n =
          Math.round(parseFloat(value) / dragSnap) * dragSnap * roundFactor;
        return (n - (n % 1)) / roundFactor;
      },
      onRelease: syncIndex,
      onThrowComplete: () => gsap.set(proxy, { x: 0 }) && syncIndex(),
    })[0];
  }
  return tl;
}

function finalizeConfiguration() {
  let summary =
    "Configuration Complete! Thank you for customizing your suit.\n\n";

  summary += `Texture: ${userChoices.texture}\n`;

  summary += "Design Selections:\n";
  for (let part in userChoices.design.jacket) {
    summary += `  ${part}: ${userChoices.design.jacket[part]}\n`;
  }
  for (let part in userChoices.design.pants) {
    summary += `  ${part}: ${userChoices.design.pants[part]}\n`;
  }

  if (
    userChoices.embroidery.hasEmbroidery &&
    userChoices.embroidery.jacket.length > 0
  ) {
    summary += `Embroidery Locations:\n`;
    userChoices.embroidery.jacket.forEach((emb, index) => {
      summary += `  Embroidery ${index + 1}:\n`;
      summary += `    Location: ${emb.location}\n`;
      summary += `    Text: ${emb.text || "N/A"}\n`;
      summary += `    Color: ${emb.color || "N/A"}\n`;
    });
  } else {
    summary += "No Embroidery Selected.\n";
  }

  if (userChoices.measurements) {
    summary += "Measurements:\n";
    for (let measurement in userChoices.measurements) {
      summary += `  ${measurement}: ${userChoices.measurements[measurement]}\n`;
    }
  }

  alert(summary);
}

document
  .getElementById("textureContainer")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("card_cardImage")) {
    } else if (e.target.closest(".pants-item img")) {
      document
        .querySelectorAll(".pants-item img")
        .forEach((img) => img.classList.remove("selected"));
      e.target.closest(".pants-item img").classList.add("selected");
      const selectedMeshName = e.target.closest(".pants-item img").alt;
      userChoices.design.pants["Pockets"] = selectedMeshName;
    }
  });

fetch("textures.json")
  .then((response) => response.json())
  .then((data) => {
    textures = data;
    initializeStep(step);

    setupAccordions();
    setupPartSelection();
    setupPantsItemSelection();
    setupEmbroideryChoiceListener();
  })
  .catch((error) => console.error("Error loading textures.json:", error));

function setVisibleForAllMeshes(jacketVisible, pantsVisible) {
  jacketMeshes.forEach((mesh) => mesh.setEnabled(jacketVisible));
  pantsMeshes.forEach((mesh) => mesh.setEnabled(pantsVisible));
}

setVisibleForAllMeshes(true, true);

function enableCameraControls() {
  if (!camera.inputs.attached.keyboard) {
    camera.attachControl(canvas, true);
  }
  console.log("Camera controls enabled.");
}

function initializeCardsSlider() {
  const cardsWrappers = document.querySelectorAll(".cards-wrapper");

  cardsWrappers.forEach((cardsWrapper) => {
    if (cardsWrapper.dataset.sliderInitialized) return;

    const cards = gsap.utils.toArray(".card_cardContainer", cardsWrapper);

    const loop = horizontalLoop(cards, {
      paused: true,
      draggable: true,
      speed: 2,
      snap: 1,
    });

    loop.progress(0, false);

    gsap.set(cardsWrapper, { x: 0 });

    cardsWrapper.dataset.sliderInitialized = "true";
  });
}
