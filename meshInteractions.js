function setupPartHoverHighlight() {
  const partOptionButtons = document.querySelectorAll(".part-option");
  const partItems = document.querySelectorAll(".part-item");

  partOptionButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      const partName = this.getAttribute("data-part-name");
      const meshName = this.getAttribute("data-mesh-name");
      const mesh = partOptionsMeshes[partName][meshName];

      if (mesh) {
        highlightLayer.addMesh(mesh, BABYLON.Color3.White());
      }
    });

    button.addEventListener("mouseleave", function () {
      const partName = this.getAttribute("data-part-name");
      const meshName = this.getAttribute("data-mesh-name");
      const mesh = partOptionsMeshes[partName][meshName];

      if (mesh) {
        highlightLayer.removeMesh(mesh);
      }
    });
  });

  partItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const partName = this.getAttribute("data-part");
      const mesh = currentPartMeshes[partName];

      if (mesh) {
        highlightLayer.addMesh(mesh, BABYLON.Color3.White());
      }
    });

    item.addEventListener("mouseleave", function () {
      const partName = this.getAttribute("data-part");
      const mesh = currentPartMeshes[partName];

      if (mesh) {
        highlightLayer.removeMesh(mesh);
      }
    });
  });
}

function centerModel() {
  parentNode.computeWorldMatrix(true);
  const meshes = parentNode.getChildMeshes();

  let min = new BABYLON.Vector3(
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE
  );
  let max = new BABYLON.Vector3(
    -Number.MAX_VALUE,
    -Number.MAX_VALUE,
    -Number.MAX_VALUE
  );

  meshes.forEach((mesh) => {
    mesh.computeWorldMatrix(true);
    const boundingInfo = mesh.getBoundingInfo();
    const meshMin = boundingInfo.boundingBox.minimumWorld;
    const meshMax = boundingInfo.boundingBox.maximumWorld;

    min = BABYLON.Vector3.Minimize(min, meshMin);
    max = BABYLON.Vector3.Maximize(max, meshMax);
  });

  const center = min.add(max).scale(0.5);

  parentNode.position = parentNode.position.subtract(center);

  camera.setTarget(BABYLON.Vector3.Zero());
  const size = max.subtract(min).length();
  camera.radius = size * 1.5;

  initialCameraRadius = camera.radius;
  initialCameraTarget = camera.target.clone();
  initialCameraAlpha = camera.alpha;
  initialCameraBeta = camera.beta;
}

function zoomToMesh(mesh) {
  if (!mesh) {
    console.error("zoomToMesh called with undefined mesh");
    return;
  }
  console.log(`Zooming to mesh: ${mesh.name}`);

  const boundingInfo = mesh.getBoundingInfo();
  const meshCenter = boundingInfo.boundingBox.centerWorld;
  const radius = boundingInfo.boundingSphere.radiusWorld * 1.5;

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraRadiusAnim",
    camera,
    "radius",
    60,
    120,
    camera.radius,
    radius,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraTargetAnim",
    camera,
    "target",
    60,
    120,
    camera.target,
    meshCenter,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
}

function zoomToMeshes(meshes, yOffsetFraction = 0) {
  if (!Array.isArray(meshes) || meshes.length === 0) return;

  let min = new BABYLON.Vector3(
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE
  );
  let max = new BABYLON.Vector3(
    -Number.MAX_VALUE,
    -Number.MAX_VALUE,
    -Number.MAX_VALUE
  );

  meshes.forEach((m) => {
    if (!(m instanceof BABYLON.Mesh)) return;

    m.computeWorldMatrix(true);
    const boundingInfo = m.getBoundingInfo();
    const meshMin = boundingInfo.boundingBox.minimumWorld;
    const meshMax = boundingInfo.boundingBox.maximumWorld;

    min = BABYLON.Vector3.Minimize(min, meshMin);
    max = BABYLON.Vector3.Maximize(max, meshMax);
  });

  const center = min.add(max).scale(0.5);
  const height = max.y - min.y;
  const yOffset = height * yOffsetFraction;
  center.y += yOffset;

  const radius = BABYLON.Vector3.Distance(min, max) * 0.6;

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraRadiusAnim",
    camera,
    "radius",
    60,
    120,
    camera.radius,
    radius,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraTargetAnim",
    camera,
    "target",
    60,
    120,
    camera.target.clone(),
    center,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
}

