const createScene = () => {
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);

  camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2,
    5.0,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  camera.attachControl(canvas, true);
  camera.panningSensibility = 0;
  camera.lowerRadiusLimit = 2.0;
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

  const onModelLoaded = () => {
    modelsLoaded++;
    if (modelsLoaded === modelsToLoad) {
      parentNode.rotation.y = Math.PI / 2;
      initialRotationY = parentNode.rotation.y;
      currentRotationY = initialRotationY;
      currentOrientation = "front";

      applyTexture("./batch1/E5102-38.png");
      centerModel();
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

  BABYLON.SceneLoader.ImportMesh("", "./", "jacket.gltf", scene, (meshes) => {
    meshes.forEach((mesh) => {
      mesh.material = material;
      mesh.parent = parentNode;
      jacketMeshes.push(mesh);

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
            zoomToMesh(mesh);
            handlePartSelection(partName, mesh.name);
          }
        )
      );
    });
    onModelLoaded();
  });

  BABYLON.SceneLoader.ImportMesh("", "./", "pants.gltf", scene, (meshes) => {
    meshes.forEach((mesh) => {
      mesh.material = material;
      mesh.parent = parentNode;
      pantsMeshes.push(mesh);

      partMeshes[mesh.name] = mesh;
    });
    onModelLoaded();
  });

  const mannequinMaterial = new BABYLON.PBRMaterial("mannequinMaterial", scene);
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
    "Mannequin.gltf",
    scene,
    (meshes) => {
      mannequinRoot = new BABYLON.TransformNode("mannequinRoot", scene);

      meshes.forEach((mesh) => {
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
        "shirt.gltf",
        scene,
        (meshes) => {
          const shirtMaterial = new BABYLON.StandardMaterial(
            "shirtMaterial",
            scene
          );
          shirtMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
          shirtMaterial.backFaceCulling = false;

          shirtRoot = new BABYLON.TransformNode("shirtRoot", scene);

          const shirtPartMeshes = {
            Back: [],
            Collars: [],
            Cuffs: [],
            Front: [],
            Sleeves: [],
          };

          const actualShirtMeshes = [];

          meshes.forEach((m) => {
            if (!(m instanceof BABYLON.Mesh)) return;

            actualShirtMeshes.push(m);

            m.material = shirtMaterial;
            m.parent = shirtRoot;

            m.scaling = new BABYLON.Vector3(0.99197, 0.99197, 0.99197);
            m.rotation = new BABYLON.Vector3(0, 0, 0);
            m.position = new BABYLON.Vector3(0, 0, 0);

            const partName = getPartNameFromMeshName(m.name);
            if (partName && shirtPartMeshes[partName]) {
              shirtPartMeshes[partName].push(m);
            }
          });

          shirtRoot.parent = mannequinRoot;

          shirtRoot.scaling = new BABYLON.Vector3(1, 1, 1);
          shirtRoot.position = new BABYLON.Vector3(0, 0.95, 0);

          initialRotationY = shirtRoot.rotation.y;
          currentRotationY = initialRotationY;
          currentOrientation = "front";

          Object.keys(shirtPartMeshes).forEach((partName) => {
            if (shirtPartMeshes[partName].length > 0) {
              shirtPartMeshes[partName].forEach((mesh, index) => {
                if (index === 0) {
                  mesh.setEnabled(true);
                  currentPartMeshes[partName] = mesh;
                  highlightLayer.addMesh(mesh, BABYLON.Color3.White());
                } else {
                  mesh.setEnabled(false);
                }
              });
            }
          });

          zoomToMeshes(actualShirtMeshes, 0.2);

          Object.keys(currentPartMeshes).forEach((partName) => {
            const mesh = currentPartMeshes[partName];
            if (mesh) {
              handlePartSelection(partName, mesh.name);
            }
          });

          onModelLoaded();
        }
      );
    } else {
      shirtRoot.setEnabled(true);
      console.log("Shirt already loaded. Ensured it is visible.");

      Object.keys(partOptionsMeshes).forEach((partName) => {
        const meshes = partOptionsMeshes[partName];
        Object.keys(meshes).forEach((meshName) => {
          const mesh = meshes[meshName];
          if (mesh) {
            if (userChoices.design.jacket[partName] === meshName) {
              mesh.setEnabled(true);
              currentPartMeshes[partName] = mesh;
              highlightLayer.addMesh(mesh, BABYLON.Color3.White());
            } else {
              mesh.setEnabled(false);
            }
          }
        });
      });
    }
  }

  for (let partName in partOptions) {
    let meshNames = partOptions[partName];
    meshNames.forEach((meshName) => {
      if (partOptionsMeshes[partName][meshName]) {
        return;
      }
      let fileName = meshName + ".gltf";
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
                  zoomToMesh(mesh);
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
