function showMobilePocketsOptions() {
  console.log("[showMobilePocketsOptions] Displaying pocket design options...");

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm Pockets Selection";
  confirmButton.classList.add("back-to-cat");
  confirmButton.addEventListener("click", () => {
    console.log(
      "[showMobilePocketsOptions] Confirm button clicked => returning"
    );
    showJacketDesignOptions();
  });
  textureContainer.appendChild(confirmButton);

  const pocketsDesignOptions = [
    {
      src: "./assets/jacket/pockets/pocket1.png",
      label: "Single Pocket",
      meshName: "4on2_pocket_1",
    },
    {
      src: "./assets/jacket/pockets/pocket2.png",
      label: "Double Pocket",
      meshName: "4on2_pocket_2",
    },
    {
      src: "./assets/jacket/pockets/pocket3.png",
      label: "Patch Pocket",
      meshName: "4on2_pocket_3",
    },
    {
      src: "./assets/jacket/pockets/pocket4.png",
      label: "Flap Pocket",
      meshName: "4on2_pocket_4",
    },

    {
      src: "./assets/jacket/pockets/pocket5.png",
      label: "Ticket Pocket",
      meshName: "4on2_pocket_5",
    },
    {
      src: "./assets/jacket/pockets/pocket6.png",
      label: "Slash Pocket",
      meshName: "4on2_pocket_6",
    },
    {
      src: "./assets/jacket/pockets/pocket7.png",
      label: "Welt Pocket",
      meshName: "4on2_pocket_7",
    },
    {
      src: "./assets/jacket/pockets/pocket8.png",
      label: "Jetted Pocket",
      meshName: "4on2_pocket_8",
    },
  ];

  const mobilePocketsSlider = document.createElement("div");
  mobilePocketsSlider.id = "mobilePocketsSlider";
  mobilePocketsSlider.classList.add("slider-container");

  pocketsDesignOptions.forEach((item) => {
    const pocketCard = document.createElement("div");
    pocketCard.classList.add("part-option");
    pocketCard.setAttribute("data-part-name", "Pockets");
    pocketCard.setAttribute("data-mesh-name", item.meshName);
    pocketCard.style.touchAction = "pan-y";
    pocketCard.style.cursor = "pointer";

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

    pocketCard.appendChild(imgWrapper);
    pocketCard.appendChild(pEl);

    pocketCard.addEventListener("click", () => {
      console.log(
        "[showMobilePocketsOptions] Chosen pocket option:",
        item.label
      );

      mobilePocketsSlider.querySelectorAll(".part-option").forEach((p) => {
        p.classList.remove("selected");
      });

      pocketCard.classList.add("selected");

      userChoices.design.jacket["Pockets"] = item.meshName;

      switchPartMesh("Pockets", item.meshName);
    });

    mobilePocketsSlider.appendChild(pocketCard);
  });

  textureContainer.appendChild(mobilePocketsSlider);

  setupMobileSlider("#mobilePocketsSlider");

  const pocketsSlider = horizontalLoop(
    document.querySelectorAll("#mobilePocketsSlider .part-option"),
    {
      paused: true,
      draggable: true,
      speed: 2,
      snap: 1,
      repeat: -1,
    }
  );

  prevButton.addEventListener("click", () => {
    pocketsSlider.previous();
  });

  nextButton.addEventListener("click", () => {
    pocketsSlider.next();
  });
}