function handlePartSelection(partName, meshName) {
  const rotationIncrements = {
    Back: Math.PI,
    Collar: 0,
    Lapels: 0,
    Pockets: 0,
    Front: 0,
    Sleeves: 0,
  };

  const rotationIncrement = rotationIncrements[partName] || 0;

  let targetRotationY = initialRotationY + rotationIncrement;

  targetRotationY = normalizeAngle(targetRotationY);

  rotateModelTo(targetRotationY, () => {
    console.log(`Model rotated for ${partName}`);
    const mesh = partMeshes[meshName];
    if (mesh) {
      zoomToMesh(mesh);
      focusCameraOnMesh(mesh);
    }
  });

  currentRotationY = targetRotationY;

  currentOrientation = rotationIncrement === Math.PI ? "back" : "front";
  console.log(`Current Orientation: ${currentOrientation}`);
}

function rotateModelTo(targetRotationY, callback) {
  const animation = new BABYLON.Animation(
    "rotateAnimation",
    "rotation.y",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const keys = [
    { frame: 0, value: parentNode.rotation.y },
    { frame: 120, value: targetRotationY },
  ];

  animation.setKeys(keys);

  parentNode.animations = [];
  parentNode.animations.push(animation);
  const animatable = scene.beginAnimation(parentNode, 0, 120, false, 1, () => {
    if (callback) callback();
  });

  console.log(`Animating rotation to Y=${targetRotationY}`);
}

function focusCameraOnMesh(mesh) {
  if (!mesh) return;

  const boundingInfo = mesh.getBoundingInfo();
  const meshCenter = boundingInfo.boundingBox.centerWorld;
  const radius = boundingInfo.boundingSphere.radiusWorld * 3;

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraRadiusAnimFocus",
    camera,
    "radius",
    60,
    120,
    camera.radius,
    radius,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraTargetAnimFocus",
    camera,
    "target",
    60,
    120,
    camera.target,
    meshCenter,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const targetBeta = Math.PI / 2 - 0.2;
  const animationBeta = new BABYLON.Animation(
    "cameraBetaAnimFocus",
    "beta",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const keysBeta = [
    { frame: 0, value: camera.beta },
    { frame: 120, value: targetBeta },
  ];

  animationBeta.setKeys(keysBeta);
  camera.animations.push(animationBeta);
  scene.beginAnimation(camera, 0, 120, false);

  console.log(
    `Camera animating to radius: ${radius} and target: (${meshCenter.x}, ${meshCenter.y}, ${meshCenter.z})`
  );
}

function resetCamera() {
  if (
    initialCameraRadius === undefined ||
    initialCameraTarget === undefined ||
    initialCameraAlpha === undefined ||
    initialCameraBeta === undefined
  ) {
    console.error("Initial camera parameters are not set.");
    return;
  }

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraRadiusReset",
    camera,
    "radius",
    60,
    120,
    camera.radius,
    initialCameraRadius,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraTargetReset",
    camera,
    "target",
    60,
    120,
    camera.target,
    initialCameraTarget,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraAlphaReset",
    camera,
    "alpha",
    60,
    120,
    camera.alpha,
    initialCameraAlpha,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  BABYLON.Animation.CreateAndStartAnimation(
    "cameraBetaReset",
    camera,
    "beta",
    60,
    120,
    camera.beta,
    initialCameraBeta,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  console.log("Camera reset to initial position.");
}

function createMobileJacketPartCard(partName) {
  if (partName === "Back") {
    return `
    <div class="card_cardContainer" data-test-id="${partName}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- Back Design Images (Assuming 4 options) -->
        <img class="card_cardImage image-jacket-back" loading="lazy" src="./assets/jacket/back/back1.png" alt="Classic Back">
        <img class="card_cardImage image-jacket-back" loading="lazy" src="./assets/jacket/back/back2.png" alt="Slim Back">
        <img class="card_cardImage image-jacket-back" loading="lazy" src="./assets/jacket/back/back3.png" alt="Pleated Back">
        <img class="card_cardImage image-jacket-back" loading="lazy" src="./assets/jacket/back/back4.png" alt="Double Vent Back">
        <!-- Show # of images if you like -->
        <div class="card_itemAmountContainer" data-test-id="item-amount">4</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${partName}</p>
      </div>
      <div class="card_arrowIcon">
        <svg
          class="arrow-right"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          viewBox="0 0 330 330"
          width="30"
          height="30"
        >
          <path
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
               c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394  
               c-5.857,5.858-5.857,15.355,0.001,21.213  
               C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
               l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
               C255,161.018,253.42,157.202,250.606,154.389z"
          />
        </svg>
      </div>
    </div>
  `;
  } else if (partName === "Lapels") {
    return `
    <div class="card_cardContainer" data-test-id="${partName}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- Lapel Design Images (Assuming 3 options) -->
        <img class="card_cardImage image-jacket-lapels" loading="lazy" src="./assets/jacket/lapels/lapel1.png" alt="Classic Lapel">
        <img class="card_cardImage image-jacket-lapels" loading="lazy" src="./assets/jacket/lapels/lapel2.png" alt="Slim Lapel">
        <img class="card_cardImage image-jacket-lapels" loading="lazy" src="./assets/jacket/lapels/lapel3.png" alt="Wide Lapel">
        <!-- Show # of images if you like -->
        <div class="card_itemAmountContainer" data-test-id="item-amount">3</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${partName}</p>
      </div>
      <div class="card_arrowIcon">
        <svg
          class="arrow-right"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          viewBox="0 0 330 330"
          width="30"
          height="30"
        >
          <path
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
               c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394  
               c-5.857,5.858-5.857,15.355,0.001,21.213  
               C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
               l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
               C255,161.018,253.42,157.202,250.606,154.389z"
          />
        </svg>
      </div>
    </div>
  `;
  } else if (partName === "Pockets") {
    return `
    <div class="card_cardContainer" data-test-id="${partName}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- Pockets Design Images (Assuming 4 options) -->
        <img class="card_cardImage image-jacket-pockets" loading="lazy" src="./assets/jacket/pockets/pocket1.png" alt="Single Pocket">
        <img class="card_cardImage image-jacket-pockets" loading="lazy" src="./assets/jacket/pockets/pocket2.png" alt="Double Pocket">
        <img class="card_cardImage image-jacket-pockets" loading="lazy" src="./assets/jacket/pockets/pocket3.png" alt="Patch Pocket">
        <img class="card_cardImage image-jacket-pockets" loading="lazy" src="./assets/jacket/pockets/pocket4.png" alt="Flap Pocket">
        <!-- Show # of images if you like -->
        <div class="card_itemAmountContainer" data-test-id="item-amount">4</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${partName}</p>
      </div>
      <div class="card_arrowIcon">
        <svg
          class="arrow-right"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          viewBox="0 0 330 330"
          width="30"
          height="30"
        >
          <path
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
               c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394  
               c-5.857,5.858-5.857,15.355,0.001,21.213  
               C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
               l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
               C255,161.018,253.42,157.202,250.606,154.389z"
          />
        </svg>
      </div>
    </div>
  `;
  }

  if (partName === "Cut") {
    return `
    <div class="card_cardContainer" data-test-id="${partName}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- 4 CUT IMAGES -->
        <img class="card_cardImage image-pants-cut" loading="lazy" src="./assets/pants/cut/cut1.png" alt="Extra Slim">
        <img class="card_cardImage image-pants-cut" loading="lazy" src="./assets/pants/cut/cut2.png" alt="Slim">
        <img class="card_cardImage image-pants-cut" loading="lazy" src="./assets/pants/cut/cut3.png" alt="Straight">
        <img class="card_cardImage image-pants-cut" loading="lazy" src="./assets/pants/cut/cut4.png" alt="Classic">
        <!-- Show # of images if you like -->
        <div class="card_itemAmountContainer" data-test-id="item-amount">4</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${partName}</p>
      </div>
      <div class="card_arrowIcon">
        <svg
          class="arrow-right"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          viewBox="0 0 330 330"
          width="30"
          height="30"
        >
          <path
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
               c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394  
               c-5.857,5.858-5.857,15.355,0.001,21.213  
               C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
               l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
               C255,161.018,253.42,157.202,250.606,154.389z"
          />
        </svg>
      </div>
    </div>
  `;
  } else if (partName === "Pleat") {
    return `
    <div class="card_cardContainer" data-test-id="${partName}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- 5 PLEAT IMAGES -->
        <img class="card_cardImage image-pants-pleat" loading="lazy" src="./assets/pants/pleat/pleat1.png" alt="Pleat 1">
        <img class="card_cardImage image-pants-pleat" loading="lazy" src="./assets/pants/pleat/pleat2.png" alt="Pleat 2">
        <img class="card_cardImage image-pants-pleat" loading="lazy" src="./assets/pants/pleat/pleat3.png" alt="Pleat 3">
        <img class="card_cardImage image-pants-pleat" loading="lazy" src="./assets/pants/pleat/pleat4.png" alt="Pleat 4">
 
        <!-- Show # of images if you like -->
        <div class="card_itemAmountContainer" data-test-id="item-amount">5</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${partName}</p>
      </div>
      <div class="card_arrowIcon">
        <svg
          class="arrow-right"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          viewBox="0 0 330 330"
          width="30"
          height="30"
        >
          <path
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
               c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394  
               c-5.857,5.858-5.857,15.355,0.001,21.213  
               C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
               l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
               C255,161.018,253.42,157.202,250.606,154.389z"
          />
        </svg>
      </div>
    </div>
  `;
  }

  return `
  <div class="card_cardContainer" data-test-id="${partName}" tabindex="0">
    <div class="card_cardImageContainer">
      <!-- Default Images -->
      <img class="card_cardImage" loading="lazy" src="./batch1/E5101-38.png" alt="E5101-38">
      <img class="card_cardImage" loading="lazy" src="./batch1/E5102-38.png" alt="E5102-38">
      <img class="card_cardImage" loading="lazy" src="./batch1/E5103-38.png" alt="E5103-38">
      <img class="card_cardImage" loading="lazy" src="./batch1/E5104-38.png" alt="E5104-38">
      <div class="card_itemAmountContainer" data-test-id="item-amount">25</div>
    </div>
    <div class="card_cardDetails">
      <p class="card_cardText" data-test-id="card-text">${partName}</p>
    </div>
    <div class="card_arrowIcon">
      <svg
        class="arrow-right"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        viewBox="0 0 330 330"
        width="30"
        height="30"
      >
        <path
          d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
             c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394  
             c-5.857,5.858-5.857,15.355,0.001,21.213  
             C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
             l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
             C255,161.018,253.42,157.202,250.606,154.389z"
        />
      </svg>
    </div>
  </div>
`;
}

function createBackButton() {
  let backButton = document.querySelector("#sidePanel .back-button");
  if (!backButton) {
    backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.style.marginBottom = "20px";

    backButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<circle cx="9" cy="9" r="9" fill="#EFEFEF"/>
<path d="M4.64645 8.64645C4.45118 8.84171 4.45118 9.15829 4.64645 9.35355L7.82843 12.5355C8.02369 12.7308 8.34027 12.7308 8.53553 12.5355C8.7308 12.3403 8.7308 12.0237 8.53553 11.8284L5.70711 9L8.53553 6.17157C8.7308 5.97631 8.7308 5.65973 8.53553 5.46447C8.34027 5.2692 8.02369 5.2692 7.82843 5.46447L4.64645 8.64645ZM13 8.5L5 8.5L5 9.5L13 9.5L13 8.5Z" fill="black"/>
</svg>
     Back
    `;

    backButton.addEventListener("click", () => {
      step = 2;
      initializeStep(step);
      backButton.remove();
    });

    const sidePanel = document.getElementById("sidePanel");
    if (sidePanel) {
      sidePanel.appendChild(backButton);
    } else {
      console.warn(
        "#sidePanel element not found. Appending to textureContainer instead."
      );
      textureContainer.appendChild(backButton);
    }
  }
}
function showMobileLapelsOptions() {
  console.log("[showMobileLapelsOptions] Displaying lapels design options...");

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm Lapels Selection";
  confirmButton.classList.add("back-to-cat");
  confirmButton.addEventListener("click", () => {
    console.log("[showMobileLapelsOptions] Confirm clicked => returning");
    showJacketDesignOptions();
  });
  textureContainer.appendChild(confirmButton);

  const lapelsDesigns = [
    {
      src: "./assets/jacket/lapels/lapel1.png",
      label: "Classic Lapel",
      meshName: "4on2_Lapels_1",
    },
    {
      src: "./assets/jacket/lapels/lapel2.png",
      label: "Slim Lapel",
      meshName: "4on2_Lapels_2",
    },
    {
      src: "./assets/jacket/lapels/lapel3.png",
      label: "Wide Lapel",
      meshName: "4on2_Lapels_3",
    },
  ];

  const mobileLapelsContainer = document.createElement("div");
  mobileLapelsContainer.classList.add("design-options");

  lapelsDesigns.forEach((item) => {
    const lapelsCard = document.createElement("div");
    lapelsCard.classList.add("part-option");
    lapelsCard.setAttribute("data-part-name", "Lapels");
    lapelsCard.setAttribute("data-mesh-name", item.meshName);
    lapelsCard.style.touchAction = "pan-y";
    lapelsCard.style.cursor = "pointer";

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

    lapelsCard.appendChild(imgWrapper);
    lapelsCard.appendChild(pEl);

    lapelsCard.addEventListener("click", () => {
      console.log(
        "[showMobileLapelsOptions] Chosen lapels option:",
        item.label
      );

      mobileLapelsContainer.querySelectorAll(".part-option").forEach((p) => {
        p.classList.remove("selected");
      });

      lapelsCard.classList.add("selected");

      userChoices.design.jacket.Lapels = item.meshName;
      updateJacketLapelsDesign(item.meshName);
    });

    mobileLapelsContainer.appendChild(lapelsCard);
  });

  textureContainer.appendChild(mobileLapelsContainer);

  setupMobileSlider("#mobileLapelsSlider");
}

function showMobileBackOptions() {
  console.log("[showMobileBackOptions] Displaying back view options...");

  const textureContainer = document.getElementById("textureContainer");
  textureContainer.innerHTML = "";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm Back Selection";
  confirmButton.classList.add("back-to-cat");
  confirmButton.addEventListener("click", () => {
    console.log("[showMobileBackOptions] Confirm button clicked => returning");
    showJacketDesignOptions();
  });
  textureContainer.appendChild(confirmButton);

  const backViewOptions = [
    {
      src: "./assets/jacket/back/back1.png",
      label: "Back Option 1",
      meshName: "4on2_Back_1",
    },
    {
      src: "./assets/jacket/back/back2.png",
      label: "Back Option 2",
      meshName: "4on2_Back_2",
    },
    {
      src: "./assets/jacket/back/back3.png",
      label: "Back Option 3",
      meshName: "4on2_Back_3",
    },
  ];

  const mobileBackSlider = document.createElement("div");
  mobileBackSlider.id = "mobileBackSlider";
  mobileBackSlider.classList.add("slider-container");

  backViewOptions.forEach((item) => {
    const backCard = document.createElement("div");
    backCard.classList.add("part-option");
    backCard.setAttribute("data-part-name", "Back");
    backCard.setAttribute("data-mesh-name", item.meshName);
    backCard.style.touchAction = "pan-y";
    backCard.style.cursor = "pointer";

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

    backCard.appendChild(imgWrapper);
    backCard.appendChild(pEl);

    backCard.addEventListener("click", () => {
      console.log("[showMobileBackOptions] Chosen back option:", item.label);

      mobileBackSlider.querySelectorAll(".part-option").forEach((p) => {
        p.classList.remove("selected");
      });

      backCard.classList.add("selected");

      userChoices.design.jacket["Back"] = item.meshName;

      switchPartMesh("Back", item.meshName);
    });

    mobileBackSlider.appendChild(backCard);
  });

  textureContainer.appendChild(mobileBackSlider);

  setupMobileSlider("#mobileBackSlider");

  const backSlider = horizontalLoop(
    document.querySelectorAll("#mobileBackSlider .part-option"),
    {
      paused: true,
      draggable: true,
      speed: 2,
      snap: 1,
      repeat: -1,
    }
  );
}

function setupMobileSlider(selector) {
  const sliderContainer = document.querySelector(selector);

  if (!sliderContainer) {
    console.error(`Slider container "${selector}" not found.`);
    return;
  }

  const cardsWrapper = sliderContainer.querySelector(".cards-wrapper");

  if (!cardsWrapper) {
    console.error(`"cards-wrapper" not found within "${selector}".`);
    return;
  }

  const cards = gsap.utils.toArray(".card_cardContainer", cardsWrapper);

  if (cards.length === 0) {
    console.error("No cards found within the slider.");
    return;
  }

  const loop = horizontalLoop(cards, {
    paused: true,
    draggable: true,
    speed: 2,
    snap: 1,
    repeat: -1,
  });
}
