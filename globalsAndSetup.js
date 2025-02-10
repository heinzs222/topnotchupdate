let initialCameraRadius,
  initialCameraTarget,
  initialCameraAlpha,
  initialCameraBeta;

let textures = {};
let step = 1;
let userChoices = {
  texture: null,
  design: {
    jacket: {},
    pants: {},
  },
  embroidery: {
    jacket: [],
    pants: { location: null, text: "" },
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

function normalizeAngle(angle) {
  return angle % (2 * Math.PI);
}