function showJacketDesignOptions() {
  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  createBackButton();

  if (window.matchMedia("(max-width: 1024.9px)").matches) {
    const jacketParts = ["Back", "Lapels", "Pockets"];
    let contentHTML = "";
    jacketParts.forEach((part) => {
      contentHTML += createMobileJacketPartCard(part);
    });

    textureContainer.innerHTML += `
      <div class="cards-wrapper design-options">
        ${contentHTML}
      </div>
    `;

    initializeCardsSlider();

    const jacketPartCards = textureContainer.querySelectorAll(
      ".design-options .card_cardContainer"
    );
    jacketPartCards.forEach((card) => {
      card.addEventListener("click", () => {
        const partName = card.getAttribute("data-test-id");
        console.log(`Clicked on jacket part: ${partName}`);

        if (partName === "Back") {
          showMobileBackOptions();
        } else if (partName === "Lapels") {
          showMobileLapelsOptions();
        } else if (partName === "Pockets") {
          showMobilePocketsOptions();
        }
      });
    });
  } else {
    const jacketParts = ["Back", "Lapels", "Pockets"];
    let contentHTML = "";
    jacketParts.forEach((part) => {
      contentHTML += createMobileJacketPartCard(part);
    });

    textureContainer.innerHTML += `
      <div class="controls">
        <button class="prevButton">Prev</button>
        <button class="nextButton">Next</button>
      </div>
      <div class="cards-wrapper design-options">
        ${contentHTML}
      </div>
    `;

    initializeCardsSlider();

    const jacketPartCards = textureContainer.querySelectorAll(
      ".design-options .card_cardContainer"
    );
    jacketPartCards.forEach((card) => {
      card.addEventListener("click", () => {
        const partName = card.getAttribute("data-test-id");
        console.log(`Clicked on jacket part: ${partName}`);

        if (partName === "Back") {
          showMobileBackOptions();
        } else if (partName === "Lapels") {
          showMobileLapelsOptions();
        } else if (partName === "Pockets") {
          showMobilePocketsOptions();
        }
      });
    });
  }
}

function showPantsDesignOptions() {
  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  createBackButton();
  if (window.matchMedia("(max-width: 1024.9px)").matches) {
    const pantsParts = ["Cut", "Pleat"];
    let contentHTML = "";
    pantsParts.forEach((part) => {
      contentHTML += createMobileJacketPartCard(part);
    });
    textureContainer.innerHTML += `
      <div class="design-options">${contentHTML}</div>
    `;

    const sliderItems = document.querySelectorAll(
      ".design-options .card_cardContainer"
    );
    sliderItems.forEach((item) => {
      item.addEventListener("click", () => {
        const clickedPart = item.getAttribute("data-test-id");
        console.log("Clicked Pants Part (mobile):", clickedPart);

        if (clickedPart === "Cut") {
          showMobileCutOptions();
        } else if (clickedPart === "Pleat") {
          showMobilePleatOptions();
        }
      });
    });
  } else {
    textureContainer.innerHTML += `
      <button class="accordion" data-category="pants">
        Pants <span class="sign-acc">+</span>
      </button>
      <div class="panel" style="max-height: 0px;">
        <button class="sub_accordion" data-category="cut">
          Cut <span class="sign-acc">+</span>
        </button>
        <div class="sub_panel">
          <!-- your existing "cut" content -->
        </div>
        <button class="sub_accordion" data-category="pleat">
          Pleat <span class="sign-acc">+</span>
        </button>
        <div class="sub_panel">
          <!-- etc. -->
        </div>
        <!-- Add more sub-accordions if needed -->
      </div>
    `;
    setupPartHoverHighlight();
  }
}

