import EmailSender from "./emailSender.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("cart update new");
  console.log("I hope plz");
  let mannequinRoot;

  let initialCameraRadius,
    initialCameraTarget,
    initialCameraAlpha,
    initialCameraBeta;
  let textures = {};
  let step = 1;
  let userChoices = {
    texture: null,
    design: { jacket: {}, pants: {} },
    embroidery: {
      jacket: [],
      pants: { location: null, text: "" },
      threadColor: null,
    },
    measurements: {},
  };

  let shirtRoot;
  let material, scene, parentNode, camera;
  let jacketMeshes = [];
  let pantsMeshes = [];
  let mannequinMeshes = [];
  let partMeshes = {};
  let highlightLayer;
  let embroideryContainer = document.getElementById(
    "embroideryLocationsContainer"
  );

  const partOptions = {
    Back: ["4on2_Back_1", "4on2_Back_2", "4on2_Back_3"],
    Lapels: ["4on2_Lapels_1", "4on2_Lapels_2", "4on2_Lapels_3"],
    Pockets: [
      "4on2_pocket_1",
      "4on2_pocket_2",
      "4on2_pocket_3",
      "4on2_pocket_4",
      "4on2_pocket_5",
      "4on2_pocket_6",
      "4on2_pocket_7",
      "4on2_pocket_8",
    ],
  };
  const partOptionsMeshes = {};
  for (let partName in partOptions) {
    partOptionsMeshes[partName] = {};
  }
  const currentPartMeshes = {};
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
  const tooltip = document.getElementById("tooltip");
  let isAccordionSetup = false;
  let isPartSelectionSetup = false;
  let isPantsItemSelectionSetup = false;
  let isEmbroideryChoiceListenerSetup = false;
  let initialRotationY = 0;
  let currentRotationY = 0;
  let currentOrientation = "front";
  function generateSrcSet(filename) {
    const sizes = [256, 512, 1024, 2048];
    // Create a srcset string where each entry points to the resized image.
    return sizes
      .map((size) => `./assets/fabric_resized/${size}/${filename} ${size}w`)
      .join(", ");
  }

  function getAppropriateImageUrl(originalUrl) {
    // Define your available sizes:
    const sizes = [256, 512, 1024, 2048];
    // Determine the desired width (using viewport width and device pixel ratio)
    const desiredWidth = window.innerWidth * (window.devicePixelRatio || 1);
    // Choose the smallest size that is at least as big as desiredWidth.
    let chosenSize = sizes[sizes.length - 1]; // default to largest
    for (let s of sizes) {
      if (s >= desiredWidth) {
        chosenSize = s;
        break;
      }
    }
    // Get the filename (e.g. "A52024006- $850.webp")
    const filename = originalUrl.split("/").pop();
    // Build and return the URL pointing to the resized folder:
    return `./assets/fabric_resized/${chosenSize}/${filename}`;
  }

  function getFabricPrice(filename) {
    const baseName = filename.replace(/\.[^.]+$/, "");

    const match = baseName.match(/-\s*(\$[\d.]+)/);
    if (match) {
      return match[1];
    }

    return "$0.00";
  }

  function selectDefaultJacketParts() {
    const originalZoomToMesh = zoomToMesh;
    zoomToMesh = function (mesh) {
      console.log("Camera zoom disabled for default jacket parts.");
    };

    if (!userChoices.design.jacket["Back"]) {
      userChoices.design.jacket["Back"] = partOptions.Back[0];
      switchPartMesh("Back", partOptions.Back[0]);
    }
    if (!userChoices.design.jacket["Lapels"]) {
      userChoices.design.jacket["Lapels"] = partOptions.Lapels[0];
      switchPartMesh("Lapels", partOptions.Lapels[0]);
    }

    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      if (!userChoices.design.jacket["PocketsTop"]) {
        userChoices.design.jacket["PocketsTop"] = TOP_POCKETS[0];
        switchPartMesh("Pockets", TOP_POCKETS[0], "top");
      }
      if (!userChoices.design.jacket["PocketsBottom"]) {
        userChoices.design.jacket["PocketsBottom"] = BOTTOM_POCKETS[0];
        switchPartMesh("Pockets", BOTTOM_POCKETS[0], "bottom");
      }
    } else {
      if (!userChoices.design.jacket["PocketsTop"]) {
        userChoices.design.jacket["PocketsTop"] = TOP_POCKETS[0];
        const topMesh = partOptionsMeshes.Pockets[TOP_POCKETS[0]];
        if (topMesh) {
          topMesh.setEnabled(true);
          topMesh.renderingGroupId = 2;
          highlightLayer.addMesh(topMesh, BABYLON.Color3.White());
        }
      }
      if (!userChoices.design.jacket["PocketsBottom"]) {
        userChoices.design.jacket["PocketsBottom"] = BOTTOM_POCKETS[0];
        const bottomMesh = partOptionsMeshes.Pockets[BOTTOM_POCKETS[0]];
        if (bottomMesh) {
          bottomMesh.setEnabled(true);
          bottomMesh.renderingGroupId = 2;
          highlightLayer.addMesh(bottomMesh, BABYLON.Color3.White());
        }
      }
    }

    zoomToMesh = originalZoomToMesh;
  }

  function normalizeAngle(angle) {
    return angle % (2 * Math.PI);
  }
  const createScene = () => {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.937, 0.937, 0.937);
    camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      Math.PI / 2,
      5.0,
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    camera.attachControl(canvas, true);

    engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));

    const fxaa = new BABYLON.FxaaPostProcess(
      "fxaa",
      1.0,
      null,
      BABYLON.Texture.BILINEAR_SAMPLINGMODE,
      engine
    );
    scene.postProcesses.push(fxaa);
    if (camera.inputs.attached.touch) {
      camera.inputs.attached.touch.pinchPrecision = 30;

      camera.inputs.attached.touch.touchAngularSensibility = 10000;
    }

    camera.panningSensibility = 0;
    camera.lowerRadiusLimit = 2.5;
    camera.upperRadiusLimit = 20;
    camera.wheelPrecision = 100;
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const directionalLight = new BABYLON.DirectionalLight(
      "dirLight",
      new BABYLON.Vector3(-1, -2, -1),
      scene
    );
    directionalLight.position = new BABYLON.Vector3(20, 40, 20);
    scene.useRightHandedSystem = true;
    material = new BABYLON.StandardMaterial("material", scene);
    parentNode = new BABYLON.TransformNode("parent", scene);
    highlightLayer = new BABYLON.HighlightLayer("hl1", scene);
    let modelsLoaded = 0;
    const modelsToLoad = 4;
    function hideLoader() {
      gsap.to(".loader-tn", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: function () {
          const loader = document.getElementById("loader-top-notch");
          if (loader) {
            loader.style.zIndex = "-1";
          }
        },
      });
    }
    setTimeout(() => {
      console.log("All images have loaded and rendered.");
      hideLoader();
    }, 1000);
    const onModelLoaded = () => {
      modelsLoaded++;

      if (modelsLoaded === modelsToLoad) {
        parentNode.rotation.y = Math.PI / 2;
        initialRotationY = parentNode.rotation.y;
        currentRotationY = initialRotationY;
        currentOrientation = "front";
        applyTexture("./assets/fabric/All Fabrics/A52024006- $850.webp");
        centerModel();
        selectDefaultJacketParts();

        transitionToStep(step);
      }
    };
    function getPartNameFromMeshName(meshName) {
      if (meshName.startsWith("4on2_Back")) {
        return "Back";
      } else if (meshName.startsWith("4on2_Lapels")) {
        return "Lapels";
      } else if (meshName.startsWith("4on2_pocket")) {
        return "Pockets";
      } else {
        return null;
      }
    }
    BABYLON.SceneLoader.ImportMesh("", "./", "jacket.glb", scene, (meshes) => {
      meshes.forEach((mesh) => {
        mesh.material = material;
        mesh.parent = parentNode;
        jacketMeshes.push(mesh);
        mesh.renderingGroupId = 2;
        partMeshes[mesh.name] = mesh;

        let partName = getPartNameFromMeshName(mesh.name);
        if (partName) {
          currentPartMeshes[partName] = mesh;
          partOptionsMeshes[partName][mesh.name] = mesh;
        }

        mesh.actionManager = new BABYLON.ActionManager(scene);

        mesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            function (evt) {
              const partName = getPartNameFromMeshName(mesh.name);
              if (partName && currentPartMeshes[partName]) {
                const currentMesh = currentPartMeshes[partName];
                highlightLayer.addMesh(currentMesh, BABYLON.Color3.White());
                canvas.style.cursor = "pointer";

                tooltip.style.display = "block";
                tooltip.innerHTML = partName;
              }
            }
          )
        );

        mesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            function (evt) {
              const partName = getPartNameFromMeshName(mesh.name);
              if (partName && currentPartMeshes[partName]) {
                const currentMesh = currentPartMeshes[partName];
                highlightLayer.removeMesh(currentMesh);
                canvas.style.cursor = "default";

                tooltip.style.display = "none";
              }
            }
          )
        );

        mesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickDownTrigger,
            function (evt) {
              handlePartSelection(partName, mesh.name);
            }
          )
        );
      });
      onModelLoaded();
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "pants.glb", scene, (meshes) => {
      meshes.forEach((mesh) => {
        mesh.renderingGroupId = 2;
        mesh.material = material;
        mesh.parent = parentNode;
        pantsMeshes.push(mesh);

        partMeshes[mesh.name] = mesh;
      });
      onModelLoaded();
    });

    const mannequinMaterial = new BABYLON.PBRMaterial(
      "mannequinMaterial",
      scene
    );
    mannequinMaterial.albedoColor = new BABYLON.Color3(0.08, 0.08, 0.08);
    mannequinMaterial.metallic = 0;
    mannequinMaterial.roughness = 1;

    const shoeMaterial = new BABYLON.PBRMaterial("shoeMaterial", scene);
    shoeMaterial.albedoColor = new BABYLON.Color3(0, 0, 0);
    shoeMaterial.metallic = 0.5;
    shoeMaterial.roughness = 0.5;

    BABYLON.SceneLoader.ImportMesh(
      "",
      "./",
      "Mannequin.glb",
      scene,
      (meshes) => {
        mannequinRoot = new BABYLON.TransformNode("mannequinRoot", scene);

        meshes.forEach((mesh) => {
          mesh.renderingGroupId = 1;
          console.log("Mesh Name:", mesh.name);
          mesh.parent = mannequinRoot;
          mannequinMeshes.push(mesh);
          mesh.actionManager = null;

          mesh.useVertexColors = false;

          if (mesh.material) {
            mesh.material.dispose();
          }
          mesh.material = null;

          if (
            mesh.name.includes("unamed_unamedmesh_1") ||
            mesh.name.includes("Posed__mask_")
          ) {
            mesh.material = mannequinMaterial;
          } else if (mesh.name === "shoe_L" || mesh.name === "shoe_R") {
            mesh.material = shoeMaterial;
          } else {
          }
        });

        mannequinRoot.parent = parentNode;

        mannequinRoot.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        mannequinRoot.position = new BABYLON.Vector3(0, 0, 0);

        onModelLoaded();

        loadShirtModel();
      }
    );

    function loadShirtModel() {
      if (!shirtRoot) {
        BABYLON.SceneLoader.ImportMesh(
          "",
          "./",
          "shirt.glb",
          scene,
          (meshes) => {
            const shirtMaterial = new BABYLON.StandardMaterial(
              "shirtMaterial",
              scene
            );
            shirtMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
            shirtMaterial.backFaceCulling = false;

            shirtRoot = new BABYLON.TransformNode("shirtRoot", scene);

            const actualShirtMeshes = [];

            meshes.forEach((m) => {
              if (m instanceof BABYLON.Mesh) {
                console.log("[SHIRT LOAD] Found shirt mesh:", m.name);
                actualShirtMeshes.push(m);

                m.material = shirtMaterial;
                m.parent = shirtRoot;
                m.scaling = new BABYLON.Vector3(1, 1, 1);
                m.rotation = new BABYLON.Vector3(0, 0, 0);
                m.position = new BABYLON.Vector3(0, 0, 0);

                if (m.name === "Front_1") {
                  m.renderingGroupId = 2;
                } else if (m.name == "2_Button") {
                  m.renderingGroupId = 2;
                } else {
                  m.renderingGroupId = 1;
                }
              }
            });

            shirtRoot.parent = mannequinRoot;
            shirtRoot.scaling = new BABYLON.Vector3(1, 1, 0.9);
            shirtRoot.position = new BABYLON.Vector3(0, 0, 0);

            initialRotationY = shirtRoot.rotation.y;
            currentRotationY = initialRotationY;
            currentOrientation = "front";

            const keepThese = [
              "1_pleat",
              "2_Button",
              "Round_Cuffs",
              "Front_1",
              "Sleeves",
            ];

            actualShirtMeshes.forEach((mesh) => {
              if (keepThese.includes(mesh.name)) {
                mesh.setEnabled(true);

                highlightLayer.addMesh(mesh, BABYLON.Color3.White());
              } else {
                mesh.setEnabled(false);
              }
            });

            onModelLoaded();
          }
        );
      } else {
        shirtRoot.setEnabled(true);
        console.log("Shirt already loaded. Ensured it is visible.");
      }
    }

    for (let partName in partOptions) {
      let meshNames = partOptions[partName];
      meshNames.forEach((meshName) => {
        if (partOptionsMeshes[partName][meshName]) {
          return;
        }
        let fileName = meshName + ".glb";
        BABYLON.SceneLoader.ImportMesh(
          "",
          "./jacket-seperate-pieces/",
          fileName,
          scene,
          (meshes) => {
            meshes.forEach((mesh) => {
              mesh.material = material;
              mesh.parent = parentNode;
              partOptionsMeshes[partName][meshName] = mesh;

              partMeshes[mesh.name] = mesh;

              mesh.setEnabled(false);

              mesh.actionManager = new BABYLON.ActionManager(scene);

              mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                  BABYLON.ActionManager.OnPickDownTrigger,
                  function (evt) {
                    handlePartSelection(partName, mesh.name);
                  }
                )
              );
            });
          }
        );
      });
    }

    scene.onPointerDown = function (evt, pickResult) {
      if (!pickResult.hit) {
        highlightLayer.removeAllMeshes();

        document
          .querySelectorAll(".part-item")
          .forEach((item) => item.classList.remove("selected"));
      }
    };

    scene.onPointerMove = function (evt, pickResult) {
      if (tooltip.style.display === "block") {
        tooltip.style.left = evt.clientX + 10 + "px";
        tooltip.style.top = evt.clientY + 10 + "px";
        tooltip.style.zIndex = 999;
      }
    };

    scene.registerBeforeRender(() => {
      const alpha = normalizeAngle(camera.alpha);
      if (alpha < Math.PI / 4 || alpha > (7 * Math.PI) / 4) {
        if (currentOrientation !== "front") {
          currentOrientation = "front";
          console.log("Orientation changed to Front");
        }
      } else if (alpha > (3 * Math.PI) / 4 && alpha < (5 * Math.PI) / 4) {
        if (currentOrientation !== "back") {
          currentOrientation = "back";
          console.log("Orientation changed to Back");
        }
      }
    });

    return scene;
  };

  scene = createScene();
  engine.runRenderLoop(() => scene && scene.render());
  window.addEventListener("resize", () => engine.resize());

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
    camera.upperRadiusLimit = initialCameraRadius;
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
    const fps = 60;
    const durationSeconds = 4.0;
    const totalFrames = durationSeconds * fps;
    scene.stopAnimation(camera);
    const radiusAnim = new BABYLON.Animation(
      "cameraRadiusAnim",
      "radius",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const radiusKeys = [
      { frame: 0, value: camera.radius },
      { frame: totalFrames, value: radius },
    ];
    radiusAnim.setKeys(radiusKeys);
    radiusAnim.setEasingFunction(new BABYLON.CubicEase());
    radiusAnim
      .getEasingFunction()
      .setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    const targetXAnim = new BABYLON.Animation(
      "cameraTargetXAnim",
      "target.x",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const targetYAnim = new BABYLON.Animation(
      "cameraTargetYAnim",
      "target.y",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const targetZAnim = new BABYLON.Animation(
      "cameraTargetZAnim",
      "target.z",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const targetXKeys = [
      { frame: 0, value: camera.target.x },
      { frame: totalFrames, value: meshCenter.x },
    ];
    const targetYKeys = [
      { frame: 0, value: camera.target.y },
      { frame: totalFrames, value: meshCenter.y },
    ];
    const targetZKeys = [
      { frame: 0, value: camera.target.z },
      { frame: totalFrames, value: meshCenter.z },
    ];
    targetXAnim.setKeys(targetXKeys);
    targetYAnim.setKeys(targetYKeys);
    targetZAnim.setKeys(targetZKeys);
    const cubicEase = new BABYLON.CubicEase();
    cubicEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    targetXAnim.setEasingFunction(cubicEase);
    targetYAnim.setEasingFunction(cubicEase);
    targetZAnim.setEasingFunction(cubicEase);
    camera.animations = [];
    camera.animations.push(radiusAnim, targetXAnim, targetYAnim, targetZAnim);
    scene.beginAnimation(camera, 0, totalFrames, false, 1, () => {
      console.log(`Camera smoothly zoomed to mesh: ${mesh.name}`);
    });
  }

  function handlePartSelection(partName, meshName) {
    switchPartMesh(partName, meshName);
  }

  function createMobileJacketPartCard(partName) {
    if (partName === "Back") {
      return `
    <div class="card_cardContainer" data-test-id="${partName}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- Back Design Images (Assuming 4 options) -->
        <img loading="lazy" class="card_cardImage image-jacket-back"  src="./assets/jacket/back/jacketback.png" alt="Classic Back">
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
        <img loading="lazy" class="card_cardImage image-jacket-lapels"  src="./assets/jacket/lapel/jacketlapel.png" alt="Classic Lapel">
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
        <img loading="lazy" class="card_cardImage image-jacket-pockets"  src="./assets/jacket/pockets/jacketpockets.png" alt="Single Pocket">
        <div class="card_itemAmountContainer" data-test-id="item-amount">8</div>
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
        <img loading="lazy" class="card_cardImage image-pants-cut"  src="./assets/pants/cut/cut1.png" alt="Extra Slim">
        <img loading="lazy" class="card_cardImage image-pants-cut"  src="./assets/pants/cut/cut2.png" alt="Slim">
        <img loading="lazy" class="card_cardImage image-pants-cut"  src="./assets/pants/cut/cut3.png" alt="Straight">
        <img loading="lazy" class="card_cardImage image-pants-cut"  src="./assets/pants/cut/cut4.png" alt="Classic">
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
        <img loading="lazy" class="card_cardImage image-pants-pleat"  src="./assets/pants/pleat/pleat1.png" alt="Pleat 1">
        <img loading="lazy" class="card_cardImage image-pants-pleat"  src="./assets/pants/pleat/pleat2.png" alt="Pleat 2">
        <img loading="lazy" class="card_cardImage image-pants-pleat"  src="./assets/pants/pleat/pleat3.png" alt="Pleat 3">
        <img loading="lazy" class="card_cardImage image-pants-pleat"  src="./assets/pants/pleat/pleat4.png" alt="Pleat 4">
 
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
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5101-38.webp" alt="E5101-38">
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5102-38.webp" alt="E5102-38">
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5103-38.webp" alt="E5103-38">
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5104-38.webp" alt="E5104-38">
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
  function resetCameraBack() {
    if (
      initialCameraRadius === undefined ||
      initialCameraTarget === undefined ||
      initialCameraAlpha === undefined ||
      initialCameraBeta === undefined
    ) {
      console.error("Initial camera parameters are not set.");
      return;
    }

    let deltaRotation = parentNode.rotation.y - initialRotationY;

    let desiredAlpha = initialCameraAlpha + Math.PI - deltaRotation;
    desiredAlpha = desiredAlpha % (2 * Math.PI);

    BABYLON.Animation.CreateAndStartAnimation(
      "cameraRadiusResetBack",
      camera,
      "radius",
      60,
      120,
      camera.radius,
      initialCameraRadius,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    BABYLON.Animation.CreateAndStartAnimation(
      "cameraTargetResetBack",
      camera,
      "target",
      60,
      120,
      camera.target,
      initialCameraTarget,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    BABYLON.Animation.CreateAndStartAnimation(
      "cameraAlphaResetBack",
      camera,
      "alpha",
      60,
      120,
      camera.alpha,
      desiredAlpha,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    BABYLON.Animation.CreateAndStartAnimation(
      "cameraBetaResetBack",
      camera,
      "beta",
      60,
      120,
      camera.beta,
      initialCameraBeta,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    console.log("Camera reset to back view (with model rotation offset).");
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

    let deltaRotation = parentNode.rotation.y - initialRotationY;

    let desiredAlpha = (initialCameraAlpha - deltaRotation) % (2 * Math.PI);

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
      desiredAlpha,
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

    console.log(
      "Camera reset to initial relative view (adjusted for model rotation)."
    );
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
        resetCamera();
        step = 2;
        transitionToStep(step);
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
    console.log(
      "[showMobileLapelsOptions] Displaying lapels design options..."
    );
    const textureContainer = document.getElementById("textureContainer");
    textureContainer.innerHTML = "";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm  ";
    confirmButton.classList.add("back-to-cat");
    confirmButton.addEventListener("click", () => {
      console.log("[showMobileLapelsOptions] Confirm clicked => returning");
      showJacketDesignOptions();
    });
    textureContainer.appendChild(confirmButton);

    const lapelsDesigns = [
      {
        src: "./assets/jacket/lapel/jacketlapel.png",
        label: "Classic Lapel",
        meshName: "4on2_Lapels_1",
      },
      {
        src: "./assets/jacket/lapel/jacketlapel.png",
        label: "Slim Lapel",
        meshName: "4on2_Lapels_2",
      },
      {
        src: "./assets/jacket/lapel/jacketlapel.png",
        label: "Wide Lapel",
        meshName: "4on2_Lapels_3",
      },
    ];

    const mobileLapelsSlider = document.createElement("div");
    mobileLapelsSlider.id = "mobileLapelsSlider";
    mobileLapelsSlider.classList.add("cards-wrapper");

    const mobileLapelsSliderWrapper = document.createElement("div");
    mobileLapelsSliderWrapper.classList.add("cards-wrapper");

    lapelsDesigns.forEach((item) => {
      const lapelCard = document.createElement("div");
      lapelCard.classList.add("part-option", "card_cardContainer");
      lapelCard.setAttribute("data-part-name", "Lapels");
      lapelCard.setAttribute("data-mesh-name", item.meshName);
      lapelCard.style.touchAction = "pan-y";
      lapelCard.style.cursor = "pointer";

      if (userChoices.design.jacket.Lapels === item.meshName) {
        lapelCard.classList.add("selected");
      }

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

      lapelCard.appendChild(imgWrapper);
      lapelCard.appendChild(pEl);

      lapelCard.addEventListener("click", () => {
        console.log(
          "[showMobileLapelsOptions] Chosen lapels option:",
          item.label
        );

        mobileLapelsSliderWrapper
          .querySelectorAll(".part-option")
          .forEach((p) => {
            p.classList.remove("selected");
          });

        lapelCard.classList.add("selected");
        userChoices.design.jacket.Lapels = item.meshName;
        switchPartMesh("Lapels", item.meshName);
        resetCamera();
      });

      mobileLapelsSliderWrapper.appendChild(lapelCard);
    });

    mobileLapelsSlider.appendChild(mobileLapelsSliderWrapper);
    textureContainer.appendChild(mobileLapelsSlider);
  }

  function showMobileBackOptions() {
    console.log("[showMobileBackOptions] Displaying back view options...");
    const textureContainer = document.getElementById("textureContainer");
    textureContainer.innerHTML = "";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm  ";
    confirmButton.classList.add("back-to-cat");
    confirmButton.addEventListener("click", () => {
      console.log(
        "[showMobileBackOptions] Confirm button clicked => returning"
      );
      showJacketDesignOptions();
    });
    textureContainer.appendChild(confirmButton);

    const backViewOptions = [
      {
        src: "./assets/jacket/back/jacketback.png",
        label: "Back Option 1",
        meshName: "4on2_Back_1",
      },
      {
        src: "./assets/jacket/back/jacketback.png",
        label: "Back Option 2",
        meshName: "4on2_Back_2",
      },
      {
        src: "./assets/jacket/back/jacketback.png",
        label: "Back Option 3",
        meshName: "4on2_Back_3",
      },
    ];

    const mobileBackSlider = document.createElement("div");
    mobileBackSlider.id = "mobileBackSlider";
    mobileBackSlider.classList.add("cards-wrapper");

    backViewOptions.forEach((item) => {
      const backCard = document.createElement("div");
      backCard.classList.add("part-option");
      backCard.setAttribute("data-part-name", "Back");
      backCard.setAttribute("data-mesh-name", item.meshName);
      backCard.style.touchAction = "pan-y";
      backCard.style.cursor = "pointer";

      if (userChoices.design.jacket["Back"] === item.meshName) {
        backCard.classList.add("selected");
      }

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

    const cards = gsap.utils.toArray(
      ".part-option.card_cardContainer",
      cardsWrapper
    );

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

    cardsWrapper.dataset.sliderInitialized = "true";
  }

  function showMobilePocketsOptions() {
    console.log(
      "[showMobilePocketsOptions] Displaying pocket design options..."
    );
    const textureContainer = document.getElementById("textureContainer");
    textureContainer.innerHTML = "";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.classList.add("back-to-cat");
    confirmButton.addEventListener("click", () => {
      console.log(
        "[showMobilePocketsOptions] Confirm button clicked => returning"
      );
      showJacketDesignOptions();
    });
    textureContainer.appendChild(confirmButton);

    const tbBtnWrapper = document.createElement("div");
    tbBtnWrapper.classList.add("top-bottom-pockets-wrapper");

    const topPctsBtn = document.createElement("button");
    topPctsBtn.textContent = "Top Pockets";
    topPctsBtn.classList.add("top-bottom-btns");
    topPctsBtn.addEventListener("click", () => {
      console.log("Top pockets button clicked");
      renderMobilePocketsOptions("top");
    });

    const bottomPctsBtn = document.createElement("button");
    bottomPctsBtn.textContent = "Bottom Pockets";
    bottomPctsBtn.classList.add("top-bottom-btns");
    bottomPctsBtn.addEventListener("click", () => {
      console.log("Bottom pockets button clicked");
      renderMobilePocketsOptions("bottom");
    });

    tbBtnWrapper.appendChild(topPctsBtn);
    tbBtnWrapper.appendChild(bottomPctsBtn);
    textureContainer.appendChild(tbBtnWrapper);

    let pocketsParent = document.getElementById("mobilePocketsContainer");
    if (!pocketsParent) {
      pocketsParent = document.createElement("div");
      pocketsParent.id = "mobilePocketsContainer";
      textureContainer.appendChild(pocketsParent);
    } else {
      pocketsParent.innerHTML = "";
    }

    renderMobilePocketsOptions("top");
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
    const embroideryChoices = document.getElementById("embroideryChoices");

    const allButtons = [locationButton, colorButton, charactersButton];

    function activateButton(clickedButton) {
      allButtons.forEach((btn) => btn?.classList.remove("active"));
      clickedButton.classList.add("active");
    }

    if (locationButton) {
      locationButton.addEventListener("click", () => {
        activateButton(locationButton);
        const colorChoices = document.getElementById("colorChoices");
        const charactersPanel = document.querySelector(".characters-inputs");
        if (embroideryChoices) embroideryChoices.classList.remove("hidden");
        if (colorChoices) colorChoices.classList.add("hidden");
        if (charactersPanel) charactersPanel.style.display = "none";
        event.stopPropagation();
      });
    }

    if (colorButton) {
      colorButton.addEventListener("click", () => {
        activateButton(colorButton);
        const colorChoices = document.getElementById("colorChoices");
        const charactersPanel = document.querySelector(".characters-inputs");
        if (embroideryChoices) embroideryChoices.classList.add("hidden");
        if (colorChoices) colorChoices.classList.remove("hidden");
        if (charactersPanel) charactersPanel.style.display = "none";
        event.stopPropagation();
      });
    }

    if (charactersButton) {
      charactersButton.addEventListener("click", () => {
        activateButton(charactersButton);
        if (embroideryChoices) embroideryChoices.classList.add("hidden");
        const colorChoices = document.getElementById("colorChoices");
        if (colorChoices) colorChoices.classList.add("hidden");

        const chosenLocations = userChoices.embroidery.jacket;
        if (chosenLocations.length === 0) {
          alert("No embroidery locations chosen.");
          return;
        }

        renderCharactersPanel();
        const panel = document.querySelector(".characters-inputs");
        if (panel) {
          panel.style.display = "block";
        }
        event.stopPropagation();
      });
    }

    const colorChoices = document.getElementById("colorChoices");
    if (colorChoices) {
      const colorOptions = colorChoices.querySelectorAll(".color-option");
      colorOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          colorOptions.forEach((opt) => opt.classList.remove("selected"));

          option.classList.add("selected");

          const chosenColor = option.getAttribute("data-color");

          userChoices.embroidery.threadColor = chosenColor;

          if (
            userChoices.embroidery.jacket &&
            userChoices.embroidery.jacket.length > 0
          ) {
            userChoices.embroidery.jacket.forEach((emb) => {
              emb.color = chosenColor;
            });
          }
          console.log("Mobile embroidery thread color selected:", chosenColor);
          e.stopPropagation();
        });
      });
    }

    if (!window.matchMedia("(max-width: 1024.9px)").matches) {
      document.addEventListener("click", (evt) => {
        let embroideryContainer = document.getElementById(
          "embroideryLocationsContainer"
        );
        if (!embroideryContainer) {
          console.error(
            "Element with ID 'embroideryLocationsContainer' not found."
          );
          return;
        }
        const clickedInsideContainer =
          embroideryContainer.contains(evt.target) ||
          (locationButton && locationButton.contains(evt.target)) ||
          (colorButton && colorButton.contains(evt.target)) ||
          (charactersButton && charactersButton.contains(evt.target));

        if (!clickedInsideContainer) {
          embroideryChoices.classList.add("hidden");
          const colorChoices = document.getElementById("colorChoices");
          if (colorChoices) colorChoices.classList.add("hidden");
        }
      });
    }
  }

  function updateStepClass(currentStep) {
    const isMobile = window.matchMedia("(max-width: 1024.9px)").matches;
    if (!isMobile) return;

    const textureContainer = document.getElementById("textureContainer");
    if (!textureContainer) {
      console.error("Element with ID 'textureContainer' not found.");
      return;
    }

    const stepClasses = ["step-1", "step-2", "step-3", "step-4", "step-5"];

    textureContainer.classList.remove(...stepClasses);

    if (currentStep >= 1 && currentStep <= 5) {
      textureContainer.classList.add(`step-${currentStep}`);
      console.log(`Added class: step-${currentStep}`);
    } else {
      console.warn(
        `Invalid step number: ${currentStep}. Must be between 1 and 5.`
      );
    }
  }

  function wrapSidePanelContent(step) {
    const sidePanel = document.getElementById("sidePanel");
    if (!sidePanel) return;

    // Remove any previous wrapper with class "widescreen-step"
    const existingWrapper = sidePanel.querySelector(".widescreen-step");
    if (existingWrapper) {
      while (existingWrapper.firstChild) {
        sidePanel.insertBefore(existingWrapper.firstChild, existingWrapper);
      }
      existingWrapper.remove();
    }

    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      // On mobile, wrap only the content except the next/back buttons
      const wrapper = document.createElement("div");
      wrapper.classList.add(`step-${step}-ws`, "widescreen-step");

      // Select all children that are not the next/back buttons container.
      // (Assumes that container has a class "next-back-btns")
      Array.from(sidePanel.children).forEach((child) => {
        if (!child.classList.contains("next-back-btns")) {
          wrapper.appendChild(child);
        }
      });
      // Insert the wrapper at the beginning so that the next/back buttons remain separate.
      sidePanel.insertBefore(wrapper, sidePanel.firstChild);
    } else {
      // On desktop, wrap everything
      const wrapper = document.createElement("div");
      wrapper.classList.add(`step-${step}-ws`, "widescreen-step");
      while (sidePanel.firstChild) {
        wrapper.appendChild(sidePanel.firstChild);
      }
      sidePanel.appendChild(wrapper);
    }
  }

  function transitionToStep(newStep) {
    const sidePanel = document.getElementById("sidePanel");

    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      const currentWrapper = sidePanel.querySelector(".widescreen-step");
      if (currentWrapper) {
        gsap.to(currentWrapper, {
          y: window.innerHeight,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            initializeStep(newStep);

            const newWrapper = sidePanel.querySelector(".widescreen-step");
            if (newWrapper) {
              gsap.set(newWrapper, { y: -window.innerHeight });

              gsap.to(newWrapper, {
                y: 0,
                duration: 0.8,
                ease: "power2.out",
              });
            }
          },
        });
      } else {
        initializeStep(newStep);
      }
    } else {
      const currentWrapper = sidePanel.querySelector(".widescreen-step");
      if (currentWrapper) {
        gsap.to(currentWrapper, {
          x: window.innerWidth,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            initializeStep(newStep);
            const newWrapper = sidePanel.querySelector(".widescreen-step");
            if (newWrapper) {
              gsap.set(newWrapper, { x: window.innerWidth });
              gsap.to(newWrapper, {
                x: 0,
                duration: 0.8,
                ease: "power2.out",
              });
            }
          },
        });
      } else {
        initializeStep(newStep);
      }
    }
  }

  function initializeStep(currentStep) {
    updateStepClass(currentStep);
    const stepTitle = document.getElementById("stepTitle");
    const textureContainer = document.getElementById("textureContainer");
    const batchSelector = document.getElementById("batchSelector");

    const existingBackButton = document.querySelector(
      "#sidePanel .back-button"
    );
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
        loadJacketBasedOnUserChoices();
        initializeTextureButtons();
        textureContainer.style.display = "flex";
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
                  <img loading="lazy" class="card_cardImage"  src="./assets/jacketandpants/jacket.png" alt="Jacket">
                  <div class="card_itemAmountContainer" data-test-id="item-amount">Jacket</div>
                </div>
                <div class="card_cardDetails">
                  <p class="card_cardText" data-test-id="card-text">Design Jacket</p>
                </div>
              </div>
              <div class="card_cardContainer" data-test-id="choosePants" tabindex="0">
                <div class="card_cardImageContainer">
                  <img loading="lazy" class="card_cardImage"  src="assets/jacketandpants/pant.png" alt="Pants">
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

                { partName: "Lapels", options: partOptions["Lapels"] },
                { partName: "Pockets", options: partOptions["Pockets"] },
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
                <div id="pantsCutContainer" style="display: flex; flex-wrap: wrap;">
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut1.png" alt="Extra Slim">
                    <p>Extra Slim</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut2.png" alt="Slim">
                    <p>Slim</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut3.png" alt="Straight">
                    <p>Straight</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut4.png" alt="Classic">
                    <p>Classic</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut5.png" alt="Relaxed Fit">
                    <p>Relaxed Fit</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut6.png" alt="Tapered Leg">
                    <p>Tapered Leg</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut7.png" alt="Flat Front">
                    <p>Flat Front</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut8.png" alt="Pleated Front">
                    <p>Pleated Front</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut9.png" alt="High waist">
                    <p>High waist</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/cut/cut10.png" alt="Low rise">
                    <p>Low rise</p>
                  </div>
                </div>
              </div>

              <button class="sub_accordion" data-category="pleat">
                Pleat <span class="sign-acc">+</span>
              </button>
              <div class="sub_panel">
                 <div id="pantsCutContainer" style="display: flex; flex-wrap: wrap;">
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/pleat/pleat1.png" alt="pleat">
                    <p>pleat</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/pleat/pleat2.png" alt="pleat">
                    <p>pleat</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/pleat/pleat3.png" alt="pleat">
                    <p>pleat</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/pleat/pleat4.png" alt="pleat">
                    <p>pleat</p>
                  </div>
                  <div class="pants-item">
                    <img loading="lazy" src="./assets/pants/pleat/pleat5.png" alt="pleat">
                    <p>pleat</p>
                  </div>
                </div>
              </div>
            </div>
          `;
          setupPartHoverHighlight();
        }

        break;

      case 3:
        stepTitle.innerHTML = `
        <p>Now it’s time to add a personal touch to your garment!</p>
        <p>You can customize your suit with embroidery. Please select your preferred locations for the embroidery or choose "No Embroidery" to skip.</p>
      `;

        const isMobile = window.matchMedia("(max-width: 1024.9px)").matches;

        let embroideryHTML = `
        <h2 class="text-step3">Jacket Embroidery Locations</h2>
        <div id="embroideryLocationsContainer">
          <!-- Embroidery Choices -->
          <div class="choice-container-step3" id="embroideryChoices">
            <div class="jacket-embroidery-choice">
              <img loading="lazy" src="./assets/embroidery/behind-your-lapel.png" alt="Inner right chest pocket"/>
              <p>Inner right chest pocket</p>
            </div>
            <div class="jacket-embroidery-choice">
              <img loading="lazy" src="./assets/embroidery/inner-left-embroidery.png" alt="Inner left chest pocket"/>
              <p>Inner left chest pocket</p>
            </div>
            <div class="jacket-embroidery-choice">
              <img loading="lazy" src="./assets/embroidery/inner-right-embroidery.png" alt="Under the collar flap"/>
              <p>Under the collar flap</p>
            </div>
            <!-- "No Embroidery" Option -->
            <div class="jacket-embroidery-choice no-embroidery">
              <img loading="lazy" src="./assets/rectangle_115.webp" alt="No Embroidery"/>
              <p>No Embroidery</p>
            </div>
          </div>
      `;

        if (isMobile) {
          embroideryHTML += `
          <!-- Color Choices (created only on mobile) -->
          <div class="color-options hidden" id="colorChoices">
          <span class="mobile-colors">
            <button class="color-option" data-color="#FF0000" style="background-color: #7A1313;"></button>
          </span>
          <span class="mobile-colors">
            <button class="color-option" data-color="#00FF00" style="background-color: #000000;"></button>
          </span>
          <span class="mobile-colors">
            <button class="color-option" data-color="#0000FF" style="background-color: #FFFFFF;"></button>
          </span>
          </div>
        `;
        }

        embroideryHTML += `</div>`;

        if (isMobile) {
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

        break;

      case 4:
        if (window.matchMedia("(max-width: 1024.9px)").matches) {
          step = 5;
          transitionToStep(step);
          return;
        }
        if (
          !userChoices.embroidery.jacket ||
          userChoices.embroidery.jacket.length === 0
        ) {
          step = 5;
          transitionToStep(step);
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
            <button class="remove-embroidery-button" data-index="${index}"><svg class="remove-emb"xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat">
  <path d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z"/>
</svg></button>
            <div class="embroidery-color-and-text">
              <div class="jacket-embroidery-choice">
                <img loading="lazy" class="embroidery-image" src="./assets/rectangle_115.webp" alt="${
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
              userChoices.embroidery.jacket[index].text =
                textInput.value.trim();
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

        break;

      case 5:
        // Hide the canvas on step 5
        document.querySelector(
          "body > main > div > div.canvas-container"
        ).style.display = "none";

        stepTitle.innerHTML = `
        <p>Please provide your measurements for the pants.</p>
        <p>Enter your measurements in the fields provided. If you need assistance, refer to the diagram.</p>
      `;
        batchSelector.style.display = "none";
        textureContainer.style.display = "flex";
        textureContainer.style.padding = "0 20px";
        textureContainer.style.justifyContent = "center";

        textureContainer.innerHTML = `
        <div id="pantsMeasurementWrapper">
          <img loading="lazy" id="pantsMeasurementImage" src="assets/pants/pants.png" alt="Pants Diagram">
          ${generatePantsMeasurementInputs()}
        </div>
      `;

        const pantsMeasurementWrapper = document.getElementById(
          "pantsMeasurementWrapper"
        );
        pantsMeasurementWrapper.style.position = "relative";
        pantsMeasurementWrapper.style.display = "inline-block";

        setupPantsMeasurementListeners();

        // Change the Next button text to "Finish"
        document.getElementById("nextButton").textContent = "Finish";
        break;

      default:
        canvas.style.display = "block";
        console.log("Invalid step");
        break;
    }
    wrapSidePanelContent(currentStep);
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
      <div class="color-circle ${
        userChoices.embroidery.threadColor === color ? "selected" : ""
      }" 
           data-color="${color}" 
           style="background-color: ${color};">
      </div>
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

  function generatePartItems(parts) {
    return parts
      .map((part) => {
        if (part.partName === "Pockets") {
          const topPockets = part.options.filter((meshName) =>
            ["4on2_pocket_4", "4on2_pocket_5", "4on2_pocket_6"].includes(
              meshName
            )
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
  function showFabricItems(categoryKey, subCategoryKey, folderPath, fileNames) {
    const textureContainer = document.getElementById("textureContainer");
    textureContainer.innerHTML = "";

    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.classList.add("back-to-cat");
    backButton.addEventListener("click", () => {
      if (subCategoryKey) {
        showSubCategories(categoryKey);
      } else {
        initializeTextureButtons();
      }
    });
    textureContainer.appendChild(backButton);

    const cardsWrapper = document.createElement("div");
    cardsWrapper.className = "cards-wrapper";

    fileNames.forEach((item, index) => {
      const fabricCard = createFabricCard(categoryKey, item, index, folderPath);
      cardsWrapper.appendChild(fabricCard);
    });

    textureContainer.appendChild(cardsWrapper);

    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      initializeCardsSlider();
    }
  }

  function createSubCategoryCard(
    categoryKey,
    subCategoryKey,
    fileNames,
    index
  ) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card_cardContainer";
    cardContainer.dataset.testId = subCategoryKey;
    cardContainer.tabIndex = index + 1;
    cardContainer.style.cssText =
      "translate: none; rotate: none; scale: none; transform: translate(0px, 0px); touch-action: pan-y;";

    const imageContainer = document.createElement("div");
    imageContainer.className = "card_cardImageContainer";
    imageContainer.style.touchAction = "pan-y;";

    const imagesToShow = fileNames.slice(0, 4);
    imagesToShow.forEach((item) => {
      const img = document.createElement("img");
      img.className = "card_cardImage";
      img.loading = "lazy";
      const folderPath = `./assets/fabric/${categoryKey}/${subCategoryKey}/`;
      img.src = folderPath + item;
      img.alt = item;
      img.style.touchAction = "pan-y;";
      imageContainer.appendChild(img);
    });
    const itemAmountContainer = document.createElement("div");
    itemAmountContainer.className = "card_itemAmountContainer";
    itemAmountContainer.dataset.testId = "item-amount";
    itemAmountContainer.style.touchAction = "pan-y;";
    itemAmountContainer.textContent = fileNames.length;
    imageContainer.appendChild(itemAmountContainer);

    cardContainer.appendChild(imageContainer);

    const cardDetails = document.createElement("div");
    cardDetails.className = "card_cardDetails";
    cardDetails.style.touchAction = "pan-y;";
    const cardText = document.createElement("p");
    cardText.className = "card_cardText";
    cardText.dataset.testId = "card-text";
    cardText.style.touchAction = "pan-y;";
    cardText.textContent = subCategoryKey;
    cardDetails.appendChild(cardText);
    cardContainer.appendChild(cardDetails);

    const arrowIcon = document.createElement("div");
    arrowIcon.className = "card_arrowIcon";
    arrowIcon.style.touchAction = "pan-y;";
    arrowIcon.innerHTML = `<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 330 330" width="30" height="30" style="touch-action: pan-y;">
    <path d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
       c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394
       c-5.857,5.858-5.857,15.355,0.001,21.213  
       C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
       l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
       C255,161.018,253.42,157.202,250.606,154.389z" style="touch-action: pan-y;"></path>
  </svg>`;
    cardContainer.appendChild(arrowIcon);

    cardContainer.addEventListener("click", () => {
      const folderPath = `./assets/fabric/${categoryKey}/${subCategoryKey}/`;
      showFabricItems(categoryKey, subCategoryKey, folderPath, fileNames);
    });

    return cardContainer;
  }

  function showSubCategories(categoryKey) {
    const textureContainer = document.getElementById("textureContainer");
    textureContainer.innerHTML = "";

    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.classList.add("back-to-cat");
    backButton.addEventListener("click", () => {
      initializeTextureButtons();
    });
    textureContainer.appendChild(backButton);

    const categoryData = textures[categoryKey];

    if (Array.isArray(categoryData)) {
      const folderPath = `./assets/fabric/All Fabrics/`;
      showFabricItems(categoryKey, null, folderPath, categoryData);
    } else {
      let cardsWrapper;

      if (
        window.matchMedia("(max-width: 1024.9px)").matches &&
        (categoryKey === "Colour" || categoryKey === "Design")
      ) {
        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("cards-wrapper");
        cardsWrapper = document.createElement("div");
        cardsWrapper.classList.add("cards-wrapper");
        sliderContainer.appendChild(cardsWrapper);
        textureContainer.appendChild(sliderContainer);
      } else {
        cardsWrapper = document.createElement("div");
        cardsWrapper.className = "cards-wrapper";
        textureContainer.appendChild(cardsWrapper);
      }

      Object.keys(categoryData).forEach((subCategoryKey, index) => {
        const fileNames = categoryData[subCategoryKey];
        const card = createSubCategoryCard(
          categoryKey,
          subCategoryKey,
          fileNames,
          index
        );
        cardsWrapper.appendChild(card);
      });

      if (
        window.matchMedia("(max-width: 1024.9px)").matches &&
        (categoryKey === "Colour" || categoryKey === "Design")
      ) {
        initializeCardsSlider();
      }
    }
  }

  function createTopLevelCategoryCard(categoryKey, index) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card_cardContainer";
    cardContainer.dataset.testId = categoryKey;
    cardContainer.tabIndex = index + 1;

    cardContainer.style.cssText =
      "translate: none; rotate: none; scale: none; transform: translate(0px, 0px); touch-action: pan-y;";

    const imageContainer = document.createElement("div");
    imageContainer.className = "card_cardImageContainer";
    imageContainer.style.touchAction = "pan-y;";

    let images = [];
    let count = 0;
    const categoryData = textures[categoryKey];
    if (Array.isArray(categoryData)) {
      images = categoryData.slice(0, 4);
      count = categoryData.length;
    } else {
      const subKeys = Object.keys(categoryData);
      if (subKeys.length > 0) {
        images = categoryData[subKeys[0]].slice(0, 4);
        count = categoryData[subKeys[0]].length;
      }
    }

    let folderPath = "";
    if (categoryKey === "All Fabrics") {
      folderPath = "./assets/fabric/All Fabrics/";
    } else if (categoryKey === "Colour") {
      folderPath = "./assets/fabric/Colour/Beige/";
    } else if (categoryKey === "Design") {
      folderPath = "./assets/fabric/Design/Birdseye/";
    } else if (categoryKey === "Event") {
      folderPath = "./assets/fabric/Event/Business/";
    } else {
      folderPath = "./assets/fabric/All Fabrics/";
    }
    images.forEach((imgName) => {
      const img = document.createElement("img");
      img.className = "card_cardImage";
      img.loading = "lazy";
      img.src = folderPath + imgName;
      img.alt = imgName;
      img.style.touchAction = "pan-y;";
      imageContainer.appendChild(img);
    });

    const itemAmountContainer = document.createElement("div");
    itemAmountContainer.className = "card_itemAmountContainer";
    itemAmountContainer.dataset.testId = "item-amount";
    itemAmountContainer.style.touchAction = "pan-y;";
    itemAmountContainer.textContent = count;
    imageContainer.appendChild(itemAmountContainer);

    cardContainer.appendChild(imageContainer);

    const cardDetails = document.createElement("div");
    cardDetails.className = "card_cardDetails";
    cardDetails.style.touchAction = "pan-y;";
    const cardText = document.createElement("p");
    cardText.className = "card_cardText";
    cardText.dataset.testId = "card-text";
    cardText.style.touchAction = "pan-y;";
    cardText.textContent = categoryKey;
    cardDetails.appendChild(cardText);
    cardContainer.appendChild(cardDetails);

    const arrowIcon = document.createElement("div");
    arrowIcon.className = "card_arrowIcon";
    arrowIcon.style.touchAction = "pan-y;";
    arrowIcon.innerHTML = `<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 330 330" width="30" height="30" style="touch-action: pan-y;">
    <path d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
       c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394
       c-5.857,5.858-5.857,15.355,0.001,21.213  
       C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
       l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
       C255,161.018,253.42,157.202,250.606,154.389z" style="touch-action: pan-y;"></path>
  </svg>`;
    cardContainer.appendChild(arrowIcon);

    cardContainer.addEventListener("click", () => {
      showSubCategories(categoryKey);
    });

    return cardContainer;
  }

  function initializeTextureButtons() {
    const textureContainer = document.getElementById("textureContainer");
    textureContainer.innerHTML = "";

    const cardsWrapper = document.createElement("div");
    cardsWrapper.className = "cards-wrapper";

    Object.keys(textures).forEach((categoryKey, index) => {
      const card = createTopLevelCategoryCard(categoryKey, index);
      cardsWrapper.appendChild(card);
    });

    textureContainer.appendChild(cardsWrapper);

    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      initializeCardsSlider();
    }
  }

  function createFabricCard(categoryKey, item, index, folderPath) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card_cardContainer card_small";
    cardContainer.dataset.testId = index;
    cardContainer.tabIndex = index + 1;

    const imageContainer = document.createElement("div");
    imageContainer.className = "card_cardImageContainer";

    const img = document.createElement("img");
    img.className = "card_cardImage";
    img.loading = "lazy";
    // Instead of using the original folder, use the resized images:
    // Here, 'item' is your filename (e.g. "A52024006- $850.webp")
    img.src = `./assets/fabric_resized/1024/${item}`; // default size (e.g. 1024)
    img.alt = item;
    // Set the srcset attribute so the browser can choose:
    img.srcset = generateSrcSet(item);
    // Optionally add sizes (adjust according to your layout)
    img.sizes = "(max-width: 1024px) 100vw, 1024px";
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
    cardSubText.textContent = getFabricPrice(item);

    cardDetails.appendChild(cardText);
    cardDetails.appendChild(cardSubText);

    cardContainer.appendChild(imageContainer);
    cardContainer.appendChild(cardDetails);

    cardContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      selectFabric(categoryKey, item, cardContainer, folderPath);
    });

    return cardContainer;
  }

  function getFabricName(filename) {
    let baseName = filename.replace(/\.[^.]+$/, "");

    return baseName.replace(/-\s*\$[\d.]+$/, "");
  }

  function selectFabric(categoryKey, item, cardElement, folderPath) {
    console.log("Texture clicked:", item);
    document.querySelectorAll(".card_small.selected").forEach((card) => {
      card.classList.remove("selected");
    });

    cardElement.classList.add("selected");

    const textureUrl = folderPath + item;
    applyTexture(textureUrl);
    userChoices.texture = item;
    console.log("userChoices.texture updated to:", userChoices.texture);
  }

  function applyTexture(url) {
    // Get the URL for the appropriate resized version:
    const resizedUrl = getAppropriateImageUrl(url);
    if (!material) return;
    if (
      material.diffuseTexture &&
      material.diffuseTexture.name === resizedUrl
    ) {
      return;
    }
    const texture = new BABYLON.Texture(
      resizedUrl,
      scene,
      false,
      true,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      () => {
        console.log(`Texture loaded: ${resizedUrl}`);
      },
      (message, exception) => {
        console.error(
          `Failed to load texture: ${resizedUrl}`,
          message,
          exception
        );
      }
    );
    texture.uScale = 5.0;
    texture.vScale = 5.0;
    material.diffuseTexture = texture;
    material.diffuseTexture.name = resizedUrl;
    material.backFaceCulling = false;
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    material.ambientColor = new BABYLON.Color3(1, 1, 1);
  }

  function showMobileCutOptions() {
    console.log("[showMobileCutOptions] Displaying cut options...");

    const textureContainer = document.getElementById("textureContainer");
    textureContainer.innerHTML = "";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm ";
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
    mobileCutSlider.classList.add("cards-wrapper");

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
      imgEl.style.width = "83px";
      imgEl.style.height = "174px";
      imgEl.style.objectFit = "contain";

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
        panel.style.maxHeight = "300px";
        span.innerHTML = "-";
        console.log("[accordionClickHandler] Expanding panel");
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

        if (jacketMeshes.length > 0) {
        } else {
          console.warn("No jacket meshes available to zoom.");
        }
      } else if (category === "pants") {
        console.log("[accordionClickHandler] Loading Pants options...");
      } else if (category === "vest") {
        console.log(
          "[accordionClickHandler] Vest option clicked. (Example only)"
        );
        jacketMeshes.forEach((m) => m.setEnabled(false));
        pantsMeshes.forEach((m) => m.setEnabled(false));
        highlightLayer.removeAllMeshes();
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

  function loadJacketBasedOnUserChoices() {
    Object.keys(partOptionsMeshes).forEach((partName) => {
      const selectedMeshName = userChoices.design.jacket[partName];
      if (selectedMeshName) {
        Object.keys(partOptionsMeshes[partName]).forEach((meshName) => {
          const mesh = partOptionsMeshes[partName][meshName];
          if (mesh) {
            mesh.setEnabled(meshName === selectedMeshName);
            if (meshName === selectedMeshName) {
              mesh.renderingGroupId = 2;
              currentPartMeshes[partName] = mesh;
              highlightLayer.addMesh(mesh, BABYLON.Color3.White());
            }
          }
        });
      }
    });

    enableCameraControls();

    Object.entries(userChoices.design.jacket).forEach(
      ([partName, meshName]) => {
        if (!meshName) return;

        const btn = document.querySelector(
          `.part-option[data-part-name="${partName}"][data-mesh-name="${meshName}"]`
        );
        if (btn) {
          btn.classList.add(getSelectedClass(partName, meshName));
        }
      }
    );

    const topPocketName = userChoices.design.jacket["PocketsTop"];
    if (topPocketName) {
      const btnTop = document.querySelector(
        `.part-option[data-part-name="Pockets"][data-mesh-name="${topPocketName}"]`
      );
      if (btnTop) {
        btnTop.classList.add("selected-top-pocket");
      }
    }

    const bottomPocketName = userChoices.design.jacket["PocketsBottom"];
    if (bottomPocketName) {
      const btnBottom = document.querySelector(
        `.part-option[data-part-name="Pockets"][data-mesh-name="${bottomPocketName}"]`
      );
      if (btnBottom) {
        btnBottom.classList.add("selected-bottom-pocket");
      }
    }

    const singlePocket = userChoices.design.jacket["Pockets"];
    if (singlePocket) {
      Object.keys(partOptionsMeshes.Pockets).forEach((meshName) => {
        partOptionsMeshes.Pockets[meshName].setEnabled(false);
      });

      const chosen = partOptionsMeshes.Pockets[singlePocket];
      if (chosen) {
        chosen.setEnabled(true);
        currentPartMeshes["Pockets"] = chosen;
        highlightLayer.addMesh(chosen, BABYLON.Color3.White());
      }
    }
  }

  function setupPartSelection() {
    if (isPartSelectionSetup) return;
    isPartSelectionSetup = true;

    const textureContainer = document.getElementById("textureContainer");
    textureContainer.addEventListener("click", partSelectionHandler);
  }

  function partSelectionHandler(e) {
    const partOptionButton = e.target.closest(".part-option");
    if (!partOptionButton) return;

    const partName = partOptionButton.getAttribute("data-part-name");
    const meshName = partOptionButton.getAttribute("data-mesh-name");
    if (!partName || !meshName) {
      console.warn("Missing data-part-name or data-mesh-name attributes.");
      return;
    }
    if (
      window.matchMedia("(max-width: 1024.9px)").matches &&
      partName === "Pockets"
    ) {
      return;
    }
    if (partName === "Pockets") {
      const selectedClass = getSelectedClass(partName, meshName);

      if (partOptionButton.classList.contains(selectedClass)) {
        partOptionButton.classList.remove(selectedClass);

        userChoices.design.jacket["Pockets"] = undefined;
        if (TOP_POCKETS.includes(meshName)) {
          userChoices.design.jacket["PocketsTop"] = undefined;
        } else if (BOTTOM_POCKETS.includes(meshName)) {
          userChoices.design.jacket["PocketsBottom"] = undefined;
        }
        disablePocketMesh(meshName);

        return;
      }
    }

    switchPartMesh(partName, meshName);

    if (partName === "Pockets") {
      const isTopPocket = TOP_POCKETS.includes(meshName);
      const isBottomPocket = BOTTOM_POCKETS.includes(meshName);
      if (isTopPocket) {
        TOP_POCKETS.forEach((pocketName) => {
          const btn = document.querySelector(
            `.part-option[data-mesh-name="${pocketName}"]`
          );
          if (btn && pocketName !== meshName) {
            btn.classList.remove("selected-top-pocket");
          }
        });
      } else if (isBottomPocket) {
        BOTTOM_POCKETS.forEach((pocketName) => {
          const btn = document.querySelector(
            `.part-option[data-mesh-name="${pocketName}"]`
          );
          if (btn && pocketName !== meshName) {
            btn.classList.remove("selected-bottom-pocket");
          }
        });
      }
    } else {
      document
        .querySelectorAll(`.part-option[data-part-name="${partName}"]`)
        .forEach((btn) => {
          btn.classList.remove(
            "selected-back",
            "selected-lapel",
            "selected-top-pocket",
            "selected-bottom-pocket"
          );
        });
    }

    partOptionButton.classList.add(getSelectedClass(partName, meshName));
    if (partName === "Back") {
      resetCameraBack();
    } else if (partName === "Lapels" || partName === "Pockets") {
      resetCamera();
    }
    if (["Pockets"].includes(partName)) {
      const jacketAcc = document.querySelector(
        `.accordion[data-category="jacket"]`
      );
      if (jacketAcc && !jacketAcc.classList.contains("active")) {
        jacketAcc.click();
      } else {
        loadJacketBasedOnUserChoices();
      }
    }
  }

  const TOP_POCKETS = ["4on2_pocket_4", "4on2_pocket_5", "4on2_pocket_6"];
  const BOTTOM_POCKETS = [
    "4on2_pocket_1",
    "4on2_pocket_2",
    "4on2_pocket_3",
    "4on2_pocket_7",
    "4on2_pocket_8",
  ];
  function renderMobilePocketsOptions(mode) {
    const pocketsDesignOptions = [
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Single Pocket",
        meshName: "4on2_pocket_1",
      },
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Double Pocket",
        meshName: "4on2_pocket_2",
      },
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Patch Pocket",
        meshName: "4on2_pocket_3",
      },
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Flap Pocket",
        meshName: "4on2_pocket_4",
      },
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Ticket Pocket",
        meshName: "4on2_pocket_5",
      },
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Slash Pocket",
        meshName: "4on2_pocket_6",
      },
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Welt Pocket",
        meshName: "4on2_pocket_7",
      },
      {
        src: "assets/jacket/pockets/jacketpockets.png",
        label: "Jetted Pocket",
        meshName: "4on2_pocket_8",
      },
    ];

    let filteredOptions;
    if (mode === "top") {
      filteredOptions = pocketsDesignOptions.filter((opt) =>
        TOP_POCKETS.includes(opt.meshName)
      );
    } else if (mode === "bottom") {
      filteredOptions = pocketsDesignOptions.filter((opt) =>
        BOTTOM_POCKETS.includes(opt.meshName)
      );
    }

    if (mode === "top") {
      const container = document.getElementById("mobilePocketsContainer");
      container.classList.add("cards-wrapper");
      if (!container) return;
      container.innerHTML = "";
      filteredOptions.forEach((item) => {
        const pocketCard = document.createElement("div");
        pocketCard.classList.add("part-option", "card_cardContainer");
        pocketCard.setAttribute("data-part-name", "Pockets");
        pocketCard.setAttribute("data-mesh-name", item.meshName);
        pocketCard.style.touchAction = "pan-y";
        pocketCard.style.cursor = "pointer";

        if (userChoices.design.jacket["PocketsTop"] === item.meshName) {
          pocketCard.classList.add("selected", "selected-top-pocket");
        }

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
            "[renderMobilePocketsOptions] Chosen top pocket option:",
            item.label
          );
          container.querySelectorAll(".part-option").forEach((p) => {
            p.classList.remove("selected", "selected-top-pocket");
          });
          pocketCard.classList.add("selected", "selected-top-pocket");
          userChoices.design.jacket["PocketsTop"] = item.meshName;
          switchPartMesh("Pockets", item.meshName, "top");

          resetCamera();
        });

        container.appendChild(pocketCard);
      });
    } else if (mode === "bottom") {
      let sliderContainer = document.getElementById("mobilePocketsSlider");
      if (!sliderContainer) {
        sliderContainer = document.createElement("div");
        sliderContainer.id = "mobilePocketsSlider";
        sliderContainer.classList.add("cards-wrapper");
        const parent = document.getElementById("mobilePocketsContainer");
        if (parent) {
          parent.innerHTML = "";
          parent.appendChild(sliderContainer);
        }
      } else {
        sliderContainer.innerHTML = "";
      }
      const sliderWrapper = document.createElement("div");
      sliderWrapper.classList.add("cards-wrapper");
      sliderWrapper.id = "mobilePocketsSliderWrapper";
      sliderContainer.appendChild(sliderWrapper);
      filteredOptions.forEach((item) => {
        const pocketCard = document.createElement("div");
        pocketCard.classList.add("part-option", "card_cardContainer");
        pocketCard.setAttribute("data-part-name", "Pockets");
        pocketCard.setAttribute("data-mesh-name", item.meshName);
        pocketCard.style.touchAction = "pan-y";
        pocketCard.style.cursor = "pointer";

        if (userChoices.design.jacket["PocketsBottom"] === item.meshName) {
          pocketCard.classList.add("selected", "selected-bottom-pocket");
        }

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
            "[renderMobilePocketsOptions] Chosen bottom pocket option:",
            item.label
          );
          sliderWrapper.querySelectorAll(".part-option").forEach((p) => {
            p.classList.remove("selected", "selected-bottom-pocket");
          });
          pocketCard.classList.add("selected", "selected-bottom-pocket");
          userChoices.design.jacket["PocketsBottom"] = item.meshName;
          switchPartMesh("Pockets", item.meshName, "bottom");
          resetCamera();
        });

        sliderWrapper.appendChild(pocketCard);
      });
      sliderWrapper.removeAttribute("data-sliderInitialized");
      setupMobileSlider("#mobilePocketsSlider");
    }
  }

  function disablePocketMesh(meshName) {
    const btn = document.querySelector(
      `.part-option[data-mesh-name="${meshName}"]`
    );
    if (btn) {
      btn.classList.remove(
        "selected-top-pocket",
        "selected-bottom-pocket",
        "selected-pockets",
        "selected-back",
        "selected-lapel"
      );
    }

    const mesh = partOptionsMeshes["Pockets"][meshName];
    if (mesh) {
      mesh.setEnabled(false);
    }
  }

  function enablePocketMesh(meshName) {
    const mesh = partOptionsMeshes["Pockets"][meshName];
    if (mesh) {
      mesh.setEnabled(true);
      mesh.renderingGroupId = 2;
      highlightLayer.removeAllMeshes();
      highlightLayer.addMesh(mesh, BABYLON.Color3.White());
    }

    const btn = document.querySelector(
      `.part-option[data-mesh-name="${meshName}"]`
    );
    if (btn) {
      let selectedClass = "selected-pockets";
      if (TOP_POCKETS.includes(meshName)) {
        selectedClass = "selected-top-pocket";
      } else if (BOTTOM_POCKETS.includes(meshName)) {
        selectedClass = "selected-bottom-pocket";
      }

      btn.classList.remove(
        "selected-back",
        "selected-lapel",
        "selected-top-pocket",
        "selected-bottom-pocket"
      );
      btn.classList.add(selectedClass);
    }
  }
  function switchPartMesh(partName, meshName, mobileSelection) {
    if (!partOptionsMeshes[partName]) {
      console.warn(
        `switchPartMesh: No mesh options available for part "${partName}".`
      );
      return;
    }

    if (partName !== "Pockets") {
      Object.keys(partOptionsMeshes[partName]).forEach((name) => {
        const mesh = partOptionsMeshes[partName][name];
        if (mesh) mesh.setEnabled(false);
      });
      const selectedMesh = partOptionsMeshes[partName][meshName];
      if (selectedMesh) {
        selectedMesh.setEnabled(true);
        selectedMesh.renderingGroupId = 2;
        currentPartMeshes[partName] = selectedMesh;
        userChoices.design.jacket[partName] = meshName;

        Object.keys(partOptionsMeshes[partName]).forEach((name) => {
          const mesh = partOptionsMeshes[partName][name];
          if (mesh) highlightLayer.removeMesh(mesh);
        });
        highlightLayer.addMesh(selectedMesh, BABYLON.Color3.White());
      } else {
        console.warn(
          `switchPartMesh: No mesh found for "${meshName}" in part "${partName}".`
        );
      }
      const btn = document.querySelector(
        `.part-option[data-mesh-name="${meshName}"]`
      );
      if (btn) {
        btn.classList.remove(
          "selected-back",
          "selected-lapel",
          "selected-top-pocket",
          "selected-bottom-pocket"
        );
        btn.classList.add(getSelectedClass(partName, meshName));
      }
      return;
    }

    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      if (mobileSelection === "top") {
        TOP_POCKETS.forEach((pName) => {
          const mesh = partOptionsMeshes.Pockets[pName];
          if (mesh) {
            mesh.setEnabled(false);
            highlightLayer.removeMesh(mesh);
          }
        });
        const chosenPocket = partOptionsMeshes.Pockets[meshName];
        if (chosenPocket) {
          chosenPocket.setEnabled(true);
          chosenPocket.renderingGroupId = 2;
          currentPartMeshes["PocketsTop"] = chosenPocket;
          userChoices.design.jacket["PocketsTop"] = meshName;
          TOP_POCKETS.forEach((pName) => {
            const m = partOptionsMeshes.Pockets[pName];
            if (m) highlightLayer.removeMesh(m);
          });
          highlightLayer.addMesh(chosenPocket, BABYLON.Color3.White());
        } else {
          console.warn(
            `switchPartMesh: No top pocket mesh found for "${meshName}".`
          );
        }
      } else if (mobileSelection === "bottom") {
        BOTTOM_POCKETS.forEach((pName) => {
          const mesh = partOptionsMeshes.Pockets[pName];
          if (mesh) {
            mesh.setEnabled(false);
            highlightLayer.removeMesh(mesh);
          }
        });
        const chosenPocket = partOptionsMeshes.Pockets[meshName];
        if (chosenPocket) {
          chosenPocket.setEnabled(true);
          chosenPocket.renderingGroupId = 2;
          currentPartMeshes["PocketsBottom"] = chosenPocket;
          userChoices.design.jacket["PocketsBottom"] = meshName;
          BOTTOM_POCKETS.forEach((pName) => {
            const m = partOptionsMeshes.Pockets[pName];
            if (m) highlightLayer.removeMesh(m);
          });
          highlightLayer.addMesh(chosenPocket, BABYLON.Color3.White());
        } else {
          console.warn(
            `switchPartMesh: No bottom pocket mesh found for "${meshName}".`
          );
        }
      } else {
        console.warn(
          "switchPartMesh (mobile): No mobileSelection provided for Pockets."
        );
      }
    } else {
      const isTop = TOP_POCKETS.includes(meshName);
      const isBottom = BOTTOM_POCKETS.includes(meshName);
      if (isTop) {
        if (userChoices.design.jacket["PocketsTop"] === meshName) {
          userChoices.design.jacket["PocketsTop"] = undefined;
          disablePocketMesh(meshName);
          highlightLayer.removeMesh(partOptionsMeshes.Pockets[meshName]);
        } else {
          TOP_POCKETS.forEach((pName) => disablePocketMesh(pName));
          enablePocketMesh(meshName);
          userChoices.design.jacket["PocketsTop"] = meshName;
        }
      } else if (isBottom) {
        if (userChoices.design.jacket["PocketsBottom"] === meshName) {
          userChoices.design.jacket["PocketsBottom"] = undefined;
          disablePocketMesh(meshName);
          highlightLayer.removeMesh(partOptionsMeshes.Pockets[meshName]);
        } else {
          BOTTOM_POCKETS.forEach((pName) => disablePocketMesh(pName));
          enablePocketMesh(meshName);
          userChoices.design.jacket["PocketsBottom"] = meshName;
        }
      }
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
    const jacketChoice = event.target.closest(".jacket-embroidery-choice");
    if (!jacketChoice) return;

    const selectedLocation = jacketChoice.querySelector("p").innerText.trim();

    if (selectedLocation === "No Embroidery") {
      userChoices.embroidery.jacket = [];
      document
        .querySelectorAll(".jacket-embroidery-choice")
        .forEach((el) => el.classList.remove("selected"));
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
        const noEmb = document.querySelector(
          ".jacket-embroidery-choice.no-embroidery"
        );
        if (noEmb) noEmb.classList.remove("selected");
      } else {
        const noEmb = document.querySelector(
          ".jacket-embroidery-choice.no-embroidery"
        );
        if (noEmb) noEmb.classList.add("selected");
      }
    }

    userChoices.embroidery.hasEmbroidery =
      userChoices.embroidery.jacket.length > 0;

    const charPanel = document.querySelector(".characters-inputs");
    if (charPanel && charPanel.style.display !== "none") {
      renderCharactersPanel();

      charPanel.style.display = "block";
    }
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
    resetCamera();
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
      transitionToStep(step);
      enableCameraControls();
    }
    document.querySelector(
      "body > main > div > div.canvas-container"
    ).style.display = "block";
  });
  function getFabricName(filename) {
    let baseName = filename.replace(/\.[^.]+$/, ""); // remove extension
    return baseName.replace(/-\s*\$[\d.]+$/, ""); // remove " - $price"
  }

  document.getElementById("nextButton").addEventListener("click", function () {
    enableCameraControls();
    resetCamera();
    let selectedChoice = null;

    if (step === 1) {
      if (userChoices.texture) {
        // Use getFabricName to remove the price and file extension.
        const cleanedName = getFabricName(userChoices.texture);
        selectedChoice = { texture: cleanedName };
        userChoices.texture = cleanedName;
      } else {
        selectedChoice = { texture: "E5102-38.webp" };
        userChoices.texture = "E5102-38.webp";
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
        transitionToStep(step);
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

      transitionToStep(step);
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
    confirmButton.textContent = "Confirm ";
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
    mobilePleatSlider.classList.add("cards-wrapper");

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
        onReverseComplete: () =>
          tl.totalTime(tl.rawTime() + tl.duration() * 100),
      }),
      length = items.length,
      startX = items[0].offsetLeft,
      times = [],
      widths = [],
      xPercents = [],
      curIndex = 0,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap =
        config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
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
    tl.updateIndex = () =>
      (curIndex = Math.round(tl.progress() * items.length));
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
      summary += "Embroidery Locations:\n";
      userChoices.embroidery.jacket.forEach((emb, index) => {
        summary += `  Embroidery ${index + 1}:\n`;
        summary += `    Location: ${emb.location}\n`;
        summary += `    Text: ${emb.text || "N/A"}\n`;
        summary += `    Color: ${emb.color || "N/A"}\n`;
      });
    } else {
      summary += "No Embroidery Selected.\n";
    }

    if (userChoices.embroidery.threadColor) {
      summary += `Thread Color (Mobile): ${userChoices.embroidery.threadColor}\n`;
    }

    if (userChoices.measurements) {
      summary += "Measurements:\n";
      for (let measurement in userChoices.measurements) {
        summary += `  ${measurement}: ${userChoices.measurements[measurement]}\n`;
      }
    }

    alert(summary);
    EmailSender.sendUserChoicesEmail(userChoices);
    window.parent.postMessage(
      { type: "userChoices", data: userChoices },
      "*" // For security, you can restrict this to your parent domain
    );
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
  function renderCharactersPanel() {
    const oldPanel = document.querySelector(".characters-inputs");
    if (oldPanel) oldPanel.remove();

    if (userChoices.embroidery.jacket.length === 0) return;

    if (!embroideryContainer) {
      embroideryContainer = document.getElementById(
        "embroideryLocationsContainer"
      );
      if (!embroideryContainer) {
        console.error(
          "Element with ID 'embroideryLocationsContainer' not found."
        );
        return;
      }
    }

    const newPanel = document.createElement("div");
    newPanel.classList.add("characters-inputs");

    let html = `<h3 class="embroidery-text">Embroidery Text:</h3>`;
    userChoices.embroidery.jacket.forEach((emb, i) => {
      html += `
      <div class="embroidery-input-group">
        <input
          class="embroidery-input"
          placeholder="${emb.location} Enter your initials"
          type="text"
          id="embroideryTextInput${i}"
          maxlength="20"
          value="${emb.text || ""}"
        />
      </div>
    `;
    });

    newPanel.innerHTML = html;
    embroideryContainer.appendChild(newPanel);

    userChoices.embroidery.jacket.forEach((emb, i) => {
      const inputField = document.getElementById(`embroideryTextInput${i}`);
      if (inputField) {
        inputField.addEventListener("input", () => {
          emb.text = inputField.value.trim();
        });
      }
    });
  }
  function getSelectedClass(partName, meshName) {
    switch (partName) {
      case "Back":
        return "selected-back";
      case "Lapels":
        return "selected-lapel";
      case "Pockets":
        if (TOP_POCKETS.includes(meshName)) {
          return "selected-top-pocket";
        } else if (BOTTOM_POCKETS.includes(meshName)) {
          return "selected-bottom-pocket";
        }
        return "selected-pockets";
      default:
        return "selected";
    }
  }
  const arrowEl = document.getElementById("arrow");
  if (arrowEl) {
    arrowEl.addEventListener("click", () => {
      rotateMeshes(Math.PI / 2);
    });
  } else {
    console.warn('Arrow element with id "arrow" not found.');
  }
  document
    .getElementById("resetCameraButton")
    .addEventListener("click", resetCamera);
});
