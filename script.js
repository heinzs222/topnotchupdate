import e from "./emailSender.js";
document.addEventListener("DOMContentLoaded", function () {
  var t, a;
  console.log("cart update new images"), console.log("I hope plz");
  let s,
    n,
    i,
    o,
    r,
    l = {},
    c = 1,
    d = {
      texture: null,
      design: { jacket: {}, pants: {} },
      embroidery: {
        jacket: [],
        pants: { location: null, text: "" },
        threadColor: null,
      },
      measurements: {},
    },
    p,
    m,
    u,
    h,
    g,
    $ = [],
    y = [],
    k = [],
    _ = {},
    b,
    v = document.getElementById("embroideryLocationsContainer"),
    f = {
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
    },
    C = {};
  for (let E in f) C[E] = {};
  let L = {},
    x = document.getElementById("renderCanvas"),
    w = new BABYLON.Engine(x, !0, { preserveDrawingBuffer: !0, stencil: !0 }),
    A = document.getElementById("tooltip"),
    I = !1,
    M = !1,
    P = !1,
    T = !1,
    N = 0,
    S = 0,
    B = "front",
    j = () => {
      ((u = new BABYLON.Scene(w)).clearColor = new BABYLON.Color3(
        0.937,
        0.937,
        0.937
      )),
        (g = new BABYLON.ArcRotateCamera(
          "camera",
          0,
          Math.PI / 2,
          5,
          new BABYLON.Vector3(0, 1, 0),
          u
        )).attachControl(x, !0),
        w.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));
      let e = new BABYLON.FxaaPostProcess(
        "fxaa",
        1,
        null,
        BABYLON.Texture.BILINEAR_SAMPLINGMODE,
        w
      );
      u.postProcesses.push(e),
        g.inputs.attached.touch &&
          ((g.inputs.attached.touch.pinchPrecision = 30),
          (g.inputs.attached.touch.touchAngularSensibility = 1e4)),
        (g.panningSensibility = 0),
        (g.lowerRadiusLimit = 2.5),
        (g.upperRadiusLimit = 20),
        (g.wheelPrecision = 100),
        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), u);
      (new BABYLON.DirectionalLight(
        "dirLight",
        new BABYLON.Vector3(-1, -2, -1),
        u
      ).position = new BABYLON.Vector3(20, 40, 20)),
        (u.useRightHandedSystem = !0),
        (m = new BABYLON.StandardMaterial("material", u)),
        (h = new BABYLON.TransformNode("parent", u)),
        (b = new BABYLON.HighlightLayer("hl1", u));
      let t = 0;
      setTimeout(() => {
        console.log("All images have loaded and rendered."),
          gsap.to(".loader-tn", {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: function () {
              let e = document.getElementById("loader-top-notch");
              e && (e.style.zIndex = "-1");
            },
          });
      }, 1e3);
      let a = () => {
        let e, a, s, l, p;
        4 == ++t &&
          ((h.rotation.y = Math.PI / 2),
          (S = N = h.rotation.y),
          (B = "front"),
          et("./assets/fabric/All Fabrics/A52024006- $850.webp"),
          h.computeWorldMatrix(!0),
          (e = h.getChildMeshes()),
          (a = new BABYLON.Vector3(
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            Number.MAX_VALUE
          )),
          (s = new BABYLON.Vector3(
            -Number.MAX_VALUE,
            -Number.MAX_VALUE,
            -Number.MAX_VALUE
          )),
          e.forEach((e) => {
            e.computeWorldMatrix(!0);
            let t = e.getBoundingInfo(),
              n = t.boundingBox.minimumWorld,
              i = t.boundingBox.maximumWorld;
            (a = BABYLON.Vector3.Minimize(a, n)),
              (s = BABYLON.Vector3.Maximize(s, i));
          }),
          (l = a.add(s).scale(0.5)),
          (h.position = h.position.subtract(l)),
          g.setTarget(BABYLON.Vector3.Zero()),
          (p = s.subtract(a).length()),
          (g.radius = 1.5 * p),
          (n = g.radius),
          (i = g.target.clone()),
          (o = g.alpha),
          (r = g.beta),
          (g.upperRadiusLimit = n),
          (function e() {
            let t = H;
            if (
              ((H = function (e) {
                console.log("Camera zoom disabled for default jacket parts.");
              }),
              d.design.jacket.Back ||
                ((d.design.jacket.Back = f.Back[0]), ep("Back", f.Back[0])),
              d.design.jacket.Lapels ||
                ((d.design.jacket.Lapels = f.Lapels[0]),
                ep("Lapels", f.Lapels[0])),
              window.matchMedia("(max-width: 1024.9px)").matches)
            )
              d.design.jacket.PocketsTop ||
                ((d.design.jacket.PocketsTop = eo[0]),
                ep("Pockets", eo[0], "top")),
                d.design.jacket.PocketsBottom ||
                  ((d.design.jacket.PocketsBottom = er[0]),
                  ep("Pockets", er[0], "bottom"));
            else {
              if (!d.design.jacket.PocketsTop) {
                d.design.jacket.PocketsTop = eo[0];
                let a = C.Pockets[eo[0]];
                a &&
                  (a.setEnabled(!0),
                  (a.renderingGroupId = 2),
                  b.addMesh(a, BABYLON.Color3.White()));
              }
              if (!d.design.jacket.PocketsBottom) {
                d.design.jacket.PocketsBottom = er[0];
                let s = C.Pockets[er[0]];
                s &&
                  (s.setEnabled(!0),
                  (s.renderingGroupId = 2),
                  b.addMesh(s, BABYLON.Color3.White()));
              }
            }
            H = t;
          })(),
          Y(c));
      };
      function l(e) {
        return e.startsWith("4on2_Back")
          ? "Back"
          : e.startsWith("4on2_Lapels")
          ? "Lapels"
          : e.startsWith("4on2_pocket")
          ? "Pockets"
          : null;
      }
      BABYLON.SceneLoader.ImportMesh("", "./", "jacket.glb", u, (e) => {
        e.forEach((e) => {
          (e.material = m),
            (e.parent = h),
            $.push(e),
            (e.renderingGroupId = 2),
            (_[e.name] = e);
          let t = l(e.name);
          t && ((L[t] = e), (C[t][e.name] = e)),
            (e.actionManager = new BABYLON.ActionManager(u)),
            e.actionManager.registerAction(
              new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                function (t) {
                  let a = l(e.name);
                  if (a && L[a]) {
                    let s = L[a];
                    b.addMesh(s, BABYLON.Color3.White()),
                      (x.style.cursor = "pointer"),
                      (A.style.display = "block"),
                      (A.innerHTML = a);
                  }
                }
              )
            ),
            e.actionManager.registerAction(
              new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                function (t) {
                  let a = l(e.name);
                  if (a && L[a]) {
                    let s = L[a];
                    b.removeMesh(s),
                      (x.style.cursor = "default"),
                      (A.style.display = "none");
                  }
                }
              )
            ),
            e.actionManager.registerAction(
              new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickDownTrigger,
                function (a) {
                  var s, n;
                  ep((s = t), (n = e.name));
                }
              )
            );
        }),
          a();
      }),
        BABYLON.SceneLoader.ImportMesh("", "./", "pants.glb", u, (e) => {
          e.forEach((e) => {
            (e.renderingGroupId = 2),
              (e.material = m),
              (e.parent = h),
              y.push(e),
              (_[e.name] = e);
          }),
            a();
        });
      let v = new BABYLON.PBRMaterial("mannequinMaterial", u);
      (v.albedoColor = new BABYLON.Color3(0.08, 0.08, 0.08)),
        (v.metallic = 0),
        (v.roughness = 1);
      let E = new BABYLON.PBRMaterial("shoeMaterial", u);
      for (let I in ((E.albedoColor = new BABYLON.Color3(0, 0, 0)),
      (E.metallic = 0.5),
      (E.roughness = 0.5),
      BABYLON.SceneLoader.ImportMesh("", "./", "Mannequin.glb", u, (e) => {
        (s = new BABYLON.TransformNode("mannequinRoot", u)),
          e.forEach((e) => {
            (e.renderingGroupId = 1),
              console.log("Mesh Name:", e.name),
              (e.parent = s),
              k.push(e),
              (e.actionManager = null),
              (e.useVertexColors = !1),
              e.material && e.material.dispose(),
              (e.material = null),
              e.name.includes("unamed_unamedmesh_1") ||
              e.name.includes("Posed__mask_")
                ? (e.material = v)
                : ("shoe_L" === e.name || "shoe_R" === e.name) &&
                  (e.material = E);
          }),
          (s.parent = h),
          (s.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01)),
          (s.position = new BABYLON.Vector3(0, 0, 0)),
          a(),
          p
            ? (p.setEnabled(!0),
              console.log("Shirt already loaded. Ensured it is visible."))
            : BABYLON.SceneLoader.ImportMesh("", "./", "shirt.glb", u, (e) => {
                let t = new BABYLON.StandardMaterial("shirtMaterial", u);
                (t.diffuseColor = new BABYLON.Color3(1, 1, 1)),
                  (t.backFaceCulling = !1),
                  (p = new BABYLON.TransformNode("shirtRoot", u));
                let n = [];
                e.forEach((e) => {
                  e instanceof BABYLON.Mesh &&
                    (console.log("[SHIRT LOAD] Found shirt mesh:", e.name),
                    n.push(e),
                    (e.material = t),
                    (e.parent = p),
                    (e.scaling = new BABYLON.Vector3(1, 1, 1)),
                    (e.rotation = new BABYLON.Vector3(0, 0, 0)),
                    (e.position = new BABYLON.Vector3(0, 0, 0)),
                    "Front_1" === e.name
                      ? (e.renderingGroupId = 2)
                      : "2_Button" == e.name
                      ? (e.renderingGroupId = 2)
                      : (e.renderingGroupId = 1));
                }),
                  (p.parent = s),
                  (p.scaling = new BABYLON.Vector3(1, 1, 0.9)),
                  (p.position = new BABYLON.Vector3(0, 0, 0)),
                  (S = N = p.rotation.y),
                  (B = "front");
                let i = [
                  "1_pleat",
                  "2_Button",
                  "Round_Cuffs",
                  "Front_1",
                  "Sleeves",
                ];
                n.forEach((e) => {
                  i.includes(e.name)
                    ? (e.setEnabled(!0), b.addMesh(e, BABYLON.Color3.White()))
                    : e.setEnabled(!1);
                }),
                  a();
              });
      }),
      f))
        f[I].forEach((e) => {
          if (C[I][e]) return;
          let t = e + ".glb";
          BABYLON.SceneLoader.ImportMesh(
            "",
            "./jacket-seperate-pieces/",
            t,
            u,
            (t) => {
              t.forEach((t) => {
                (t.material = m),
                  (t.parent = h),
                  (C[I][e] = t),
                  (_[t.name] = t),
                  t.setEnabled(!1),
                  (t.actionManager = new BABYLON.ActionManager(u)),
                  t.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                      BABYLON.ActionManager.OnPickDownTrigger,
                      function (e) {
                        var a, s;
                        ep((a = I), (s = t.name));
                      }
                    )
                  );
              });
            }
          );
        });
      return (
        (u.onPointerDown = function (e, t) {
          t.hit ||
            (b.removeAllMeshes(),
            document
              .querySelectorAll(".part-item")
              .forEach((e) => e.classList.remove("selected")));
        }),
        (u.onPointerMove = function (e, t) {
          "block" === A.style.display &&
            ((A.style.left = e.clientX + 10 + "px"),
            (A.style.top = e.clientY + 10 + "px"),
            (A.style.zIndex = 999));
        }),
        u.registerBeforeRender(() => {
          var e;
          let t = (e = g.alpha) % (2 * Math.PI);
          t < Math.PI / 4 || t > (7 * Math.PI) / 4
            ? "front" !== B &&
              ((B = "front"), console.log("Orientation changed to Front"))
            : t > (3 * Math.PI) / 4 &&
              t < (5 * Math.PI) / 4 &&
              "back" !== B &&
              ((B = "back"), console.log("Orientation changed to Back"));
        }),
        u
      );
    };
  function O() {
    let e = document.querySelectorAll(".part-option"),
      t = document.querySelectorAll(".part-item");
    e.forEach((e) => {
      e.addEventListener("mouseenter", function () {
        let e = this.getAttribute("data-part-name"),
          t = this.getAttribute("data-mesh-name"),
          a = C[e][t];
        a && b.addMesh(a, BABYLON.Color3.White());
      }),
        e.addEventListener("mouseleave", function () {
          let e = this.getAttribute("data-part-name"),
            t = this.getAttribute("data-mesh-name"),
            a = C[e][t];
          a && b.removeMesh(a);
        });
    }),
      t.forEach((e) => {
        e.addEventListener("mouseenter", function () {
          let e = L[this.getAttribute("data-part")];
          e && b.addMesh(e, BABYLON.Color3.White());
        }),
          e.addEventListener("mouseleave", function () {
            let e = L[this.getAttribute("data-part")];
            e && b.removeMesh(e);
          });
      });
  }
  function H(e) {
    if (!e) {
      console.error("zoomToMesh called with undefined mesh");
      return;
    }
    console.log(`Zooming to mesh: ${e.name}`);
    let t = e.getBoundingInfo(),
      a = t.boundingBox.centerWorld,
      s = 1.5 * t.boundingSphere.radiusWorld;
    u.stopAnimation(g);
    let n = new BABYLON.Animation(
        "cameraRadiusAnim",
        "radius",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      ),
      i = [
        { frame: 0, value: g.radius },
        { frame: 240, value: s },
      ];
    n.setKeys(i),
      n.setEasingFunction(new BABYLON.CubicEase()),
      n
        .getEasingFunction()
        .setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    let o = new BABYLON.Animation(
        "cameraTargetXAnim",
        "target.x",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      ),
      r = new BABYLON.Animation(
        "cameraTargetYAnim",
        "target.y",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      ),
      l = new BABYLON.Animation(
        "cameraTargetZAnim",
        "target.z",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      ),
      c = [
        { frame: 0, value: g.target.x },
        { frame: 240, value: a.x },
      ],
      d = [
        { frame: 0, value: g.target.y },
        { frame: 240, value: a.y },
      ],
      p = [
        { frame: 0, value: g.target.z },
        { frame: 240, value: a.z },
      ];
    o.setKeys(c), r.setKeys(d), l.setKeys(p);
    let m = new BABYLON.CubicEase();
    m.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT),
      o.setEasingFunction(m),
      r.setEasingFunction(m),
      l.setEasingFunction(m),
      (g.animations = []),
      g.animations.push(n, o, r, l),
      u.beginAnimation(g, 0, 240, !1, 1, () => {
        console.log(`Camera smoothly zoomed to mesh: ${e.name}`);
      });
  }
  function z(e, t) {
    ep(e, t);
  }
  function F(e) {
    return "Back" === e
      ? `
    <div class="card_cardContainer" data-test-id="${e}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- Back Design Images (Assuming 4 options) -->
        <img loading="lazy" class="card_cardImage image-jacket-back"  src="./assets/jacket/back/jacketback.png" alt="Classic Back">
        <!-- Show # of images if you like -->
        <div class="card_itemAmountContainer" data-test-id="item-amount">4</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${e}</p>
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
  `
      : "Lapels" === e
      ? `
    <div class="card_cardContainer" data-test-id="${e}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- Lapel Design Images (Assuming 3 options) -->
        <img loading="lazy" class="card_cardImage image-jacket-lapels"  src="./assets/jacket/lapel/jacketlapel.png" alt="Classic Lapel">
        <div class="card_itemAmountContainer" data-test-id="item-amount">3</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${e}</p>
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
  `
      : "Pockets" === e
      ? `
    <div class="card_cardContainer" data-test-id="${e}" tabindex="0">
      <div class="card_cardImageContainer">
        <!-- Pockets Design Images (Assuming 4 options) -->
        <img loading="lazy" class="card_cardImage image-jacket-pockets"  src="./assets/jacket/pockets/jacketpockets.png" alt="Single Pocket">
        <div class="card_itemAmountContainer" data-test-id="item-amount">8</div>
      </div>
      <div class="card_cardDetails">
        <p class="card_cardText" data-test-id="card-text">${e}</p>
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
  `
      : "Cut" === e
      ? `
    <div class="card_cardContainer" data-test-id="${e}" tabindex="0">
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
        <p class="card_cardText" data-test-id="card-text">${e}</p>
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
  `
      : "Pleat" === e
      ? `
    <div class="card_cardContainer" data-test-id="${e}" tabindex="0">
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
        <p class="card_cardText" data-test-id="card-text">${e}</p>
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
  `
      : `
  <div class="card_cardContainer" data-test-id="${e}" tabindex="0">
    <div class="card_cardImageContainer">
      <!-- Default Images -->
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5101-38.webp" alt="E5101-38">
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5102-38.webp" alt="E5102-38">
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5103-38.webp" alt="E5103-38">
      <img loading="lazy" class="card_cardImage"  src="./assets/fabric/business/E5104-38.webp" alt="E5104-38">
      <div class="card_itemAmountContainer" data-test-id="item-amount">25</div>
    </div>
    <div class="card_cardDetails">
      <p class="card_cardText" data-test-id="card-text">${e}</p>
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
  function q() {
    if (void 0 === n || void 0 === i || void 0 === o || void 0 === r) {
      console.error("Initial camera parameters are not set.");
      return;
    }
    let e = (o - (h.rotation.y - N)) % (2 * Math.PI);
    BABYLON.Animation.CreateAndStartAnimation(
      "cameraRadiusReset",
      g,
      "radius",
      60,
      120,
      g.radius,
      n,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    ),
      BABYLON.Animation.CreateAndStartAnimation(
        "cameraTargetReset",
        g,
        "target",
        60,
        120,
        g.target,
        i,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      ),
      BABYLON.Animation.CreateAndStartAnimation(
        "cameraAlphaReset",
        g,
        "alpha",
        60,
        120,
        g.alpha,
        e,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      ),
      BABYLON.Animation.CreateAndStartAnimation(
        "cameraBetaReset",
        g,
        "beta",
        60,
        120,
        g.beta,
        r,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      ),
      console.log(
        "Camera reset to initial relative view (adjusted for model rotation)."
      );
  }
  function D() {
    let e = document.querySelector("#sidePanel .back-button");
    if (!e) {
      (e = document.createElement("button")).classList.add("back-button"),
        (e.style.marginBottom = "20px"),
        (e.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="9" fill="#EFEFEF"/>
        <path d="M4.64645 8.64645C4.45118 8.84171 4.45118 9.15829 4.64645 9.35355L7.82843 12.5355C8.02369 12.7308 8.34027 12.7308 8.53553 12.5355C8.7308 12.3403 8.7308 12.0237 8.53553 11.8284L5.70711 9L8.53553 6.17157C8.7308 5.97631 8.7308 5.65973 8.53553 5.46447C8.34027 5.2692 8.02369 5.2692 7.82843 5.46447L4.64645 8.64645ZM13 8.5L5 8.5L5 9.5L13 9.5L13 8.5Z" fill="black"/>
      </svg>
      Back
    `),
        e.addEventListener("click", () => {
          q(), Y((c = 2)), e.remove();
        });
      let t = document.getElementById("sidePanel");
      t
        ? t.appendChild(e)
        : (console.warn(
            "#sidePanel element not found. Appending to textureContainer instead."
          ),
          textureContainer.appendChild(e));
    }
  }
  function R() {
    console.log(
      "[showMobileLapelsOptions] Displaying lapels design options..."
    );
    let e = document.getElementById("textureContainer");
    e.innerHTML = "";
    let t = document.createElement("button");
    (t.textContent = "Confirm  "),
      t.classList.add("back-to-cat"),
      t.addEventListener("click", () => {
        console.log("[showMobileLapelsOptions] Confirm clicked => returning"),
          U();
      }),
      e.appendChild(t);
    let a = document.createElement("div");
    (a.id = "mobileLapelsSlider"), a.classList.add("cards-wrapper");
    let s = document.createElement("div");
    s.classList.add("cards-wrapper"),
      [
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
      ].forEach((e) => {
        let t = document.createElement("div");
        t.classList.add("part-option", "card_cardContainer"),
          t.setAttribute("data-part-name", "Lapels"),
          t.setAttribute("data-mesh-name", e.meshName),
          (t.style.touchAction = "pan-y"),
          (t.style.cursor = "pointer"),
          d.design.jacket.Lapels === e.meshName && t.classList.add("selected");
        let a = document.createElement("div");
        a.classList.add("img-wrapper"), (a.style.touchAction = "pan-y");
        let n = document.createElement("img");
        (n.src = e.src),
          (n.alt = e.label),
          (n.style.touchAction = "pan-y"),
          (n.style.width = "100%"),
          (n.style.height = "auto"),
          a.appendChild(n);
        let i = document.createElement("p");
        (i.textContent = e.label),
          (i.style.touchAction = "pan-y"),
          t.appendChild(a),
          t.appendChild(i),
          t.addEventListener("click", () => {
            console.log(
              "[showMobileLapelsOptions] Chosen lapels option:",
              e.label
            ),
              s.querySelectorAll(".part-option").forEach((e) => {
                e.classList.remove("selected");
              }),
              t.classList.add("selected"),
              (d.design.jacket.Lapels = e.meshName),
              ep("Lapels", e.meshName),
              q();
          }),
          s.appendChild(t);
      }),
      a.appendChild(s),
      e.appendChild(a);
  }
  function W() {
    console.log("[showMobileBackOptions] Displaying back view options...");
    let e = document.getElementById("textureContainer");
    e.innerHTML = "";
    let t = document.createElement("button");
    (t.textContent = "Confirm  "),
      t.classList.add("back-to-cat"),
      t.addEventListener("click", () => {
        console.log(
          "[showMobileBackOptions] Confirm button clicked => returning"
        ),
          U();
      }),
      e.appendChild(t);
    let a = document.createElement("div");
    (a.id = "mobileBackSlider"),
      a.classList.add("cards-wrapper"),
      [
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
      ].forEach((e) => {
        let t = document.createElement("div");
        t.classList.add("part-option"),
          t.setAttribute("data-part-name", "Back"),
          t.setAttribute("data-mesh-name", e.meshName),
          (t.style.touchAction = "pan-y"),
          (t.style.cursor = "pointer"),
          d.design.jacket.Back === e.meshName && t.classList.add("selected");
        let s = document.createElement("div");
        s.classList.add("img-wrapper"), (s.style.touchAction = "pan-y");
        let n = document.createElement("img");
        (n.src = e.src),
          (n.alt = e.label),
          (n.style.touchAction = "pan-y"),
          (n.style.width = "100%"),
          (n.style.height = "auto"),
          s.appendChild(n);
        let i = document.createElement("p");
        (i.textContent = e.label),
          (i.style.touchAction = "pan-y"),
          t.appendChild(s),
          t.appendChild(i),
          t.addEventListener("click", () => {
            console.log("[showMobileBackOptions] Chosen back option:", e.label),
              a.querySelectorAll(".part-option").forEach((e) => {
                e.classList.remove("selected");
              }),
              t.classList.add("selected"),
              (d.design.jacket.Back = e.meshName),
              ep("Back", e.meshName);
          }),
          a.appendChild(t);
      }),
      e.appendChild(a),
      V("#mobileBackSlider");
  }
  function V(e) {
    let t = document.querySelector(e);
    if (!t) {
      console.error(`Slider container "${e}" not found.`);
      return;
    }
    let a = t.querySelector(".cards-wrapper");
    if (!a) {
      console.error(`"cards-wrapper" not found within "${e}".`);
      return;
    }
    let s = gsap.utils.toArray(".part-option.card_cardContainer", a);
    if (0 === s.length) {
      console.error("No cards found within the slider.");
      return;
    }
    eh(s, { paused: !0, draggable: !0, speed: 2, snap: 1, repeat: -1 }),
      (a.dataset.sliderInitialized = "true");
  }
  function G() {
    console.log(
      "[showMobilePocketsOptions] Displaying pocket design options..."
    );
    let e = document.getElementById("textureContainer");
    e.innerHTML = "";
    let t = document.createElement("button");
    (t.textContent = "Confirm"),
      t.classList.add("back-to-cat"),
      t.addEventListener("click", () => {
        console.log(
          "[showMobilePocketsOptions] Confirm button clicked => returning"
        ),
          U();
      }),
      e.appendChild(t);
    let a = document.createElement("div");
    a.classList.add("top-bottom-pockets-wrapper");
    let s = document.createElement("button");
    (s.textContent = "Top Pockets"),
      s.classList.add("top-bottom-btns"),
      s.addEventListener("click", () => {
        console.log("Top pockets button clicked"), el("top");
      });
    let n = document.createElement("button");
    (n.textContent = "Bottom Pockets"),
      n.classList.add("top-bottom-btns"),
      n.addEventListener("click", () => {
        console.log("Bottom pockets button clicked"), el("bottom");
      }),
      a.appendChild(s),
      a.appendChild(n),
      e.appendChild(a);
    let i = document.getElementById("mobilePocketsContainer");
    i
      ? (i.innerHTML = "")
      : (((i = document.createElement("div")).id = "mobilePocketsContainer"),
        e.appendChild(i)),
      el("top");
  }
  function U() {
    let e = document.getElementById("textureContainer");
    if (
      ((e.innerHTML = ""),
      D(),
      window.matchMedia("(max-width: 1024.9px)").matches)
    ) {
      let t = "";
      ["Back", "Lapels", "Pockets"].forEach((e) => {
        t += F(e);
      }),
        (e.innerHTML += `
      <div class="cards-wrapper design-options">
        ${t}
      </div>
    `);
      e.querySelectorAll(".design-options .card_cardContainer").forEach((e) => {
        e.addEventListener("click", () => {
          let t = e.getAttribute("data-test-id");
          console.log(`Clicked on jacket part: ${t}`),
            "Back" === t ? W() : "Lapels" === t ? R() : "Pockets" === t && G();
        });
      });
    } else {
      let a = "";
      ["Back", "Lapels", "Pockets"].forEach((e) => {
        a += F(e);
      }),
        (e.innerHTML += `
      <div class="controls">
        <button class="prevButton">Prev</button>
        <button class="nextButton">Next</button>
      </div>
      <div class="cards-wrapper design-options">
        ${a}
      </div>
    `);
      e.querySelectorAll(".design-options .card_cardContainer").forEach((e) => {
        e.addEventListener("click", () => {
          let t = e.getAttribute("data-test-id");
          console.log(`Clicked on jacket part: ${t}`),
            "Back" === t ? W() : "Lapels" === t ? R() : "Pockets" === t && G();
        });
      });
    }
  }
  function X() {
    let e = document.getElementById("textureContainer");
    if (
      ((e.innerHTML = ""),
      D(),
      window.matchMedia("(max-width: 1024.9px)").matches)
    ) {
      let t = "";
      ["Cut", "Pleat"].forEach((e) => {
        t += F(e);
      }),
        (e.innerHTML += `
      <div class="design-options">${t}</div>
    `);
      document
        .querySelectorAll(".design-options .card_cardContainer")
        .forEach((e) => {
          e.addEventListener("click", () => {
            let t = e.getAttribute("data-test-id"),
              a,
              s,
              n,
              i;
            console.log("Clicked Pants Part (mobile):", t),
              "Cut" === t
                ? ea()
                : "Pleat" === t &&
                  (console.log(
                    "[showMobilePleatOptions] Displaying pleat options..."
                  ),
                  ((a = document.getElementById("textureContainer")).innerHTML =
                    ""),
                  ((s = document.createElement("button")).textContent =
                    "Confirm "),
                  s.classList.add("back-to-cat"),
                  s.addEventListener("click", () => {
                    console.log(
                      "[showMobilePleatOptions] Confirm clicked => returning"
                    ),
                      X();
                  }),
                  a.appendChild(s),
                  ((n = document.createElement("div")).id =
                    "mobilePleatSlider"),
                  n.classList.add("cards-wrapper"),
                  (i = document.createElement("div")).classList.add(
                    "cards-wrapper"
                  ),
                  n.appendChild(i),
                  [
                    {
                      src: "./assets/pants/pleat/pleat1.png",
                      label: "Pleat 1",
                    },
                    {
                      src: "./assets/pants/pleat/pleat2.png",
                      label: "Pleat 2",
                    },
                    {
                      src: "./assets/pants/pleat/pleat3.png",
                      label: "Pleat 3",
                    },
                    {
                      src: "./assets/pants/pleat/pleat4.png",
                      label: "Pleat 4",
                    },
                    {
                      src: "./assets/pants/pleat/pleat5.png",
                      label: "Pleat 5",
                    },
                  ].forEach((e) => {
                    let t = document.createElement("div");
                    t.classList.add("card_cardContainer", "part-option"),
                      t.setAttribute("data-part-name", "Pleat"),
                      t.setAttribute("data-mesh-name", e.label),
                      (t.tabIndex = 0),
                      (t.style.touchAction = "pan-y"),
                      (t.style.cursor = "pointer");
                    let a = document.createElement("div");
                    a.classList.add("img-wrapper"),
                      (a.style.touchAction = "pan-y");
                    let s = document.createElement("img");
                    (s.src = e.src),
                      (s.alt = e.label),
                      (s.style.touchAction = "pan-y"),
                      (s.style.width = "100%"),
                      (s.style.height = "auto"),
                      a.appendChild(s);
                    let n = document.createElement("p");
                    (n.textContent = e.label),
                      (n.style.touchAction = "pan-y"),
                      t.appendChild(a),
                      t.appendChild(n),
                      t.addEventListener("click", () => {
                        console.log(
                          "[showMobilePleatOptions] Chosen pleat:",
                          e.label
                        ),
                          i.querySelectorAll(".part-option").forEach((e) => {
                            e.classList.remove("selected");
                          }),
                          t.classList.add("selected"),
                          (d.design.pants.pleat = e.label),
                          ep("Pleat", e.label);
                      }),
                      i.appendChild(t);
                  }),
                  a.appendChild(n),
                  V("#mobilePleatSlider"));
          });
        });
    } else
      (e.innerHTML += `
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
    `),
        O();
  }
  function Y(e) {
    let t = document.getElementById("sidePanel");
    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      let a = t.querySelector(".widescreen-step");
      a
        ? gsap.to(a, {
            y: window.innerHeight,
            duration: 0.5,
            ease: "power2.in",
            onComplete() {
              J(e);
              let a = t.querySelector(".widescreen-step");
              a &&
                (gsap.set(a, { y: -window.innerHeight }),
                gsap.to(a, { y: 0, duration: 0.8, ease: "power2.out" }));
            },
          })
        : J(e);
    } else {
      let s = t.querySelector(".widescreen-step");
      s
        ? gsap.to(s, {
            x: window.innerWidth,
            duration: 0.5,
            ease: "power2.in",
            onComplete() {
              J(e);
              let a = t.querySelector(".widescreen-step");
              a &&
                (gsap.set(a, { x: window.innerWidth }),
                gsap.to(a, { x: 0, duration: 0.8, ease: "power2.out" }));
            },
          })
        : J(e);
    }
  }
  function J(e) {
    !(function e(t) {
      if (!window.matchMedia("(max-width: 1024.9px)").matches) return;
      let a = document.getElementById("textureContainer");
      if (!a) {
        console.error("Element with ID 'textureContainer' not found.");
        return;
      }
      a.classList.remove(...["step-1", "step-2", "step-3", "step-4", "step-5"]),
        t >= 1 && t <= 5
          ? (a.classList.add(`step-${t}`),
            console.log(`Added class: step-${t}`))
          : console.warn(`Invalid step number: ${t}. Must be between 1 and 5.`);
    })(e);
    let t = document.getElementById("stepTitle"),
      a = document.getElementById("textureContainer"),
      s = document.getElementById("batchSelector"),
      n = document.querySelector("#sidePanel .back-button");
    switch (
      (n &&
        (n.remove(),
        console.log("[initializeStep] Existing back button removed.")),
      (t.innerHTML = ""),
      c)
    ) {
      case 1:
        (t.innerHTML = `
        <p>Here we’ve curated a selection of fabrics that best suits you.</p>
        <p>Please choose your preferred fabric group from the options below to proceed to the next step.</p>
      `),
          (s.style.display = "none"),
          en(),
          Q(),
          (a.style.display = "flex");
        break;
      case 2:
        if (
          ((t.innerHTML = `
          <p>Great choice!</br>Now, let’s move on to designing your garment.</p>
        `),
          (s.style.display = "none"),
          (a.style.display = "flex"),
          a.classList.add("texture-container"),
          window.matchMedia("(max-width: 1024.9px)").matches)
        ) {
          (t.innerHTML += `
            <p>Please choose which garment to design first:</p>
          `),
            (a.innerHTML = `
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
          `);
          let i = document.querySelector('[data-test-id="chooseJacket"]'),
            o = document.querySelector('[data-test-id="choosePants"]');
          i &&
            i.addEventListener("click", () => {
              U();
            }),
            o &&
              o.addEventListener("click", () => {
                X();
              });
        } else {
          var r;
          (t.innerHTML += `
            <p>Choose from the available options for each key design feature. Let’s start creating your perfect look!</p>
          `),
            (a.innerHTML = `
            <button class="accordion" data-category="jacket">
              Jacket <span class="sign-acc">+</span>
            </button>
            <div class="panel" style="max-height: 0px;">
              ${(r = [
                { partName: "Back", options: f.Back },
                { partName: "Lapels", options: f.Lapels },
                { partName: "Pockets", options: f.Pockets },
              ])
                .map((e) => {
                  if ("Pockets" === e.partName) {
                    let t;
                    return `
          <div class="part-item" data-part="${e.partName}">
            ${e.partName}
            <div class="part-options">
              <!-- Top Pockets Section -->
              <div class="sub-part top-pockets">
                <h4>Top Pockets</h4>
                ${e.options
                  .filter((e) =>
                    [
                      "4on2_pocket_4",
                      "4on2_pocket_5",
                      "4on2_pocket_6",
                    ].includes(e)
                  )
                  .map(
                    (
                      e,
                      t
                    ) => `<button class="part-option" data-part-name="Pockets" data-mesh-name="${e}">
                        Pockets Option ${t + 1}
                      </button>`
                  )
                  .join("")}
              </div>
              <!-- Bottom Pockets Section -->
              <div class="sub-part bottom-pockets">
                <h4>Bottom Pockets</h4>
                ${e.options
                  .filter((e) =>
                    [
                      "4on2_pocket_1",
                      "4on2_pocket_2",
                      "4on2_pocket_3",
                      "4on2_pocket_7",
                      "4on2_pocket_8",
                    ].includes(e)
                  )
                  .map(
                    (
                      e,
                      t
                    ) => `<button class="part-option" data-part-name="Pockets" data-mesh-name="${e}">
                        Pockets Option ${t + 1}
                      </button>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `;
                  }
                  return e.options && e.options.length > 1
                    ? `
          <div class="part-item" data-part="${e.partName}">
            ${e.partName}
            <div class="part-options">
              ${e.options
                .map(
                  (t, a) => `<button class="part-option" data-part-name="${
                    e.partName
                  }" data-mesh-name="${t}">
                      ${e.partName} Option ${a + 1}
                    </button>`
                )
                .join("")}
            </div>
          </div>
        `
                    : `<div class="part-item" data-part="${e.partName}">${e.partName}</div>`;
                })
                .join("")}
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
          `),
            O();
        }
        break;
      case 3:
        t.innerHTML = `
        <p>Now it’s time to add a personal touch to your garment!</p>
        <p>You can customize your suit with embroidery. Please select your preferred locations for the embroidery or choose "No Embroidery" to skip.</p>
      `;
        let l = window.matchMedia("(max-width: 1024.9px)").matches,
          p = `
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
        if (
          (l &&
            (p += `
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
        `),
          (p += "</div>"),
          l &&
            (p += `
          <div class="mobile-embroidery-buttons">
            <button id="locationButton" class="embroidery-button">Location</button>
            <button id="colorButton" class="embroidery-button">Color</button>
            <button id="charactersButton" class="embroidery-button">Characters</button>
          </div>
        `),
          (a.innerHTML = p),
          d.embroidery.jacket.length > 0)
        )
          d.embroidery.jacket.forEach((e) => {
            let t = Array.from(
              document.querySelectorAll(".jacket-embroidery-choice")
            ).find((t) => t.querySelector("p").innerText.trim() === e.location);
            t && t.classList.add("selected");
          });
        else {
          let m = document.querySelector(
            ".jacket-embroidery-choice.no-embroidery"
          );
          m && m.classList.add("selected");
        }
        window.matchMedia("(max-width: 1024.9px)").matches &&
          (function e() {
            let t = document.getElementById("locationButton"),
              a = document.getElementById("colorButton"),
              s = document.getElementById("charactersButton"),
              n = document.getElementById("embroideryChoices"),
              i = [t, a, s];
            function o(e) {
              i.forEach((e) => e?.classList.remove("active")),
                e.classList.add("active");
            }
            t &&
              t.addEventListener("click", () => {
                o(t);
                let e = document.getElementById("colorChoices"),
                  a = document.querySelector(".characters-inputs");
                n && n.classList.remove("hidden"),
                  e && e.classList.add("hidden"),
                  a && (a.style.display = "none"),
                  event.stopPropagation();
              }),
              a &&
                a.addEventListener("click", () => {
                  o(a);
                  let e = document.getElementById("colorChoices"),
                    t = document.querySelector(".characters-inputs");
                  n && n.classList.add("hidden"),
                    e && e.classList.remove("hidden"),
                    t && (t.style.display = "none"),
                    event.stopPropagation();
                }),
              s &&
                s.addEventListener("click", () => {
                  o(s), n && n.classList.add("hidden");
                  let e = document.getElementById("colorChoices");
                  e && e.classList.add("hidden");
                  if (0 === d.embroidery.jacket.length) {
                    alert("No embroidery locations chosen.");
                    return;
                  }
                  ey();
                  let t = document.querySelector(".characters-inputs");
                  t && (t.style.display = "block"), event.stopPropagation();
                });
            let r = document.getElementById("colorChoices");
            if (r) {
              let l = r.querySelectorAll(".color-option");
              l.forEach((e) => {
                e.addEventListener("click", (t) => {
                  l.forEach((e) => e.classList.remove("selected")),
                    e.classList.add("selected");
                  let a = e.getAttribute("data-color");
                  (d.embroidery.threadColor = a),
                    d.embroidery.jacket &&
                      d.embroidery.jacket.length > 0 &&
                      d.embroidery.jacket.forEach((e) => {
                        e.color = a;
                      }),
                    console.log("Mobile embroidery thread color selected:", a),
                    t.stopPropagation();
                });
              });
            }
            window.matchMedia("(max-width: 1024.9px)").matches ||
              document.addEventListener("click", (e) => {
                let i = document.getElementById("embroideryLocationsContainer");
                if (!i) {
                  console.error(
                    "Element with ID 'embroideryLocationsContainer' not found."
                  );
                  return;
                }
                if (
                  !(
                    i.contains(e.target) ||
                    (t && t.contains(e.target)) ||
                    (a && a.contains(e.target)) ||
                    (s && s.contains(e.target))
                  )
                ) {
                  n.classList.add("hidden");
                  let o = document.getElementById("colorChoices");
                  o && o.classList.add("hidden");
                }
              });
          })(),
          en(!1),
          y.forEach((e) => e.setEnabled(!0)),
          b.removeAllMeshes();
        break;
      case 4:
        if (
          window.matchMedia("(max-width: 1024.9px)").matches ||
          !d.embroidery.jacket ||
          0 === d.embroidery.jacket.length
        ) {
          Y((c = 5));
          return;
        }
        (t.innerHTML = `
        <p>Customize your jacket embroidery!</p>
        <p>Please enter your desired text and select your preferred color for each embroidery location.</p>
      `),
          (s.style.display = "none"),
          (a.style.display = "flex"),
          (a.style.padding = "0 20px"),
          (a.style.justifyContent = "start"),
          (a.innerHTML = `
        <h2 class="text-step3 step4 embroidery">Jacket Embroidery Customization</h2>
        <div id="embroideryCustomizationContainer"></div>
      `);
        let u = document.getElementById("embroideryCustomizationContainer");
        d.embroidery.jacket.forEach((e, t) => {
          u.innerHTML += `
          <div class="embroidery-customization" data-index="${t}">
            <h3>Embroidery ${t + 1}: ${e.location}</h3>
            <button class="remove-embroidery-button" data-index="${t}"><svg class="remove-emb"xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat">
  <path d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z"/>
</svg></button>
            <div class="embroidery-color-and-text">
              <div class="jacket-embroidery-choice">
                <img loading="lazy" class="embroidery-image" src="./assets/rectangle_115.webp" alt="${
                  e.location
                }">
                <p>${e.location}</p>
              </div>
              <div class="embroidery-color-and-text-input">
                <div class="embroidery-color-picker">
                  <label>Select Color:</label>
                  <div id="embroidery-thread-colors-picker-jacket-${t}" class="color-picker-container">
                    ${["#000000", "#FFFFFF", "#7A1313"]
                      .map(
                        (e) => `
      <div class="color-circle ${
        d.embroidery.threadColor === e ? "selected" : ""
      }" 
           data-color="${e}" 
           style="background-color: ${e};">
      </div>
    `
                      )
                      .join("")}
                  </div>
                </div>
                <div class="embroidery-text-input">
                  <label>Enter Text (max 20 characters):</label>
                  <input
                    type="text"
                    id="embroideryTextInput${t}"
                    maxlength="20"
                    placeholder="Your text here"
                    value="${e.text}"
                  />
                </div>
              </div>
            </div>
          </div>
        `;
        }),
          d.embroidery.jacket.forEach((e, t) => {
            let a = document.getElementById(
              `embroidery-thread-colors-picker-jacket-${t}`
            );
            if (a) {
              let s = a.querySelectorAll(".color-circle");
              s.forEach((a) => {
                a.addEventListener("click", () => {
                  s.forEach((e) => e.classList.remove("selected")),
                    a.classList.add("selected"),
                    (d.embroidery.jacket[t].color =
                      a.getAttribute("data-color"));
                }),
                  e.color &&
                    e.color === a.getAttribute("data-color") &&
                    a.classList.add("selected");
              });
            }
            let n = document.getElementById(`embroideryTextInput${t}`);
            n &&
              n.addEventListener("input", () => {
                d.embroidery.jacket[t].text = n.value.trim();
              });
            let i = document.querySelector(
              `.remove-embroidery-button[data-index="${t}"]`
            );
            i &&
              i.addEventListener("click", () => {
                d.embroidery.jacket.splice(t, 1), J(4);
              });
          });
        break;
      case 5:
        (document.querySelector(
          "body > main > div > div.canvas-container"
        ).style.display = "none"),
          (t.innerHTML = `
        <p>Please provide your measurements for the pants.</p>
        <p>Enter your measurements in the fields provided. If you need assistance, refer to the diagram.</p>
      `),
          (s.style.display = "none"),
          (a.style.display = "flex"),
          (a.style.padding = "0 20px"),
          (a.style.justifyContent = "center"),
          (a.innerHTML = `
        <div id="pantsMeasurementWrapper">
          <img loading="lazy" id="pantsMeasurementImage" src="assets/pants/pants.png" alt="Pants Diagram">
          ${[
            "Waist",
            "Crotch Depth",
            "Seat",
            "Knee",
            "Inseam",
            "Hips",
            "Thigh",
            "Outseam",
            "Ankle",
          ]
            .map(
              (e) => `
        <div class="measurement-input" id="${e.replace(/\s/g, "")}Measurement">
          <label for="${e}Input">${e}</label>
          <input type="number" id="${e}Input" />
          <div class="line"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 0.692308C2.39707 0.692308 0.692308 2.39707 0.692308 4.5C0.692308 6.60291 2.39707 8.30769 4.5 8.30769C6.60291 8.30769 8.30769 6.60291 8.30769 4.5C8.30769 2.39707 6.60291 0.692308 4.5 0.692308ZM0 4.5C0 2.01472 2.01472 0 4.5 0C6.98529 0 9 2.01472 9 4.5C9 6.98529 6.98529 9 4.5 9C2.01472 9 0 6.98529 0 4.5ZM4.5 4.15385C4.69117 4.15385 4.84615 4.30883 4.84615 4.5V6.11538C4.84615 6.30655 4.69117 6.46154 4.5 6.46154C4.30883 6.46154 4.15385 6.30655 4.15385 6.11538V4.5C4.15385 4.30883 4.30883 4.15385 4.5 4.15385ZM4.5 2.65385C4.24509 2.65385 4.03846 2.86049 4.03846 3.11538C4.03846 3.37028 4.24509 3.57692 4.5 3.57692H4.50462C4.75952 3.57692 4.96615 3.37028 4.96615 3.11538C4.96615 2.86049 4.75952 2.65385 4.50462 2.65385H4.5Z" fill="black"/>
          </svg>
        </div>
      `
            )
            .join("")}
        </div>
      `);
        let h = document.getElementById("pantsMeasurementWrapper");
        (h.style.position = "relative"),
          (h.style.display = "inline-block"),
          [
            "Waist",
            "Crotch Depth",
            "Seat",
            "Knee",
            "Inseam",
            "Hips",
            "Thigh",
            "Outseam",
            "Ankle",
          ].forEach((e) => {
            let t = document.getElementById(`${e}Input`);
            t.addEventListener("input", () => {
              d.measurements[e] = t.value;
            });
          }),
          (document.getElementById("nextButton").textContent = "Finish");
        break;
      default:
        (x.style.display = "block"), console.log("Invalid step");
    }
    !(function e(t) {
      let a = document.getElementById("sidePanel");
      if (!a) return;
      let s = a.querySelector(".widescreen-step");
      if (s) {
        for (; s.firstChild; ) a.insertBefore(s.firstChild, s);
        s.remove();
      }
      if (window.matchMedia("(max-width: 1024.9px)").matches) {
        let n = document.createElement("div");
        n.classList.add(`step-${t}-ws`, "widescreen-step"),
          Array.from(a.children).forEach((e) => {
            e.classList.contains("next-back-btns") || n.appendChild(e);
          }),
          a.insertBefore(n, a.firstChild);
      } else {
        let i = document.createElement("div");
        for (i.classList.add(`step-${t}-ws`, "widescreen-step"); a.firstChild; )
          i.appendChild(a.firstChild);
        a.appendChild(i);
      }
    })(e);
  }
  function Z(e, t, a, s) {
    let n = document.getElementById("textureContainer");
    n.innerHTML = "";
    let i = document.createElement("button");
    (i.textContent = "Back"),
      i.classList.add("back-to-cat"),
      i.addEventListener("click", () => {
        t ? K(e) : Q();
      }),
      n.appendChild(i);
    let o = document.createElement("div");
    (o.className = "cards-wrapper"),
      s.forEach((t, s) => {
        var n, i, r, l, c;
        let p,
          m,
          u,
          h,
          g,
          $,
          y,
          k,
          _ =
            ((n = e),
            (i = t),
            (r = s),
            (l = a),
            ((p = document.createElement("div")).className =
              "card_cardContainer card_small"),
            (p.dataset.testId = r),
            (p.tabIndex = r + 1),
            ((m = document.createElement("div")).className =
              "card_cardImageContainer"),
            ((u = document.createElement("img")).className = "card_cardImage"),
            (u.loading = "lazy"),
            (u.src = l + i),
            (u.alt = i),
            m.appendChild(u),
            ((h = document.createElement("div")).className =
              "card_infoSpaceContainer card_dark"),
            (h.dataset.testId = "info-btn"),
            (h.innerHTML = '<p class="susu-pcons" translate="no">info</p>'),
            m.appendChild(h),
            ((g = document.createElement("div")).className =
              "card_cardDetails card_hideMobileInfoText"),
            (($ = document.createElement("div")).className = "card_cardText"),
            ($.dataset.testId = "card-text"),
            ($.textContent = ee(i)),
            ((y = document.createElement("div")).className =
              "card_cardSubText"),
            (y.dataset.testId = "card-subtext"),
            (y.textContent = (k = (c = i)
              .replace(/\.[^.]+$/, "")
              .match(/-\s*(\$[\d.]+)/))
              ? k[1]
              : "$0.00"),
            g.appendChild($),
            g.appendChild(y),
            p.appendChild(m),
            p.appendChild(g),
            p.addEventListener("click", (e) => {
              var t, a, s, o;
              e.stopPropagation(),
                (t = n),
                (a = i),
                (s = p),
                (o = l),
                console.log("Texture clicked:", a),
                document
                  .querySelectorAll(".card_small.selected")
                  .forEach((e) => {
                    e.classList.remove("selected");
                  }),
                s.classList.add("selected"),
                et(o + a),
                (d.texture = a),
                console.log("userChoices.texture updated to:", d.texture);
            }),
            p);
        o.appendChild(_);
      }),
      n.appendChild(o),
      window.matchMedia("(max-width: 1024.9px)").matches && e$();
  }
  function K(e) {
    let t = document.getElementById("textureContainer");
    t.innerHTML = "";
    let a = document.createElement("button");
    (a.textContent = "Back"),
      a.classList.add("back-to-cat"),
      a.addEventListener("click", () => {
        Q();
      }),
      t.appendChild(a);
    let s = l[e];
    if (Array.isArray(s)) Z(e, null, "./assets/fabric/All Fabrics/", s);
    else {
      let n;
      if (
        window.matchMedia("(max-width: 1024.9px)").matches &&
        ("Colour" === e || "Design" === e)
      ) {
        let i = document.createElement("div");
        i.classList.add("cards-wrapper"),
          (n = document.createElement("div")).classList.add("cards-wrapper"),
          i.appendChild(n),
          t.appendChild(i);
      } else
        ((n = document.createElement("div")).className = "cards-wrapper"),
          t.appendChild(n);
      Object.keys(s).forEach((t, a) => {
        let i = s[t],
          o = (function e(t, a, s, n) {
            let i = document.createElement("div");
            (i.className = "card_cardContainer"),
              (i.dataset.testId = a),
              (i.tabIndex = n + 1),
              (i.style.cssText =
                "translate: none; rotate: none; scale: none; transform: translate(0px, 0px); touch-action: pan-y;");
            let o = document.createElement("div");
            (o.className = "card_cardImageContainer"),
              (o.style.touchAction = "pan-y;");
            s.slice(0, 4).forEach((e) => {
              let s = document.createElement("img");
              (s.className = "card_cardImage"), (s.loading = "lazy");
              let n = `./assets/fabric/${t}/${a}/`;
              (s.src = n + e),
                (s.alt = e),
                (s.style.touchAction = "pan-y;"),
                o.appendChild(s);
            });
            let r = document.createElement("div");
            (r.className = "card_itemAmountContainer"),
              (r.dataset.testId = "item-amount"),
              (r.style.touchAction = "pan-y;"),
              (r.textContent = s.length),
              o.appendChild(r),
              i.appendChild(o);
            let l = document.createElement("div");
            (l.className = "card_cardDetails"),
              (l.style.touchAction = "pan-y;");
            let c = document.createElement("p");
            (c.className = "card_cardText"),
              (c.dataset.testId = "card-text"),
              (c.style.touchAction = "pan-y;"),
              (c.textContent = a),
              l.appendChild(c),
              i.appendChild(l);
            let d = document.createElement("div");
            return (
              (d.className = "card_arrowIcon"),
              (d.style.touchAction = "pan-y;"),
              (d.innerHTML = `<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 330 330" width="30" height="30" style="touch-action: pan-y;">
    <path d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
       c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394
       c-5.857,5.858-5.857,15.355,0.001,21.213  
       C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
       l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
       C255,161.018,253.42,157.202,250.606,154.389z" style="touch-action: pan-y;"></path>
  </svg>`),
              i.appendChild(d),
              i.addEventListener("click", () => {
                let e = `./assets/fabric/${t}/${a}/`;
                Z(t, a, e, s);
              }),
              i
            );
          })(e, t, i, a);
        n.appendChild(o);
      }),
        window.matchMedia("(max-width: 1024.9px)").matches &&
          ("Colour" === e || "Design" === e) &&
          e$();
    }
  }
  function Q() {
    let e = document.getElementById("textureContainer");
    e.innerHTML = "";
    let t = document.createElement("div");
    (t.className = "cards-wrapper"),
      Object.keys(l).forEach((e, a) => {
        let s = (function e(t, a) {
          let s = document.createElement("div");
          (s.className = "card_cardContainer"),
            (s.dataset.testId = t),
            (s.tabIndex = a + 1),
            (s.style.cssText =
              "translate: none; rotate: none; scale: none; transform: translate(0px, 0px); touch-action: pan-y;");
          let n = document.createElement("div");
          (n.className = "card_cardImageContainer"),
            (n.style.touchAction = "pan-y;");
          let i = [],
            o = 0,
            r = l[t];
          if (Array.isArray(r)) (i = r.slice(0, 4)), (o = r.length);
          else {
            let c = Object.keys(r);
            c.length > 0 && ((i = r[c[0]].slice(0, 4)), (o = r[c[0]].length));
          }
          let d = "";
          (d =
            "All Fabrics" === t
              ? "./assets/fabric/All Fabrics/"
              : "Colour" === t
              ? "./assets/fabric/Colour/Beige/"
              : "Design" === t
              ? "./assets/fabric/Design/Birdseye/"
              : "Event" === t
              ? "./assets/fabric/Event/Business/"
              : "./assets/fabric/All Fabrics/"),
            i.forEach((e) => {
              let t = document.createElement("img");
              (t.className = "card_cardImage"),
                (t.loading = "lazy"),
                (t.src = d + e),
                (t.alt = e),
                (t.style.touchAction = "pan-y;"),
                n.appendChild(t);
            });
          let p = document.createElement("div");
          (p.className = "card_itemAmountContainer"),
            (p.dataset.testId = "item-amount"),
            (p.style.touchAction = "pan-y;"),
            (p.textContent = o),
            n.appendChild(p),
            s.appendChild(n);
          let m = document.createElement("div");
          (m.className = "card_cardDetails"), (m.style.touchAction = "pan-y;");
          let u = document.createElement("p");
          (u.className = "card_cardText"),
            (u.dataset.testId = "card-text"),
            (u.style.touchAction = "pan-y;"),
            (u.textContent = t),
            m.appendChild(u),
            s.appendChild(m);
          let h = document.createElement("div");
          return (
            (h.className = "card_arrowIcon"),
            (h.style.touchAction = "pan-y;"),
            (h.innerHTML = `<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 330 330" width="30" height="30" style="touch-action: pan-y;">
    <path d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  
       c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394
       c-5.857,5.858-5.857,15.355,0.001,21.213  
       C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394  
       l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  
       C255,161.018,253.42,157.202,250.606,154.389z" style="touch-action: pan-y;"></path>
  </svg>`),
            s.appendChild(h),
            s.addEventListener("click", () => {
              K(t);
            }),
            s
          );
        })(e, a);
        t.appendChild(s);
      }),
      e.appendChild(t),
      window.matchMedia("(max-width: 1024.9px)").matches && e$();
  }
  function ee(e) {
    return e.replace(/\.[^.]+$/, "").replace(/-\s*\$[\d.]+$/, "");
  }
  function et(e) {
    if (!m || (m.diffuseTexture && m.diffuseTexture.name === e)) return;
    let t = "./assets/fabric/placeholder.webp",
      a = new BABYLON.Texture(
        t,
        u,
        !1,
        !0,
        BABYLON.Texture.BILINEAR_SAMPLINGMODE,
        () => {
          console.log(`Placeholder texture loaded: ${t}`);
        },
        (e, a) => {
          console.error(`Failed to load placeholder texture: ${t}`, e, a);
        }
      );
    (a.uScale = 5),
      (a.vScale = 5),
      (m.diffuseTexture = a),
      (m.diffuseTexture.name = t);
    let s = new BABYLON.Texture(
      e,
      u,
      !1,
      !0,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      () => {
        console.log(`High-res texture loaded: ${e}`),
          (m.diffuseTexture = s),
          (m.diffuseTexture.name = e);
      },
      (t, a) => {
        console.error(`Failed to load texture: ${e}`, t, a);
      }
    );
    (s.uScale = 5),
      (s.vScale = 5),
      (m.backFaceCulling = !1),
      (m.specularColor = new BABYLON.Color3(0, 0, 0)),
      (m.ambientColor = new BABYLON.Color3(1, 1, 1));
  }
  function ea() {
    console.log("[showMobileCutOptions] Displaying cut options...");
    let e = document.getElementById("textureContainer");
    e.innerHTML = "";
    let t = document.createElement("button");
    (t.textContent = "Confirm "),
      t.classList.add("back-to-cat"),
      t.addEventListener("click", () => {
        console.log("[showMobileCutOptions] Confirm clicked => returning"), X();
      }),
      e.appendChild(t);
    let a = document.createElement("div");
    (a.id = "mobileCutSlider"), a.classList.add("cards-wrapper");
    let s = document.createElement("div");
    s.classList.add("cards-wrapper"),
      a.appendChild(s),
      [
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
      ].forEach((e) => {
        let t = document.createElement("div");
        t.classList.add("card_cardContainer", "part-option"),
          t.setAttribute("data-part-name", "Cut"),
          t.setAttribute("data-mesh-name", e.meshName),
          (t.tabIndex = 0),
          (t.style.touchAction = "pan-y"),
          (t.style.cursor = "pointer");
        let a = document.createElement("div");
        a.classList.add("img-wrapper"), (a.style.touchAction = "pan-y");
        let n = document.createElement("img");
        (n.src = e.src),
          (n.alt = e.label),
          (n.style.touchAction = "pan-y"),
          (n.style.width = "83px"),
          (n.style.height = "174px"),
          (n.style.objectFit = "contain"),
          a.appendChild(n);
        let i = document.createElement("p");
        (i.textContent = e.label),
          (i.style.touchAction = "pan-y"),
          t.appendChild(a),
          t.appendChild(i),
          t.addEventListener("click", () => {
            console.log("[showMobileCutOptions] Chosen cut:", e.label),
              s.querySelectorAll(".part-option").forEach((e) => {
                e.classList.remove("selected");
              }),
              t.classList.add("selected"),
              (d.design.pants.cut = e.meshName),
              ep("Cut", e.meshName);
          }),
          s.appendChild(t);
      }),
      e.appendChild(a),
      V("#mobileCutSlider");
  }
  function es(e) {
    let t = e.target.closest(".accordion"),
      a = e.target.closest(".sub_accordion");
    if (t) {
      console.log("[accordionClickHandler] Top-level accordion clicked:", t),
        t.classList.toggle("active");
      let s = t.querySelector(".sign-acc"),
        n = t.nextElementSibling;
      n.style.maxHeight && "0px" !== n.style.maxHeight
        ? ((n.style.maxHeight = "0px"),
          (s.innerHTML = "+"),
          console.log("[accordionClickHandler] Collapsing panel"))
        : ((n.style.maxHeight = "300px"),
          (s.innerHTML = "-"),
          console.log("[accordionClickHandler] Expanding panel")),
        document.querySelectorAll(".accordion").forEach((e) => {
          if (e !== t && e.classList.contains("active")) {
            e.classList.remove("active");
            let a = e.querySelector(".sign-acc"),
              s = e.nextElementSibling;
            s &&
              ((s.style.maxHeight = "0px"),
              (a.innerHTML = "+"),
              console.log(
                `[accordionClickHandler] Closing other accordion: ${e.getAttribute(
                  "data-category"
                )}`
              ));
          }
        }),
        b.removeAllMeshes();
      let i = t.getAttribute("data-category");
      console.log("[accordionClickHandler] Category is:", i),
        "jacket" === i
          ? (console.log("[accordionClickHandler] Loading Jacket options..."),
            en(),
            $.length > 0 || console.warn("No jacket meshes available to zoom."))
          : "pants" === i
          ? console.log("[accordionClickHandler] Loading Pants options...")
          : "vest" === i
          ? (console.log(
              "[accordionClickHandler] Vest option clicked. (Example only)"
            ),
            $.forEach((e) => e.setEnabled(!1)),
            y.forEach((e) => e.setEnabled(!1)),
            b.removeAllMeshes())
          : (console.log("[accordionClickHandler] Show all (fallback case)."),
            $.forEach((e) => e.setEnabled(!0)),
            y.forEach((e) => e.setEnabled(!0)),
            Object.keys(C).forEach((e) => {
              Object.keys(C[e]).forEach((t) => {
                let a = C[e][t];
                a && a.setEnabled(!0);
              });
            }),
            b.removeAllMeshes());
    } else if (a) {
      console.log("[accordionClickHandler] Sub-accordion clicked:", a),
        a.classList.toggle("active");
      let o = a.querySelector(".sign-acc"),
        r = a.nextElementSibling;
      r.style.maxHeight && "0px" !== r.style.maxHeight
        ? ((r.style.maxHeight = "0px"),
          (o.innerHTML = "+"),
          console.log("[accordionClickHandler] Collapsing sub-panel"))
        : ((r.style.maxHeight = r.scrollHeight + "px"),
          (o.innerHTML = "-"),
          console.log(
            "[accordionClickHandler] Expanding sub-panel to:",
            r.style.maxHeight
          ));
      let l = a.getAttribute("data-category");
      console.log("[accordionClickHandler] Sub-category is:", l),
        "cut" === l &&
          window.matchMedia("(max-width: 1024.9px)").matches &&
          (console.log(
            "[accordionClickHandler] 'Cut' was clicked on MOBILE -> Show mobile cut function"
          ),
          ea());
    }
  }
  function en() {
    Object.keys(C).forEach((e) => {
      let t = d.design.jacket[e];
      t &&
        Object.keys(C[e]).forEach((a) => {
          let s = C[e][a];
          s &&
            (s.setEnabled(a === t),
            a === t &&
              ((s.renderingGroupId = 2),
              (L[e] = s),
              b.addMesh(s, BABYLON.Color3.White())));
        });
    }),
      eg(),
      Object.entries(d.design.jacket).forEach(([e, t]) => {
        if (!t) return;
        let a = document.querySelector(
          `.part-option[data-part-name="${e}"][data-mesh-name="${t}"]`
        );
        a && a.classList.add(ek(e, t));
      });
    let e = d.design.jacket.PocketsTop;
    if (e) {
      let t = document.querySelector(
        `.part-option[data-part-name="Pockets"][data-mesh-name="${e}"]`
      );
      t && t.classList.add("selected-top-pocket");
    }
    let a = d.design.jacket.PocketsBottom;
    if (a) {
      let s = document.querySelector(
        `.part-option[data-part-name="Pockets"][data-mesh-name="${a}"]`
      );
      s && s.classList.add("selected-bottom-pocket");
    }
    let n = d.design.jacket.Pockets;
    if (n) {
      Object.keys(C.Pockets).forEach((e) => {
        C.Pockets[e].setEnabled(!1);
      });
      let i = C.Pockets[n];
      i &&
        (i.setEnabled(!0),
        (L.Pockets = i),
        b.addMesh(i, BABYLON.Color3.White()));
    }
  }
  function ei(e) {
    let t = e.target.closest(".part-option");
    if (!t) return;
    let a = t.getAttribute("data-part-name"),
      s = t.getAttribute("data-mesh-name");
    if (!a || !s) {
      console.warn("Missing data-part-name or data-mesh-name attributes.");
      return;
    }
    if (
      !window.matchMedia("(max-width: 1024.9px)").matches ||
      "Pockets" !== a
    ) {
      if ("Pockets" === a) {
        let l = ek(a, s);
        if (t.classList.contains(l)) {
          t.classList.remove(l),
            (d.design.jacket.Pockets = void 0),
            eo.includes(s)
              ? (d.design.jacket.PocketsTop = void 0)
              : er.includes(s) && (d.design.jacket.PocketsBottom = void 0),
            ec(s);
          return;
        }
      }
      if ((ep(a, s), "Pockets" === a)) {
        let c = eo.includes(s),
          p = er.includes(s);
        c
          ? eo.forEach((e) => {
              let t = document.querySelector(
                `.part-option[data-mesh-name="${e}"]`
              );
              t && e !== s && t.classList.remove("selected-top-pocket");
            })
          : p &&
            er.forEach((e) => {
              let t = document.querySelector(
                `.part-option[data-mesh-name="${e}"]`
              );
              t && e !== s && t.classList.remove("selected-bottom-pocket");
            });
      } else
        document
          .querySelectorAll(`.part-option[data-part-name="${a}"]`)
          .forEach((e) => {
            e.classList.remove(
              "selected-back",
              "selected-lapel",
              "selected-top-pocket",
              "selected-bottom-pocket"
            );
          });
      if (
        (t.classList.add(ek(a, s)),
        "Back" === a
          ? (function e() {
              if (
                void 0 === n ||
                void 0 === i ||
                void 0 === o ||
                void 0 === r
              ) {
                console.error("Initial camera parameters are not set.");
                return;
              }
              let t = o + Math.PI - (h.rotation.y - N);
              (t %= 2 * Math.PI),
                BABYLON.Animation.CreateAndStartAnimation(
                  "cameraRadiusResetBack",
                  g,
                  "radius",
                  60,
                  120,
                  g.radius,
                  n,
                  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                ),
                BABYLON.Animation.CreateAndStartAnimation(
                  "cameraTargetResetBack",
                  g,
                  "target",
                  60,
                  120,
                  g.target,
                  i,
                  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                ),
                BABYLON.Animation.CreateAndStartAnimation(
                  "cameraAlphaResetBack",
                  g,
                  "alpha",
                  60,
                  120,
                  g.alpha,
                  t,
                  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                ),
                BABYLON.Animation.CreateAndStartAnimation(
                  "cameraBetaResetBack",
                  g,
                  "beta",
                  60,
                  120,
                  g.beta,
                  r,
                  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                ),
                console.log(
                  "Camera reset to back view (with model rotation offset)."
                );
            })()
          : ("Lapels" === a || "Pockets" === a) && q(),
        ["Pockets"].includes(a))
      ) {
        let m = document.querySelector('.accordion[data-category="jacket"]');
        m && !m.classList.contains("active") ? m.click() : en();
      }
    }
  }
  (u = j()),
    w.runRenderLoop(() => u && u.render()),
    window.addEventListener("resize", () => w.resize());
  let eo = ["4on2_pocket_4", "4on2_pocket_5", "4on2_pocket_6"],
    er = [
      "4on2_pocket_1",
      "4on2_pocket_2",
      "4on2_pocket_3",
      "4on2_pocket_7",
      "4on2_pocket_8",
    ];
  function el(e) {
    let t = [
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
      ],
      a;
    if (
      ("top" === e
        ? (a = t.filter((e) => eo.includes(e.meshName)))
        : "bottom" === e && (a = t.filter((e) => er.includes(e.meshName))),
      "top" === e)
    ) {
      let s = document.getElementById("mobilePocketsContainer");
      if ((s.classList.add("cards-wrapper"), !s)) return;
      (s.innerHTML = ""),
        a.forEach((e) => {
          let t = document.createElement("div");
          t.classList.add("part-option", "card_cardContainer"),
            t.setAttribute("data-part-name", "Pockets"),
            t.setAttribute("data-mesh-name", e.meshName),
            (t.style.touchAction = "pan-y"),
            (t.style.cursor = "pointer"),
            d.design.jacket.PocketsTop === e.meshName &&
              t.classList.add("selected", "selected-top-pocket");
          let a = document.createElement("div");
          a.classList.add("img-wrapper"), (a.style.touchAction = "pan-y");
          let n = document.createElement("img");
          (n.src = e.src),
            (n.alt = e.label),
            (n.style.touchAction = "pan-y"),
            (n.style.width = "100%"),
            (n.style.height = "auto"),
            a.appendChild(n);
          let i = document.createElement("p");
          (i.textContent = e.label),
            (i.style.touchAction = "pan-y"),
            t.appendChild(a),
            t.appendChild(i),
            t.addEventListener("click", () => {
              console.log(
                "[renderMobilePocketsOptions] Chosen top pocket option:",
                e.label
              ),
                s.querySelectorAll(".part-option").forEach((e) => {
                  e.classList.remove("selected", "selected-top-pocket");
                }),
                t.classList.add("selected", "selected-top-pocket"),
                (d.design.jacket.PocketsTop = e.meshName),
                ep("Pockets", e.meshName, "top"),
                q();
            }),
            s.appendChild(t);
        });
    } else if ("bottom" === e) {
      let n = document.getElementById("mobilePocketsSlider");
      if (n) n.innerHTML = "";
      else {
        ((n = document.createElement("div")).id = "mobilePocketsSlider"),
          n.classList.add("cards-wrapper");
        let i = document.getElementById("mobilePocketsContainer");
        i && ((i.innerHTML = ""), i.appendChild(n));
      }
      let o = document.createElement("div");
      o.classList.add("cards-wrapper"),
        (o.id = "mobilePocketsSliderWrapper"),
        n.appendChild(o),
        a.forEach((e) => {
          let t = document.createElement("div");
          t.classList.add("part-option", "card_cardContainer"),
            t.setAttribute("data-part-name", "Pockets"),
            t.setAttribute("data-mesh-name", e.meshName),
            (t.style.touchAction = "pan-y"),
            (t.style.cursor = "pointer"),
            d.design.jacket.PocketsBottom === e.meshName &&
              t.classList.add("selected", "selected-bottom-pocket");
          let a = document.createElement("div");
          a.classList.add("img-wrapper"), (a.style.touchAction = "pan-y");
          let s = document.createElement("img");
          (s.src = e.src),
            (s.alt = e.label),
            (s.style.touchAction = "pan-y"),
            (s.style.width = "100%"),
            (s.style.height = "auto"),
            a.appendChild(s);
          let n = document.createElement("p");
          (n.textContent = e.label),
            (n.style.touchAction = "pan-y"),
            t.appendChild(a),
            t.appendChild(n),
            t.addEventListener("click", () => {
              console.log(
                "[renderMobilePocketsOptions] Chosen bottom pocket option:",
                e.label
              ),
                o.querySelectorAll(".part-option").forEach((e) => {
                  e.classList.remove("selected", "selected-bottom-pocket");
                }),
                t.classList.add("selected", "selected-bottom-pocket"),
                (d.design.jacket.PocketsBottom = e.meshName),
                ep("Pockets", e.meshName, "bottom"),
                q();
            }),
            o.appendChild(t);
        }),
        o.removeAttribute("data-sliderInitialized"),
        V("#mobilePocketsSlider");
    }
  }
  function ec(e) {
    let t = document.querySelector(`.part-option[data-mesh-name="${e}"]`);
    t &&
      t.classList.remove(
        "selected-top-pocket",
        "selected-bottom-pocket",
        "selected-pockets",
        "selected-back",
        "selected-lapel"
      );
    let a = C.Pockets[e];
    a && a.setEnabled(!1);
  }
  function ed(e) {
    let t = C.Pockets[e];
    t &&
      (t.setEnabled(!0),
      (t.renderingGroupId = 2),
      b.removeAllMeshes(),
      b.addMesh(t, BABYLON.Color3.White()));
    let a = document.querySelector(`.part-option[data-mesh-name="${e}"]`);
    if (a) {
      let s = "selected-pockets";
      eo.includes(e)
        ? (s = "selected-top-pocket")
        : er.includes(e) && (s = "selected-bottom-pocket"),
        a.classList.remove(
          "selected-back",
          "selected-lapel",
          "selected-top-pocket",
          "selected-bottom-pocket"
        ),
        a.classList.add(s);
    }
  }
  function ep(e, t, a) {
    if (!C[e]) {
      console.warn(
        `switchPartMesh: No mesh options available for part "${e}".`
      );
      return;
    }
    if ("Pockets" !== e) {
      Object.keys(C[e]).forEach((t) => {
        let a = C[e][t];
        a && a.setEnabled(!1);
      });
      let s = C[e][t];
      s
        ? (s.setEnabled(!0),
          (s.renderingGroupId = 2),
          (L[e] = s),
          (d.design.jacket[e] = t),
          Object.keys(C[e]).forEach((t) => {
            let a = C[e][t];
            a && b.removeMesh(a);
          }),
          b.addMesh(s, BABYLON.Color3.White()))
        : console.warn(
            `switchPartMesh: No mesh found for "${t}" in part "${e}".`
          );
      let n = document.querySelector(`.part-option[data-mesh-name="${t}"]`);
      n &&
        (n.classList.remove(
          "selected-back",
          "selected-lapel",
          "selected-top-pocket",
          "selected-bottom-pocket"
        ),
        n.classList.add(ek(e, t)));
      return;
    }
    if (window.matchMedia("(max-width: 1024.9px)").matches) {
      if ("top" === a) {
        eo.forEach((e) => {
          let t = C.Pockets[e];
          t && (t.setEnabled(!1), b.removeMesh(t));
        });
        let i = C.Pockets[t];
        i
          ? (i.setEnabled(!0),
            (i.renderingGroupId = 2),
            (L.PocketsTop = i),
            (d.design.jacket.PocketsTop = t),
            eo.forEach((e) => {
              let t = C.Pockets[e];
              t && b.removeMesh(t);
            }),
            b.addMesh(i, BABYLON.Color3.White()))
          : console.warn(
              `switchPartMesh: No top pocket mesh found for "${t}".`
            );
      } else if ("bottom" === a) {
        er.forEach((e) => {
          let t = C.Pockets[e];
          t && (t.setEnabled(!1), b.removeMesh(t));
        });
        let o = C.Pockets[t];
        o
          ? (o.setEnabled(!0),
            (o.renderingGroupId = 2),
            (L.PocketsBottom = o),
            (d.design.jacket.PocketsBottom = t),
            er.forEach((e) => {
              let t = C.Pockets[e];
              t && b.removeMesh(t);
            }),
            b.addMesh(o, BABYLON.Color3.White()))
          : console.warn(
              `switchPartMesh: No bottom pocket mesh found for "${t}".`
            );
      } else
        console.warn(
          "switchPartMesh (mobile): No mobileSelection provided for Pockets."
        );
    } else {
      let r = eo.includes(t),
        l = er.includes(t);
      r
        ? d.design.jacket.PocketsTop === t
          ? ((d.design.jacket.PocketsTop = void 0),
            ec(t),
            b.removeMesh(C.Pockets[t]))
          : (eo.forEach((e) => ec(e)), ed(t), (d.design.jacket.PocketsTop = t))
        : l &&
          (d.design.jacket.PocketsBottom === t
            ? ((d.design.jacket.PocketsBottom = void 0),
              ec(t),
              b.removeMesh(C.Pockets[t]))
            : (er.forEach((e) => ec(e)),
              ed(t),
              (d.design.jacket.PocketsBottom = t)));
    }
  }
  function em(e) {}
  function eu(e) {
    let t = e.target.closest(".jacket-embroidery-choice");
    if (!t) return;
    let a = t.querySelector("p").innerText.trim();
    if ("No Embroidery" === a)
      (d.embroidery.jacket = []),
        document
          .querySelectorAll(".jacket-embroidery-choice")
          .forEach((e) => e.classList.remove("selected")),
        t.classList.add("selected");
    else {
      let s = d.embroidery.jacket.findIndex((e) => e.location === a);
      if (
        (-1 === s
          ? (d.embroidery.jacket.push({ location: a, text: "", color: null }),
            t.classList.add("selected"))
          : (d.embroidery.jacket.splice(s, 1), t.classList.remove("selected")),
        d.embroidery.jacket.length > 0)
      ) {
        let n = document.querySelector(
          ".jacket-embroidery-choice.no-embroidery"
        );
        n && n.classList.remove("selected");
      } else {
        let i = document.querySelector(
          ".jacket-embroidery-choice.no-embroidery"
        );
        i && i.classList.add("selected");
      }
    }
    d.embroidery.hasEmbroidery = d.embroidery.jacket.length > 0;
    let o = document.querySelector(".characters-inputs");
    o && "none" !== o.style.display && (ey(), (o.style.display = "block"));
  }
  function ee(e) {
    return e.replace(/\.[^.]+$/, "").replace(/-\s*\$[\d.]+$/, "");
  }
  function eh(e, t) {
    (e = gsap.utils.toArray(e)), (t = t || {});
    let a = gsap.timeline({
        repeat: t.repeat,
        paused: t.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => a.totalTime(a.rawTime() + 100 * a.duration()),
      }),
      s = e.length,
      n = e[0].offsetLeft,
      i = [],
      o = [],
      r = [],
      l = 0,
      c = 100 * (t.speed || 1),
      d = !1 === t.snap ? (e) => e : gsap.utils.snap(t.snap || 1),
      p = () =>
        e.forEach((e, t) => {
          (o[t] = parseFloat(gsap.getProperty(e, "width", "px"))),
            (r[t] = d(
              (parseFloat(gsap.getProperty(e, "x", "px")) / o[t]) * 100 +
                gsap.getProperty(e, "xPercent")
            ));
        }),
      m = () =>
        e[s - 1].offsetLeft +
        (r[s - 1] / 100) * o[s - 1] -
        n +
        e[s - 1].offsetWidth * gsap.getProperty(e[s - 1], "scaleX") +
        (parseFloat(t.paddingRight) || 0),
      u,
      h,
      g,
      $,
      y,
      k;
    for (
      p(),
        gsap.set(e, { xPercent: (e) => r[e] }),
        gsap.set(e, { x: 0 }),
        u = m(),
        k = 0;
      k < s;
      k++
    )
      (y = e[k]),
        (h = (r[k] / 100) * o[k]),
        ($ = (g = y.offsetLeft + h - n) + o[k] * gsap.getProperty(y, "scaleX")),
        a
          .to(y, { xPercent: d(((h - $) / o[k]) * 100), duration: $ / c }, 0)
          .fromTo(
            y,
            { xPercent: d(((h - $ + u) / o[k]) * 100) },
            {
              xPercent: r[k],
              duration: (h - $ + u - h) / c,
              immediateRender: !1,
            },
            $ / c
          )
          .add("label" + k, g / c),
        (i[k] = g / c);
    function _(e, t) {
      (t = t || {}), Math.abs(e - l) > s / 2 && (e += e > l ? -s : s);
      let n = gsap.utils.wrap(0, s, e),
        o = i[n];
      return (
        o > a.time() != e > l &&
          ((t.modifiers = { time: gsap.utils.wrap(0, a.duration()) }),
          (o += a.duration() * (e > l ? 1 : -1))),
        (l = n),
        (t.overwrite = !0),
        a.tweenTo(o, t)
      );
    }
    if (
      ((a.next = (e) => _(l + 1, e)),
      (a.previous = (e) => _(l - 1, e)),
      (a.current = () => l),
      (a.toIndex = (e, t) => _(e, t)),
      (a.updateIndex = () => (l = Math.round(a.progress() * e.length))),
      (a.times = i),
      (a.items = e),
      a.progress(1, !0).progress(0, !0),
      t.reversed && (a.vars.onReverseComplete(), a.reverse()),
      t.draggable && "function" == typeof Draggable)
    ) {
      let b = document.createElement("div"),
        v = gsap.utils.wrap(0, 1),
        f,
        C,
        E,
        L,
        x,
        w = () => a.progress(v(C + (E.startX - E.x) * f)),
        A = () => a.updateIndex();
      "undefined" == typeof InertiaPlugin &&
        console.warn(
          "InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club"
        ),
        (E = Draggable.create(b, {
          trigger: e[0].parentNode,
          type: "x",
          onPress() {
            (C = a.progress()),
              a.progress(0),
              p(),
              (f = 1 / (u = m())),
              (x = Math.pow(
                10,
                (((L = u / e.length) + "").split(".")[1] || "").length
              )),
              a.progress(C);
          },
          onDrag: w,
          onThrowUpdate: w,
          inertia: !0,
          snap(e) {
            let t = Math.round(parseFloat(e) / L) * L * x;
            return (t - (t % 1)) / x;
          },
          onRelease: A,
          onThrowComplete: () => gsap.set(b, { x: 0 }) && A(),
        })[0]);
    }
    return a;
  }
  function eg() {
    g.inputs.attached.keyboard || g.attachControl(x, !0),
      console.log("Camera controls enabled.");
  }
  function e$() {
    document.querySelectorAll(".cards-wrapper").forEach((e) => {
      if (e.dataset.sliderInitialized) return;
      let t;
      eh(gsap.utils.toArray(".card_cardContainer", e), {
        paused: !0,
        draggable: !0,
        speed: 2,
        snap: 1,
      }).progress(0, !1),
        gsap.set(e, { x: 0 }),
        (e.dataset.sliderInitialized = "true");
    });
  }
  function ey() {
    let e = document.querySelector(".characters-inputs");
    if ((e && e.remove(), 0 === d.embroidery.jacket.length)) return;
    if (!v && !(v = document.getElementById("embroideryLocationsContainer"))) {
      console.error(
        "Element with ID 'embroideryLocationsContainer' not found."
      );
      return;
    }
    let t = document.createElement("div");
    t.classList.add("characters-inputs");
    let a = '<h3 class="embroidery-text">Embroidery Text:</h3>';
    d.embroidery.jacket.forEach((e, t) => {
      a += `
      <div class="embroidery-input-group">
        <input
          class="embroidery-input"
          placeholder="${e.location} Enter your initials"
          type="text"
          id="embroideryTextInput${t}"
          maxlength="20"
          value="${e.text || ""}"
        />
      </div>
    `;
    }),
      (t.innerHTML = a),
      v.appendChild(t),
      d.embroidery.jacket.forEach((e, t) => {
        let a = document.getElementById(`embroideryTextInput${t}`);
        a &&
          a.addEventListener("input", () => {
            e.text = a.value.trim();
          });
      });
  }
  function ek(e, t) {
    switch (e) {
      case "Back":
        return "selected-back";
      case "Lapels":
        return "selected-lapel";
      case "Pockets":
        if (eo.includes(t)) return "selected-top-pocket";
        if (er.includes(t)) return "selected-bottom-pocket";
        return "selected-pockets";
      default:
        return "selected";
    }
  }
  document.getElementById("backButton").addEventListener("click", function () {
    q(),
      eg(),
      c > 1 &&
        (5 === c ? (c = 0 === d.embroidery.jacket.length ? 3 : 4) : c--,
        Y(c),
        eg()),
      (document.querySelector(
        "body > main > div > div.canvas-container"
      ).style.display = "block");
  }),
    document
      .getElementById("nextButton")
      .addEventListener("click", function () {
        eg(), q();
        let t = null;
        if (1 === c) {
          if (d.texture) {
            let a = ee(d.texture);
            (t = { texture: a }), (d.texture = a);
          } else
            (t = { texture: "E5102-38.webp" }), (d.texture = "E5102-38.webp");
        } else if (2 === c) t = { design: d.design };
        else if (3 === c) t = { jacketEmbroidery: d.embroidery.jacket };
        else if (4 === c)
          t = { jacketEmbroideryCustomizations: d.embroidery.jacket };
        else if (5 === c) {
          (function e() {
            for (let t of [
              "Waist",
              "Crotch Depth",
              "Seat",
              "Knee",
              "Inseam",
              "Hips",
              "Thigh",
              "Outseam",
              "Ankle",
            ])
              if (
                !d.measurements ||
                !d.measurements[t] ||
                "" === d.measurements[t]
              )
                return !1;
            return !0;
          })()
            ? Y(++c)
            : alert("Please fill in all measurements before proceeding.");
          return;
        }
        console.log("Current Step: ", c),
          console.log("Selected Choice: ", t),
          console.log("User Choices: ", d),
          c < 5
            ? (3 === c && 0 === d.embroidery.jacket.length ? (c = 5) : c++,
              Y(c))
            : 5 === c ||
              (function t() {
                let a =
                  "Configuration Complete! Thank you for customizing your suit.\n\n";
                for (let s in ((a += `Texture: ${d.texture}
`),
                (a += "Design Selections:\n"),
                d.design.jacket))
                  a += `  ${s}: ${d.design.jacket[s]}
`;
                for (let n in d.design.pants)
                  a += `  ${n}: ${d.design.pants[n]}
`;
                if (
                  (d.embroidery.hasEmbroidery && d.embroidery.jacket.length > 0
                    ? ((a += "Embroidery Locations:\n"),
                      d.embroidery.jacket.forEach((e, t) => {
                        (a += `  Embroidery ${t + 1}:
`),
                          (a += `    Location: ${e.location}
`),
                          (a += `    Text: ${e.text || "N/A"}
`),
                          (a += `    Color: ${e.color || "N/A"}
`);
                      }))
                    : (a += "No Embroidery Selected.\n"),
                  d.embroidery.threadColor &&
                    (a += `Thread Color (Mobile): ${d.embroidery.threadColor}
`),
                  d.measurements)
                )
                  for (let i in ((a += "Measurements:\n"), d.measurements))
                    a += `  ${i}: ${d.measurements[i]}
`;
                alert(a),
                  e.sendUserChoicesEmail(d),
                  window.parent.postMessage(
                    { type: "userChoices", data: d },
                    "*"
                  );
              })();
      }),
    document
      .getElementById("textureContainer")
      .addEventListener("click", function (e) {
        if (e.target.classList.contains("card_cardImage"));
        else if (e.target.closest(".pants-item img")) {
          document
            .querySelectorAll(".pants-item img")
            .forEach((e) => e.classList.remove("selected")),
            e.target.closest(".pants-item img").classList.add("selected");
          let t = e.target.closest(".pants-item img").alt;
          d.design.pants.Pockets = t;
        }
      }),
    fetch("textures.json")
      .then((e) => e.json())
      .then((e) => {
        (l = e),
          (function e() {
            if (!I) {
              I = !0;
              document
                .getElementById("textureContainer")
                .addEventListener("click", es);
            }
          })(),
          (function e() {
            if (!M) {
              M = !0;
              document
                .getElementById("textureContainer")
                .addEventListener("click", ei);
            }
          })(),
          (function e() {
            if (!P) {
              P = !0;
              document
                .getElementById("textureContainer")
                .addEventListener("click", em);
            }
          })(),
          (function e() {
            if (!T) {
              T = !0;
              document
                .getElementById("textureContainer")
                .addEventListener("click", eu);
            }
          })();
      })
      .catch((e) => console.error("Error loading textures.json:", e)),
    (t = !0),
    (a = !0),
    $.forEach((e) => e.setEnabled(t)),
    y.forEach((e) => e.setEnabled(a));
  let e_ = document.getElementById("arrow");
  e_
    ? e_.addEventListener("click", () => {
        var e;
        let t, a, s;
        (e = Math.PI / 2),
          (t = h.rotation.y + e),
          (a = new BABYLON.Animation(
            "rotateAnimation",
            "rotation.y",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
          )),
          (s = [
            { frame: 0, value: h.rotation.y },
            { frame: 120, value: t },
          ]),
          a.setKeys(s),
          (h.animations = []),
          h.animations.push(a),
          u.beginAnimation(h, 0, 120, !1, 1, () => {}),
          (h.rotation.y = t),
          console.log(`Model rotated to Y=${t}`);
      })
    : console.warn('Arrow element with id "arrow" not found.'),
    document.getElementById("resetCameraButton").addEventListener("click", q);
});