function setupMobileEmbroideryButtons() {
  const locationButton = document.getElementById("locationButton");
  const colorButton = document.getElementById("colorButton");
  const charactersButton = document.getElementById("charactersButton");
  const embroideryContainer = document.getElementById(
    "embroideryLocationsContainer"
  );
  const embroideryChoices = document.getElementById("embroideryChoices");
  const colorChoices = document.getElementById("colorChoices");

  if (locationButton && embroideryChoices && colorChoices) {
    locationButton.addEventListener("click", () => {
      embroideryChoices.classList.remove("hidden");
      colorChoices.classList.add("hidden");
    });
  }

  if (colorButton && embroideryChoices && colorChoices) {
    colorButton.addEventListener("click", () => {
      embroideryChoices.classList.add("hidden");
      colorChoices.classList.remove("hidden");
    });

    const colorOptions = colorChoices.querySelectorAll(".color-option");
    colorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedColor = option.getAttribute("data-color");

        userChoices.embroidery.jacket.forEach((emb) => {
          emb.color = selectedColor;
        });

        colorOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        console.log(`Color selected: ${selectedColor}`);
      });
    });
  }

  if (charactersButton) {
    charactersButton.addEventListener("click", () => {
      const embroideryLocations = userChoices.embroidery.jacket;

      if (embroideryLocations.length === 0) {
        alert("No embroidery locations selected.");
        return;
      }

      embroideryContainer.innerHTML = `
        <div class="characters-inputs">
          <h3>Enter Embroidery Text for Each Location:</h3>
          ${embroideryLocations
            .map(
              (embroidery, index) => `
            <div class="embroidery-input-group">
              <label for="embroideryTextInput${index}">${
                embroidery.location
              }:</label>
              <input
                type="text"
                id="embroideryTextInput${index}"
                maxlength="20"
                placeholder="Max 20 characters"
                value="${embroidery.text || ""}"
              />
            </div>
          `
            )
            .join("")}
          <div class="embroidery-buttons">
            <button id="saveEmbroideryTexts" class="save-button">Save</button>
            <button id="cancelEmbroideryTexts" class="cancel-button">Cancel</button>
          </div>
        </div>
      `;

      const saveButton = document.getElementById("saveEmbroideryTexts");
      const cancelButton = document.getElementById("cancelEmbroideryTexts");

      saveButton.addEventListener("click", () => {
        let allValid = true;

        embroideryLocations.forEach((embroidery, index) => {
          const input = document.getElementById(`embroideryTextInput${index}`);
          const text = input.value.trim();

          if (text.length > 20) {
            alert(`Text for "${embroidery.location}" exceeds 20 characters.`);
            allValid = false;
            return;
          }

          if (text.length === 0) {
            alert(`Please enter text for "${embroidery.location}".`);
            allValid = false;
            return;
          }

          embroidery.text = text;
        });

        if (!allValid) {
          return;
        }

        console.log("Added Embroidery Texts:", userChoices.embroidery.jacket);

        embroideryContainer.innerHTML = `
          <!-- Embroidery Choices -->
          <div class="choice-container-step3" id="embroideryChoices">
            <div class="jacket-embroidery-choice">
              <img src="./assets/rectangle_115.webp" alt="Inner right chest pocket"/>
              <p>Inner right chest pocket</p>
            </div>
            <div class="jacket-embroidery-choice">
              <img src="./assets/rectangle_115.webp" alt="Inner left chest pocket"/>
              <p>Inner left chest pocket</p>
            </div>
            <div class="jacket-embroidery-choice">
              <img src="./assets/rectangle_115.webp" alt="Under the collar flap"/>
              <p>Under the collar flap</p>
            </div>
            <!-- "No Embroidery" Option -->
            <div class="jacket-embroidery-choice no-embroidery">
              <img src="./assets/rectangle_115.webp" alt="No Embroidery"/>
              <p>No Embroidery</p>
            </div>
          </div>
          
          <!-- Color Choices (Hidden by Default) -->
          <div class="color-options hidden" id="colorChoices">
            <button class="color-option" data-color="#FF0000" style="background-color: #FF0000;">Red</button>
            <button class="color-option" data-color="#00FF00" style="background-color: #00FF00;">Green</button>
            <button class="color-option" data-color="#0000FF" style="background-color: #0000FF;">Blue</button>
            <!-- Add more colors as needed -->
          </div>
        `;

        setupMobileEmbroideryButtons();
      });

      cancelButton.addEventListener("click", () => {
        embroideryContainer.innerHTML = `
          <!-- Embroidery Choices -->
          <div class="choice-container-step3" id="embroideryChoices">
            <div class="jacket-embroidery-choice">
              <img src="./assets/rectangle_115.webp" alt="Inner right chest pocket"/>
              <p>Inner right chest pocket</p>
            </div>
            <div class="jacket-embroidery-choice">
              <img src="./assets/rectangle_115.webp" alt="Inner left chest pocket"/>
              <p>Inner left chest pocket</p>
            </div>
            <div class="jacket-embroidery-choice">
              <img src="./assets/rectangle_115.webp" alt="Under the collar flap"/>
              <p>Under the collar flap</p>
            </div>
            <!-- "No Embroidery" Option -->
            <div class="jacket-embroidery-choice no-embroidery">
              <img src="./assets/rectangle_115.webp" alt="No Embroidery"/>
              <p>No Embroidery</p>
            </div>
          </div>
          
          <!-- Color Choices (Hidden by Default) -->
          <div class="color-options hidden" id="colorChoices">
            <button class="color-option" data-color="#FF0000" style="background-color: #FF0000;">Red</button>
            <button class="color-option" data-color="#00FF00" style="background-color: #00FF00;">Green</button>
            <button class="color-option" data-color="#0000FF" style="background-color: #0000FF;">Blue</button>
            <!-- Add more colors as needed -->
          </div>
        `;

        setupMobileEmbroideryButtons();
      });
    });
  }

  document.addEventListener("click", (event) => {
    const isClickInside =
      embroideryContainer.contains(event.target) ||
      locationButton.contains(event.target) ||
      colorButton.contains(event.target) ||
      charactersButton.contains(event.target);
    if (!isClickInside) {
      embroideryChoices.classList.add("hidden");
      colorChoices.classList.add("hidden");
    }
  });
}

function initializeStep(currentStep) {
  const stepTitle = document.getElementById("stepTitle");
  const textureContainer = document.getElementById("textureContainer");
  const batchSelector = document.getElementById("batchSelector");

  const existingBackButton = document.querySelector("#sidePanel .back-button");
  if (existingBackButton) {
    existingBackButton.remove();
    console.log("[initializeStep] Existing back button removed.");
  }
  stepTitle.innerHTML = "";

  switch (step) {
    case 1:
      stepTitle.innerHTML = `
        <p>Here we’ve curated a selection of fabrics that best suits you.</p>
        <p>Please choose your preferred fabric group from the options below to proceed to the next step.</p>
      `;
      batchSelector.style.display = "none";

      jacketMeshes.forEach((mesh) => mesh.setEnabled(true));
      pantsMeshes.forEach((mesh) => mesh.setEnabled(true));

      initializeTextureButtons();

      if (window.matchMedia("(max-width: 1024.9px)").matches) {
        textureContainer.style.display = "flex";
      } else {
        textureContainer.style.display = "flex";
      }

      zoomToMeshes([...jacketMeshes, ...pantsMeshes]);
      break;

    case 2:
      stepTitle.innerHTML = `
          <p>Great choice!</br>Now, let’s move on to designing your garment.</p>
        `;
      batchSelector.style.display = "none";
      textureContainer.style.display = "flex";
      textureContainer.classList.add("texture-container");

      if (window.matchMedia("(max-width: 1024.9px)").matches) {
        stepTitle.innerHTML += `
            <p>Please choose which garment to design first:</p>
          `;
        textureContainer.innerHTML = `
            <div id="chooseGarmentContainer" style="display: flex; gap: 20px;">
              <div class="card_cardContainer" data-test-id="chooseJacket" tabindex="0">
                <div class="card_cardImageContainer">
                  <img class="card_cardImage" loading="lazy" src="./batch1/E5101-38.png" alt="E5101-38">
                  <div class="card_itemAmountContainer" data-test-id="item-amount">Jacket</div>
                </div>
                <div class="card_cardDetails">
                  <p class="card_cardText" data-test-id="card-text">Design Jacket</p>
                </div>
              </div>
              <div class="card_cardContainer" data-test-id="choosePants" tabindex="0">
                <div class="card_cardImageContainer">
                  <img class="card_cardImage" loading="lazy" src="./batch1/E5102-38.png" alt="E5102-38">
                  <div class="card_itemAmountContainer" data-test-id="item-amount">Pants</div>
                </div>
                <div class="card_cardDetails">
                  <p class="card_cardText" data-test-id="card-text">Design Pants</p>
                </div>
              </div>
            </div>
          `;
        const chooseJacketCard = document.querySelector(
          '[data-test-id="chooseJacket"]'
        );
        const choosePantsCard = document.querySelector(
          '[data-test-id="choosePants"]'
        );

        if (chooseJacketCard) {
          chooseJacketCard.addEventListener("click", () => {
            showJacketDesignOptions();
          });
        }
        if (choosePantsCard) {
          choosePantsCard.addEventListener("click", () => {
            showPantsDesignOptions();
          });
        }
      } else {
        stepTitle.innerHTML += `
            <p>Choose from the available options for each key design feature. Let’s start creating your perfect look!</p>
          `;
        textureContainer.innerHTML = `
            <button class="accordion" data-category="jacket">
              Jacket <span class="sign-acc">+</span>
            </button>
            <div class="panel" style="max-height: 0px;">
              ${generatePartItems([
                { partName: "Back", options: partOptions["Back"] },
                { partName: "Collar", options: partOptions["Collar"] },
                { partName: "Front", options: partOptions["Front"] },
                { partName: "Lapels", options: partOptions["Lapels"] },
                { partName: "Pockets", options: partOptions["Pockets"] },
                { partName: "Sleeves", options: partOptions["Sleeves"] },
              ])}
            </div>

            <button class="accordion" data-category="pants">
              Pants <span class="sign-acc">+</span>
            </button>
            <div class="panel" style="max-height: 0px;">
              <button class="sub_accordion" data-category="cut">
                Cut <span class="sign-acc">+</span>
              </button>
              <div class="sub_panel">
                <!-- 8 images for Cut -->
                <div id="pantsCutContainer" style="display: flex; flex-wrap: wrap; gap: 1rem;">
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut1.png" alt="Extra Slim">
                    <p>Extra Slim</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut2.png" alt="Slim">
                    <p>Slim</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut3.png" alt="Straight">
                    <p>Straight</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut4.png" alt="Classic">
                    <p>Classic</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut5.png" alt="Relaxed Fit">
                    <p>Relaxed Fit</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut6.png" alt="Tapered Leg">
                    <p>Tapered Leg</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut7.png" alt="Flat Front">
                    <p>Flat Front</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut8.png" alt="Pleated Front">
                    <p>Pleated Front</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut9.png" alt="High waist">
                    <p>High waist</p>
                  </div>
                  <div class="pants-item">
                    <img src="./assets/pants/cut/cut10.png" alt="Low rise">
                    <p>Low rise</p>
                  </div>
                </div>
              </div>

              <button class="sub_accordion" data-category="pleat">
                Pleat <span class="sign-acc">+</span>
              </button>
              <div class="sub_panel">
                <p>Content for Pleat...</p>
              </div>
            </div>
          `;
        setupPartHoverHighlight();
      }
      resetCamera();
      break;

    case 3:
      stepTitle.innerHTML = `
    <p>Now it’s time to add a personal touch to your garment!</p>
    <p>You can customize your suit with embroidery. Please select your preferred locations for the embroidery or choose "No Embroidery" to skip.</p>
  `;
      batchSelector.style.display = "none";
      textureContainer.style.display = "flex";
      textureContainer.style.padding = "0 20px";
      textureContainer.style.justifyContent = "center";

      let embroideryHTML = `
    <h2 class="text-step3">Jacket Embroidery Locations</h2>
    <div id="embroideryLocationsContainer">
      <!-- Embroidery Choices -->
      <div class="choice-container-step3" id="embroideryChoices">
        <div class="jacket-embroidery-choice">
          <img src="./assets/rectangle_115.webp" alt="Inner right chest pocket"/>
          <p>Inner right chest pocket</p>
        </div>
        <div class="jacket-embroidery-choice">
          <img src="./assets/rectangle_115.webp" alt="Inner left chest pocket"/>
          <p>Inner left chest pocket</p>
        </div>
        <div class="jacket-embroidery-choice">
          <img src="./assets/rectangle_115.webp" alt="Under the collar flap"/>
          <p>Under the collar flap</p>
        </div>
        <!-- "No Embroidery" Option -->
        <div class="jacket-embroidery-choice no-embroidery">
          <img src="./assets/rectangle_115.webp" alt="No Embroidery"/>
          <p>No Embroidery</p>
        </div>
      </div>
      
      <!-- Color Choices (Hidden by Default) -->
      <div class="color-options hidden" id="colorChoices">
        <button class="color-option" data-color="#FF0000" style="background-color: #FF0000;">Red</button>
        <button class="color-option" data-color="#00FF00" style="background-color: #00FF00;">Green</button>
        <button class="color-option" data-color="#0000FF" style="background-color: #0000FF;">Blue</button>
        <!-- Add more colors as needed -->
      </div>
    </div>
  `;

      if (window.matchMedia("(max-width: 1024.9px)").matches) {
        embroideryHTML += `
      <div class="mobile-embroidery-buttons">
        <button id="locationButton" class="embroidery-button">Location</button>
        <button id="colorButton" class="embroidery-button">Color</button>
        <button id="charactersButton" class="embroidery-button">Characters</button>
      </div>
    `;
      }

      textureContainer.innerHTML = embroideryHTML;

      if (userChoices.embroidery.jacket.length > 0) {
        userChoices.embroidery.jacket.forEach((embroidery) => {
          const choiceEl = Array.from(
            document.querySelectorAll(".jacket-embroidery-choice")
          ).find(
            (el) =>
              el.querySelector("p").innerText.trim() === embroidery.location
          );
          if (choiceEl) {
            choiceEl.classList.add("selected");
          }
        });
      } else {
        const noEmbroideryEl = document.querySelector(
          ".jacket-embroidery-choice.no-embroidery"
        );
        if (noEmbroideryEl) {
          noEmbroideryEl.classList.add("selected");
        }
      }

      if (window.matchMedia("(max-width: 1024.9px)").matches) {
        setupMobileEmbroideryButtons();
      }

      loadJacketBasedOnUserChoices(false);
      pantsMeshes.forEach((mesh) => mesh.setEnabled(true));

      highlightLayer.removeAllMeshes();
      zoomToMeshes([...jacketMeshes, ...pantsMeshes]);

      resetCamera();

      cameraLocked = false;
      break;

    case 4:
      if (window.matchMedia("(max-width: 1024.9px)").matches) {
        step = 5;
        initializeStep(step);
        return;
      }
      if (
        !userChoices.embroidery.jacket ||
        userChoices.embroidery.jacket.length === 0
      ) {
        step = 5;
        initializeStep(step);
        return;
      }

      stepTitle.innerHTML = `
        <p>Customize your jacket embroidery!</p>
        <p>Please enter your desired text and select your preferred color for each embroidery location.</p>
      `;
      batchSelector.style.display = "none";
      textureContainer.style.display = "flex";
      textureContainer.style.padding = "0 20px";
      textureContainer.style.justifyContent = "start";

      textureContainer.innerHTML = `
        <h2 class="text-step3 step4 embroidery">Jacket Embroidery Customization</h2>
        <div id="embroideryCustomizationContainer"></div>
      `;

      const customizationContainer = document.getElementById(
        "embroideryCustomizationContainer"
      );

      userChoices.embroidery.jacket.forEach((embroidery, index) => {
        customizationContainer.innerHTML += `
          <div class="embroidery-customization" data-index="${index}">
            <h3>Embroidery ${index + 1}: ${embroidery.location}</h3>
            <button class="remove-embroidery-button" data-index="${index}">Remove</button>
            <div class="embroidery-color-and-text">
              <div class="jacket-embroidery-choice">
                <img class="embroidery-image" src="./assets/rectangle_115.webp" alt="${
                  embroidery.location
                }">
                <p>${embroidery.location}</p>
              </div>
              <div class="embroidery-color-and-text-input">
                <div class="embroidery-color-picker">
                  <label>Select Color:</label>
                  <div id="embroidery-thread-colors-picker-jacket-${index}" class="color-picker-container">
                    ${generateColorCirclesHTML(21)}
                  </div>
                </div>
                <div class="embroidery-text-input">
                  <label>Enter Text (max 20 characters):</label>
                  <input
                    type="text"
                    id="embroideryTextInput${index}"
                    maxlength="20"
                    placeholder="Your text here"
                    value="${embroidery.text}"
                  />
                </div>
              </div>
            </div>
          </div>
        `;
      });

      userChoices.embroidery.jacket.forEach((embroidery, index) => {
        const colorPickerContainer = document.getElementById(
          `embroidery-thread-colors-picker-jacket-${index}`
        );
        if (colorPickerContainer) {
          const colorCircles =
            colorPickerContainer.querySelectorAll(".color-circle");
          colorCircles.forEach((circle) => {
            circle.addEventListener("click", () => {
              colorCircles.forEach((c) => c.classList.remove("selected"));
              circle.classList.add("selected");
              userChoices.embroidery.jacket[index].color =
                circle.getAttribute("data-color");
            });

            if (
              embroidery.color &&
              embroidery.color === circle.getAttribute("data-color")
            ) {
              circle.classList.add("selected");
            }
          });
        }

        const textInput = document.getElementById(
          `embroideryTextInput${index}`
        );
        if (textInput) {
          textInput.addEventListener("input", () => {
            userChoices.embroidery.jacket[index].text = textInput.value.trim();
          });
        }

        const removeButton = document.querySelector(
          `.remove-embroidery-button[data-index="${index}"]`
        );
        if (removeButton) {
          removeButton.addEventListener("click", () => {
            userChoices.embroidery.jacket.splice(index, 1);
            initializeStep(4);
          });
        }
      });

      resetCamera();
      break;

    case 5:
      stepTitle.innerHTML = `
        <p>Please provide your measurements for the pants.</p>
        <p>Enter your measurements in the fields provided. If you need assistance, refer to the diagram.</p>
      `;
      batchSelector.style.display = "none";
      textureContainer.style.display = "flex";
      textureContainer.style.padding = "0 20px";
      textureContainer.style.justifyContent = "center";

      canvas.style.display = "none";

      textureContainer.innerHTML = `
        <div id="pantsMeasurementWrapper">
          <img id="pantsMeasurementImage" src="assets/pants/pants.png" alt="Pants Diagram">
          <!-- Measurement inputs will be positioned over this image -->
          ${generatePantsMeasurementInputs()}
        </div>
      `;

      const pantsMeasurementWrapper = document.getElementById(
        "pantsMeasurementWrapper"
      );
      pantsMeasurementWrapper.style.position = "relative";
      pantsMeasurementWrapper.style.display = "inline-block";

      setupPantsMeasurementListeners();
      resetCamera();
      break;

    default:
      canvas.style.display = "block";
      resetCamera();
      console.log("Invalid step");
      break;
  }
}

function setupPantsMeasurementListeners() {
  const measurements = [
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

  measurements.forEach((measurement) => {
    const inputField = document.getElementById(`${measurement}Input`);
    inputField.addEventListener("input", () => {
      userChoices.measurements[measurement] = inputField.value;
    });
  });
}

function generateColorCirclesHTML(numberOfColors) {
  const colors = ["#000000", "#FFFFFF", "#7A1313"];

  const selectedColors = colors.slice(0, numberOfColors);

  return selectedColors
    .map(
      (color) => `
    <div class="color-circle" data-color="${color}" style="background-color: ${color};"></div>
  `
    )
    .join("");
}

function generatePantsMeasurementInputs() {
  const measurements = [
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

  return measurements
    .map(
      (measurement) => `
        <div class="measurement-input" id="${measurement.replace(
          /\s/g,
          ""
        )}Measurement">
          <label for="${measurement}Input">${measurement}</label>
          <input type="number" id="${measurement}Input" />
          <div class="line"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 0.692308C2.39707 0.692308 0.692308 2.39707 0.692308 4.5C0.692308 6.60291 2.39707 8.30769 4.5 8.30769C6.60291 8.30769 8.30769 6.60291 8.30769 4.5C8.30769 2.39707 6.60291 0.692308 4.5 0.692308ZM0 4.5C0 2.01472 2.01472 0 4.5 0C6.98529 0 9 2.01472 9 4.5C9 6.98529 6.98529 9 4.5 9C2.01472 9 0 6.98529 0 4.5ZM4.5 4.15385C4.69117 4.15385 4.84615 4.30883 4.84615 4.5V6.11538C4.84615 6.30655 4.69117 6.46154 4.5 6.46154C4.30883 6.46154 4.15385 6.30655 4.15385 6.11538V4.5C4.15385 4.30883 4.30883 4.15385 4.5 4.15385ZM4.5 2.65385C4.24509 2.65385 4.03846 2.86049 4.03846 3.11538C4.03846 3.37028 4.24509 3.57692 4.5 3.57692H4.50462C4.75952 3.57692 4.96615 3.37028 4.96615 3.11538C4.96615 2.86049 4.75952 2.65385 4.50462 2.65385H4.5Z" fill="black"/>
          </svg>
        </div>
      `
    )
    .join("");
}
