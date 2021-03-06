var GLTFLoader = (THREE.GLTFLoader = (function () {
  function e(e) {
    THREE.Loader.call(this, e),
      (this.dracoLoader = null),
      (this.ddsLoader = null);
  }
  e.prototype = Object.assign(Object.create(THREE.Loader.prototype), {
    constructor: e,
    load: function (e, t, r, a) {
      var s,
        n = this;
      (s =
        "" !== this.resourcePath
          ? this.resourcePath
          : "" !== this.path
          ? this.path
          : THREE.LoaderUtils.extractUrlBase(e)),
        n.manager.itemStart(e);
      var o = function (t) {
          a ? a(t) : console.error(t),
            n.manager.itemError(e),
            n.manager.itemEnd(e);
        },
        i = new THREE.FileLoader(n.manager);
      i.setPath(this.path),
        i.setResponseType("arraybuffer"),
        "use-credentials" === n.crossOrigin && i.setWithCredentials(!0),
        i.load(
          e,
          function (r) {
            try {
              n.parse(
                r,
                s,
                function (r) {
                  t(r), n.manager.itemEnd(e);
                },
                o
              );
            } catch (e) {
              o(e);
            }
          },
          r,
          o
        );
    },
    setDRACOLoader: function (e) {
      return (this.dracoLoader = e), this;
    },
    setDDSLoader: function (e) {
      return (this.ddsLoader = e), this;
    },
    parse: function (e, p, m, f) {
      var E,
        T = {};
      if ("string" == typeof e) E = e;
      else if (THREE.LoaderUtils.decodeText(new Uint8Array(e, 0, 4)) === o) {
        try {
          T[t.KHR_BINARY_GLTF] = new (function (e) {
            (this.name = t.KHR_BINARY_GLTF),
              (this.content = null),
              (this.body = null);
            var r = new DataView(e, 0, i);
            if (
              ((this.header = {
                magic: THREE.LoaderUtils.decodeText(
                  new Uint8Array(e.slice(0, 4))
                ),
                version: r.getUint32(4, !0),
                length: r.getUint32(8, !0),
              }),
              this.header.magic !== o)
            )
              throw new Error(
                "THREE.GLTFLoader: Unsupported glTF-Binary header."
              );
            if (this.header.version < 2)
              throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
            var a = new DataView(e, i),
              s = 0;
            for (; s < a.byteLength; ) {
              var n = a.getUint32(s, !0);
              s += 4;
              var c = a.getUint32(s, !0);
              if (((s += 4), c === l.JSON)) {
                var u = new Uint8Array(e, i + s, n);
                this.content = THREE.LoaderUtils.decodeText(u);
              } else if (c === l.BIN) {
                var p = i + s;
                this.body = e.slice(p, p + n);
              }
              s += n;
            }
            if (null === this.content)
              throw new Error("THREE.GLTFLoader: JSON content not found.");
          })(e);
        } catch (e) {
          return void (f && f(e));
        }
        E = T[t.KHR_BINARY_GLTF].content;
      } else E = THREE.LoaderUtils.decodeText(new Uint8Array(e));
      var g = JSON.parse(E);
      if (void 0 === g.asset || g.asset.version[0] < 2)
        f &&
          f(
            new Error(
              "THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."
            )
          );
      else {
        if (g.extensionsUsed)
          for (var v = 0; v < g.extensionsUsed.length; ++v) {
            var R = g.extensionsUsed[v],
              M = g.extensionsRequired || [];
            switch (R) {
              case t.KHR_LIGHTS_PUNCTUAL:
                T[R] = new a(g);
                break;
              case t.KHR_MATERIALS_CLEARCOAT:
                T[R] = new n();
                break;
              case t.KHR_MATERIALS_UNLIT:
                T[R] = new s();
                break;
              case t.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
                T[R] = new h();
                break;
              case t.KHR_DRACO_MESH_COMPRESSION:
                T[R] = new c(g, this.dracoLoader);
                break;
              case t.MSFT_TEXTURE_DDS:
                T[R] = new r(this.ddsLoader);
                break;
              case t.KHR_TEXTURE_TRANSFORM:
                T[R] = new u();
                break;
              case t.KHR_MESH_QUANTIZATION:
                T[R] = new d();
                break;
              default:
                M.indexOf(R) >= 0 &&
                  console.warn(
                    'THREE.GLTFLoader: Unknown extension "' + R + '".'
                  );
            }
          }
        new D(g, T, {
          path: p || this.resourcePath || "",
          crossOrigin: this.crossOrigin,
          manager: this.manager,
        }).parse(m, f);
      }
    },
  });
  var t = {
    KHR_BINARY_GLTF: "KHR_binary_glTF",
    KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
    KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
    KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
    KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
      "KHR_materials_pbrSpecularGlossiness",
    KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
    KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
    KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
    MSFT_TEXTURE_DDS: "MSFT_texture_dds",
  };
  function r(e) {
    if (!e)
      throw new Error(
        "THREE.GLTFLoader: Attempting to load .dds texture without importing THREE.DDSLoader"
      );
    (this.name = t.MSFT_TEXTURE_DDS), (this.ddsLoader = e);
  }
  function a(e) {
    this.name = t.KHR_LIGHTS_PUNCTUAL;
    var r = (e.extensions && e.extensions[t.KHR_LIGHTS_PUNCTUAL]) || {};
    this.lightDefs = r.lights || [];
  }
  function s() {
    this.name = t.KHR_MATERIALS_UNLIT;
  }
  function n() {
    this.name = t.KHR_MATERIALS_CLEARCOAT;
  }
  (a.prototype.loadLight = function (e) {
    var t,
      r = this.lightDefs[e],
      a = new THREE.Color(16777215);
    void 0 !== r.color && a.fromArray(r.color);
    var s = void 0 !== r.range ? r.range : 0;
    switch (r.type) {
      case "directional":
        (t = new THREE.DirectionalLight(a)).target.position.set(0, 0, -1),
          t.add(t.target);
        break;
      case "point":
        (t = new THREE.PointLight(a)).distance = s;
        break;
      case "spot":
        ((t = new THREE.SpotLight(a)).distance = s),
          (r.spot = r.spot || {}),
          (r.spot.innerConeAngle =
            void 0 !== r.spot.innerConeAngle ? r.spot.innerConeAngle : 0),
          (r.spot.outerConeAngle =
            void 0 !== r.spot.outerConeAngle
              ? r.spot.outerConeAngle
              : Math.PI / 4),
          (t.angle = r.spot.outerConeAngle),
          (t.penumbra = 1 - r.spot.innerConeAngle / r.spot.outerConeAngle),
          t.target.position.set(0, 0, -1),
          t.add(t.target);
        break;
      default:
        throw new Error(
          'THREE.GLTFLoader: Unexpected light type, "' + r.type + '".'
        );
    }
    return (
      t.position.set(0, 0, 0),
      (t.decay = 2),
      void 0 !== r.intensity && (t.intensity = r.intensity),
      (t.name = r.name || "light_" + e),
      Promise.resolve(t)
    );
  }),
    (s.prototype.getMaterialType = function () {
      return THREE.MeshBasicMaterial;
    }),
    (s.prototype.extendParams = function (e, t, r) {
      var a = [];
      (e.color = new THREE.Color(1, 1, 1)), (e.opacity = 1);
      var s = t.pbrMetallicRoughness;
      if (s) {
        if (Array.isArray(s.baseColorFactor)) {
          var n = s.baseColorFactor;
          e.color.fromArray(n), (e.opacity = n[3]);
        }
        void 0 !== s.baseColorTexture &&
          a.push(r.assignTexture(e, "map", s.baseColorTexture));
      }
      return Promise.all(a);
    }),
    (n.prototype.getMaterialType = function () {
      return THREE.MeshPhysicalMaterial;
    }),
    (n.prototype.extendParams = function (e, t, r) {
      var a = [],
        s = t.extensions[this.name];
      if (
        (void 0 !== s.clearcoatFactor && (e.clearcoat = s.clearcoatFactor),
        void 0 !== s.clearcoatTexture &&
          a.push(r.assignTexture(e, "clearcoatMap", s.clearcoatTexture)),
        void 0 !== s.clearcoatRoughnessFactor &&
          (e.clearcoatRoughness = s.clearcoatRoughnessFactor),
        void 0 !== s.clearcoatRoughnessTexture &&
          a.push(
            r.assignTexture(
              e,
              "clearcoatRoughnessMap",
              s.clearcoatRoughnessTexture
            )
          ),
        void 0 !== s.clearcoatNormalTexture &&
          (a.push(
            r.assignTexture(e, "clearcoatNormalMap", s.clearcoatNormalTexture)
          ),
          void 0 !== s.clearcoatNormalTexture.scale))
      ) {
        var n = s.clearcoatNormalTexture.scale;
        e.clearcoatNormalScale = new THREE.Vector2(n, n);
      }
      return Promise.all(a);
    });
  var o = "glTF",
    i = 12,
    l = { JSON: 1313821514, BIN: 5130562 };
  function c(e, r) {
    if (!r)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    (this.name = t.KHR_DRACO_MESH_COMPRESSION),
      (this.json = e),
      (this.dracoLoader = r),
      this.dracoLoader.preload();
  }
  function u() {
    this.name = t.KHR_TEXTURE_TRANSFORM;
  }
  function p(e) {
    THREE.MeshStandardMaterial.call(this),
      (this.isGLTFSpecularGlossinessMaterial = !0);
    var t = [
        "#ifdef USE_SPECULARMAP",
        "\tuniform sampler2D specularMap;",
        "#endif",
      ].join("\n"),
      r = [
        "#ifdef USE_GLOSSINESSMAP",
        "\tuniform sampler2D glossinessMap;",
        "#endif",
      ].join("\n"),
      a = [
        "vec3 specularFactor = specular;",
        "#ifdef USE_SPECULARMAP",
        "\tvec4 texelSpecular = texture2D( specularMap, vUv );",
        "\ttexelSpecular = sRGBToLinear( texelSpecular );",
        "\t// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture",
        "\tspecularFactor *= texelSpecular.rgb;",
        "#endif",
      ].join("\n"),
      s = [
        "float glossinessFactor = glossiness;",
        "#ifdef USE_GLOSSINESSMAP",
        "\tvec4 texelGlossiness = texture2D( glossinessMap, vUv );",
        "\t// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture",
        "\tglossinessFactor *= texelGlossiness.a;",
        "#endif",
      ].join("\n"),
      n = [
        "PhysicalMaterial material;",
        "material.diffuseColor = diffuseColor.rgb;",
        "vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );",
        "float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );",
        "material.specularRoughness = max( 1.0 - glossinessFactor, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.",
        "material.specularRoughness += geometryRoughness;",
        "material.specularRoughness = min( material.specularRoughness, 1.0 );",
        "material.specularColor = specularFactor.rgb;",
      ].join("\n"),
      o = {
        specular: { value: new THREE.Color().setHex(16777215) },
        glossiness: { value: 1 },
        specularMap: { value: null },
        glossinessMap: { value: null },
      };
    (this._extraUniforms = o),
      (this.onBeforeCompile = function (e) {
        for (var i in o) e.uniforms[i] = o[i];
        (e.fragmentShader = e.fragmentShader.replace(
          "uniform float roughness;",
          "uniform vec3 specular;"
        )),
          (e.fragmentShader = e.fragmentShader.replace(
            "uniform float metalness;",
            "uniform float glossiness;"
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            "#include <roughnessmap_pars_fragment>",
            t
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            "#include <metalnessmap_pars_fragment>",
            r
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            "#include <roughnessmap_fragment>",
            a
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            "#include <metalnessmap_fragment>",
            s
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            "#include <lights_physical_fragment>",
            n
          ));
      }),
      Object.defineProperties(this, {
        specular: {
          get: function () {
            return o.specular.value;
          },
          set: function (e) {
            o.specular.value = e;
          },
        },
        specularMap: {
          get: function () {
            return o.specularMap.value;
          },
          set: function (e) {
            o.specularMap.value = e;
          },
        },
        glossiness: {
          get: function () {
            return o.glossiness.value;
          },
          set: function (e) {
            o.glossiness.value = e;
          },
        },
        glossinessMap: {
          get: function () {
            return o.glossinessMap.value;
          },
          set: function (e) {
            (o.glossinessMap.value = e),
              e
                ? ((this.defines.USE_GLOSSINESSMAP = ""),
                  (this.defines.USE_ROUGHNESSMAP = ""))
                : (delete this.defines.USE_ROUGHNESSMAP,
                  delete this.defines.USE_GLOSSINESSMAP);
          },
        },
      }),
      delete this.metalness,
      delete this.roughness,
      delete this.metalnessMap,
      delete this.roughnessMap,
      this.setValues(e);
  }
  function h() {
    return {
      name: t.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,
      specularGlossinessParams: [
        "color",
        "map",
        "lightMap",
        "lightMapIntensity",
        "aoMap",
        "aoMapIntensity",
        "emissive",
        "emissiveIntensity",
        "emissiveMap",
        "bumpMap",
        "bumpScale",
        "normalMap",
        "normalMapType",
        "displacementMap",
        "displacementScale",
        "displacementBias",
        "specularMap",
        "specular",
        "glossinessMap",
        "glossiness",
        "alphaMap",
        "envMap",
        "envMapIntensity",
        "refractionRatio",
      ],
      getMaterialType: function () {
        return p;
      },
      extendParams: function (e, t, r) {
        var a = t.extensions[this.name];
        (e.color = new THREE.Color(1, 1, 1)), (e.opacity = 1);
        var s = [];
        if (Array.isArray(a.diffuseFactor)) {
          var n = a.diffuseFactor;
          e.color.fromArray(n), (e.opacity = n[3]);
        }
        if (
          (void 0 !== a.diffuseTexture &&
            s.push(r.assignTexture(e, "map", a.diffuseTexture)),
          (e.emissive = new THREE.Color(0, 0, 0)),
          (e.glossiness =
            void 0 !== a.glossinessFactor ? a.glossinessFactor : 1),
          (e.specular = new THREE.Color(1, 1, 1)),
          Array.isArray(a.specularFactor) &&
            e.specular.fromArray(a.specularFactor),
          void 0 !== a.specularGlossinessTexture)
        ) {
          var o = a.specularGlossinessTexture;
          s.push(r.assignTexture(e, "glossinessMap", o)),
            s.push(r.assignTexture(e, "specularMap", o));
        }
        return Promise.all(s);
      },
      createMaterial: function (e) {
        var t = new p(e);
        return (
          (t.fog = !0),
          (t.color = e.color),
          (t.map = void 0 === e.map ? null : e.map),
          (t.lightMap = null),
          (t.lightMapIntensity = 1),
          (t.aoMap = void 0 === e.aoMap ? null : e.aoMap),
          (t.aoMapIntensity = 1),
          (t.emissive = e.emissive),
          (t.emissiveIntensity = 1),
          (t.emissiveMap = void 0 === e.emissiveMap ? null : e.emissiveMap),
          (t.bumpMap = void 0 === e.bumpMap ? null : e.bumpMap),
          (t.bumpScale = 1),
          (t.normalMap = void 0 === e.normalMap ? null : e.normalMap),
          (t.normalMapType = THREE.TangentSpaceNormalMap),
          e.normalScale && (t.normalScale = e.normalScale),
          (t.displacementMap = null),
          (t.displacementScale = 1),
          (t.displacementBias = 0),
          (t.specularMap = void 0 === e.specularMap ? null : e.specularMap),
          (t.specular = e.specular),
          (t.glossinessMap =
            void 0 === e.glossinessMap ? null : e.glossinessMap),
          (t.glossiness = e.glossiness),
          (t.alphaMap = null),
          (t.envMap = void 0 === e.envMap ? null : e.envMap),
          (t.envMapIntensity = 1),
          (t.refractionRatio = 0.98),
          t
        );
      },
    };
  }
  function d() {
    this.name = t.KHR_MESH_QUANTIZATION;
  }
  function m(e, t, r, a) {
    THREE.Interpolant.call(this, e, t, r, a);
  }
  (c.prototype.decodePrimitive = function (e, t) {
    var r = this.json,
      a = this.dracoLoader,
      s = e.extensions[this.name].bufferView,
      n = e.extensions[this.name].attributes,
      o = {},
      i = {},
      l = {};
    for (var c in n) {
      var u = x[c] || c.toLowerCase();
      o[u] = n[c];
    }
    for (c in e.attributes) {
      u = x[c] || c.toLowerCase();
      if (void 0 !== n[c]) {
        var p = r.accessors[e.attributes[c]],
          h = y[p.componentType];
        (l[u] = h), (i[u] = !0 === p.normalized);
      }
    }
    return t.getDependency("bufferView", s).then(function (e) {
      return new Promise(function (t) {
        a.decodeDracoFile(
          e,
          function (e) {
            for (var r in e.attributes) {
              var a = e.attributes[r],
                s = i[r];
              void 0 !== s && (a.normalized = s);
            }
            t(e);
          },
          o,
          l
        );
      });
    });
  }),
    (u.prototype.extendTexture = function (e, t) {
      return (
        (e = e.clone()),
        void 0 !== t.offset && e.offset.fromArray(t.offset),
        void 0 !== t.rotation && (e.rotation = t.rotation),
        void 0 !== t.scale && e.repeat.fromArray(t.scale),
        void 0 !== t.texCoord &&
          console.warn(
            'THREE.GLTFLoader: Custom UV sets in "' +
              this.name +
              '" extension not yet supported.'
          ),
        (e.needsUpdate = !0),
        e
      );
    }),
    (p.prototype = Object.create(THREE.MeshStandardMaterial.prototype)),
    (p.prototype.constructor = p),
    (p.prototype.copy = function (e) {
      return (
        THREE.MeshStandardMaterial.prototype.copy.call(this, e),
        (this.specularMap = e.specularMap),
        this.specular.copy(e.specular),
        (this.glossinessMap = e.glossinessMap),
        (this.glossiness = e.glossiness),
        delete this.metalness,
        delete this.roughness,
        delete this.metalnessMap,
        delete this.roughnessMap,
        this
      );
    }),
    (m.prototype = Object.create(THREE.Interpolant.prototype)),
    (m.prototype.constructor = m),
    (m.prototype.copySampleValue_ = function (e) {
      for (
        var t = this.resultBuffer,
          r = this.sampleValues,
          a = this.valueSize,
          s = e * a * 3 + a,
          n = 0;
        n !== a;
        n++
      )
        t[n] = r[s + n];
      return t;
    }),
    (m.prototype.beforeStart_ = m.prototype.copySampleValue_),
    (m.prototype.afterEnd_ = m.prototype.copySampleValue_),
    (m.prototype.interpolate_ = function (e, t, r, a) {
      for (
        var s = this.resultBuffer,
          n = this.sampleValues,
          o = this.valueSize,
          i = 2 * o,
          l = 3 * o,
          c = a - t,
          u = (r - t) / c,
          p = u * u,
          h = p * u,
          d = e * l,
          m = d - l,
          f = -2 * h + 3 * p,
          E = h - p,
          T = 1 - f,
          g = E - p + u,
          v = 0;
        v !== o;
        v++
      ) {
        var R = n[m + v + o],
          M = n[m + v + i] * c,
          y = n[d + v + o],
          S = n[d + v] * c;
        s[v] = T * R + g * M + f * y + E * S;
      }
      return s;
    });
  var f = 0,
    E = 1,
    T = 2,
    g = 3,
    v = 4,
    R = 5,
    M = 6,
    y = {
      5120: Int8Array,
      5121: Uint8Array,
      5122: Int16Array,
      5123: Uint16Array,
      5125: Uint32Array,
      5126: Float32Array,
    },
    S = {
      9728: THREE.NearestFilter,
      9729: THREE.LinearFilter,
      9984: THREE.NearestMipmapNearestFilter,
      9985: THREE.LinearMipmapNearestFilter,
      9986: THREE.NearestMipmapLinearFilter,
      9987: THREE.LinearMipmapLinearFilter,
    },
    H = {
      33071: THREE.ClampToEdgeWrapping,
      33648: THREE.MirroredRepeatWrapping,
      10497: THREE.RepeatWrapping,
    },
    L = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 },
    x = {
      POSITION: "position",
      NORMAL: "normal",
      TANGENT: "tangent",
      TEXCOORD_0: "uv",
      TEXCOORD_1: "uv2",
      COLOR_0: "color",
      WEIGHTS_0: "skinWeight",
      JOINTS_0: "skinIndex",
    },
    A = {
      scale: "scale",
      translation: "position",
      rotation: "quaternion",
      weights: "morphTargetInfluences",
    },
    _ = {
      CUBICSPLINE: void 0,
      LINEAR: THREE.InterpolateLinear,
      STEP: THREE.InterpolateDiscrete,
    },
    w = "OPAQUE",
    b = "MASK",
    I = "BLEND",
    P = { "image/png": THREE.RGBAFormat, "image/jpeg": THREE.RGBFormat };
  function C(e, t) {
    return "string" != typeof e || "" === e
      ? ""
      : (/^https?:\/\//i.test(t) &&
          /^\//.test(e) &&
          (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")),
        /^(https?:)?\/\//i.test(e)
          ? e
          : /^data:.*,.*$/i.test(e)
          ? e
          : /^blob:.*$/i.test(e)
          ? e
          : t + e);
  }
  function F(e, t, r) {
    for (var a in r.extensions)
      void 0 === e[a] &&
        ((t.userData.gltfExtensions = t.userData.gltfExtensions || {}),
        (t.userData.gltfExtensions[a] = r.extensions[a]));
  }
  function O(e, t) {
    void 0 !== t.extras &&
      ("object" == typeof t.extras
        ? Object.assign(e.userData, t.extras)
        : console.warn(
            "THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras
          ));
  }
  function N(e, t) {
    if ((e.updateMorphTargets(), void 0 !== t.weights))
      for (var r = 0, a = t.weights.length; r < a; r++)
        e.morphTargetInfluences[r] = t.weights[r];
    if (t.extras && Array.isArray(t.extras.targetNames)) {
      var s = t.extras.targetNames;
      if (e.morphTargetInfluences.length === s.length) {
        e.morphTargetDictionary = {};
        for (r = 0, a = s.length; r < a; r++) e.morphTargetDictionary[s[r]] = r;
      } else
        console.warn(
          "THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names."
        );
    }
  }
  function U(e) {
    for (var t = "", r = Object.keys(e).sort(), a = 0, s = r.length; a < s; a++)
      t += r[a] + ":" + e[r[a]] + ";";
    return t;
  }
  function D(e, t, r) {
    (this.json = e || {}),
      (this.extensions = t || {}),
      (this.options = r || {}),
      (this.cache = new (function () {
        var e = {};
        return {
          get: function (t) {
            return e[t];
          },
          add: function (t, r) {
            e[t] = r;
          },
          remove: function (t) {
            delete e[t];
          },
          removeAll: function () {
            e = {};
          },
        };
      })()),
      (this.primitiveCache = {}),
      (this.textureLoader = new THREE.TextureLoader(this.options.manager)),
      this.textureLoader.setCrossOrigin(this.options.crossOrigin),
      (this.fileLoader = new THREE.FileLoader(this.options.manager)),
      this.fileLoader.setResponseType("arraybuffer"),
      "use-credentials" === this.options.crossOrigin &&
        this.fileLoader.setWithCredentials(!0);
  }
  function G(e, t, r) {
    var a = t.attributes,
      s = [];
    function n(t, a) {
      return r.getDependency("accessor", t).then(function (t) {
        e.setAttribute(a, t);
      });
    }
    for (var o in a) {
      var i = x[o] || o.toLowerCase();
      i in e.attributes || s.push(n(a[o], i));
    }
    if (void 0 !== t.indices && !e.index) {
      var l = r.getDependency("accessor", t.indices).then(function (t) {
        e.setIndex(t);
      });
      s.push(l);
    }
    return (
      O(e, t),
      (function (e, t, r) {
        var a = t.attributes,
          s = new THREE.Box3();
        if (void 0 !== a.POSITION) {
          var n = (h = r.json.accessors[a.POSITION]).min,
            o = h.max;
          if (void 0 !== n && void 0 !== o) {
            s.set(
              new THREE.Vector3(n[0], n[1], n[2]),
              new THREE.Vector3(o[0], o[1], o[2])
            );
            var i = t.targets;
            if (void 0 !== i) {
              for (
                var l = new THREE.Vector3(),
                  c = new THREE.Vector3(),
                  u = 0,
                  p = i.length;
                u < p;
                u++
              ) {
                var h,
                  d = i[u];
                if (void 0 !== d.POSITION)
                  (n = (h = r.json.accessors[d.POSITION]).min),
                    (o = h.max),
                    void 0 !== n && void 0 !== o
                      ? (c.setX(Math.max(Math.abs(n[0]), Math.abs(o[0]))),
                        c.setY(Math.max(Math.abs(n[1]), Math.abs(o[1]))),
                        c.setZ(Math.max(Math.abs(n[2]), Math.abs(o[2]))),
                        l.max(c))
                      : console.warn(
                          "THREE.GLTFLoader: Missing min/max properties for accessor POSITION."
                        );
              }
              s.expandByVector(l);
            }
            e.boundingBox = s;
            var m = new THREE.Sphere();
            s.getCenter(m.center),
              (m.radius = s.min.distanceTo(s.max) / 2),
              (e.boundingSphere = m);
          } else
            console.warn(
              "THREE.GLTFLoader: Missing min/max properties for accessor POSITION."
            );
        }
      })(e, t, r),
      Promise.all(s).then(function () {
        return void 0 !== t.targets
          ? (function (e, t, r) {
              for (
                var a = !1, s = !1, n = 0, o = t.length;
                n < o &&
                (void 0 !== (c = t[n]).POSITION && (a = !0),
                void 0 !== c.NORMAL && (s = !0),
                !a || !s);
                n++
              );
              if (!a && !s) return Promise.resolve(e);
              var i = [],
                l = [];
              for (n = 0, o = t.length; n < o; n++) {
                var c = t[n];
                if (a) {
                  var u =
                    void 0 !== c.POSITION
                      ? r.getDependency("accessor", c.POSITION)
                      : e.attributes.position;
                  i.push(u);
                }
                s &&
                  ((u =
                    void 0 !== c.NORMAL
                      ? r.getDependency("accessor", c.NORMAL)
                      : e.attributes.normal),
                  l.push(u));
              }
              return Promise.all([Promise.all(i), Promise.all(l)]).then(
                function (t) {
                  var r = t[0],
                    n = t[1];
                  return (
                    a && (e.morphAttributes.position = r),
                    s && (e.morphAttributes.normal = n),
                    (e.morphTargetsRelative = !0),
                    e
                  );
                }
              );
            })(e, t.targets, r)
          : e;
      })
    );
  }
  function B(e, t) {
    var r = e.getIndex();
    if (null === r) {
      var a = [],
        s = e.getAttribute("position");
      if (void 0 === s)
        return (
          console.error(
            "THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."
          ),
          e
        );
      for (var n = 0; n < s.count; n++) a.push(n);
      e.setIndex(a), (r = e.getIndex());
    }
    var o = r.count - 2,
      i = [];
    if (t === THREE.TriangleFanDrawMode)
      for (n = 1; n <= o; n++)
        i.push(r.getX(0)), i.push(r.getX(n)), i.push(r.getX(n + 1));
    else
      for (n = 0; n < o; n++)
        n % 2 == 0
          ? (i.push(r.getX(n)), i.push(r.getX(n + 1)), i.push(r.getX(n + 2)))
          : (i.push(r.getX(n + 2)), i.push(r.getX(n + 1)), i.push(r.getX(n)));
    i.length / 3 !== o &&
      console.error(
        "THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles."
      );
    var l = e.clone();
    return l.setIndex(i), l;
  }
  return (
    (D.prototype.parse = function (e, t) {
      var r = this,
        a = this.json,
        s = this.extensions;
      this.cache.removeAll(),
        this.markDefs(),
        Promise.all([
          this.getDependencies("scene"),
          this.getDependencies("animation"),
          this.getDependencies("camera"),
        ])
          .then(function (t) {
            var n = {
              scene: t[0][a.scene || 0],
              scenes: t[0],
              animations: t[1],
              cameras: t[2],
              asset: a.asset,
              parser: r,
              userData: {},
            };
            F(s, n, a), O(n, a), e(n);
          })
          .catch(t);
    }),
    (D.prototype.markDefs = function () {
      for (
        var e = this.json.nodes || [],
          t = this.json.skins || [],
          r = this.json.meshes || [],
          a = {},
          s = {},
          n = 0,
          o = t.length;
        n < o;
        n++
      )
        for (var i = t[n].joints, l = 0, c = i.length; l < c; l++)
          e[i[l]].isBone = !0;
      for (var u = 0, p = e.length; u < p; u++) {
        var h = e[u];
        void 0 !== h.mesh &&
          (void 0 === a[h.mesh] && (a[h.mesh] = s[h.mesh] = 0),
          a[h.mesh]++,
          void 0 !== h.skin && (r[h.mesh].isSkinnedMesh = !0));
      }
      (this.json.meshReferences = a), (this.json.meshUses = s);
    }),
    (D.prototype.getDependency = function (e, r) {
      var a = e + ":" + r,
        s = this.cache.get(a);
      if (!s) {
        switch (e) {
          case "scene":
            s = this.loadScene(r);
            break;
          case "node":
            s = this.loadNode(r);
            break;
          case "mesh":
            s = this.loadMesh(r);
            break;
          case "accessor":
            s = this.loadAccessor(r);
            break;
          case "bufferView":
            s = this.loadBufferView(r);
            break;
          case "buffer":
            s = this.loadBuffer(r);
            break;
          case "material":
            s = this.loadMaterial(r);
            break;
          case "texture":
            s = this.loadTexture(r);
            break;
          case "skin":
            s = this.loadSkin(r);
            break;
          case "animation":
            s = this.loadAnimation(r);
            break;
          case "camera":
            s = this.loadCamera(r);
            break;
          case "light":
            s = this.extensions[t.KHR_LIGHTS_PUNCTUAL].loadLight(r);
            break;
          default:
            throw new Error("Unknown type: " + e);
        }
        this.cache.add(a, s);
      }
      return s;
    }),
    (D.prototype.getDependencies = function (e) {
      var t = this.cache.get(e);
      if (!t) {
        var r = this,
          a = this.json[e + ("mesh" === e ? "es" : "s")] || [];
        (t = Promise.all(
          a.map(function (t, a) {
            return r.getDependency(e, a);
          })
        )),
          this.cache.add(e, t);
      }
      return t;
    }),
    (D.prototype.loadBuffer = function (e) {
      var r = this.json.buffers[e],
        a = this.fileLoader;
      if (r.type && "arraybuffer" !== r.type)
        throw new Error(
          "THREE.GLTFLoader: " + r.type + " buffer type is not supported."
        );
      if (void 0 === r.uri && 0 === e)
        return Promise.resolve(this.extensions[t.KHR_BINARY_GLTF].body);
      var s = this.options;
      return new Promise(function (e, t) {
        a.load(C(r.uri, s.path), e, void 0, function () {
          t(
            new Error(
              'THREE.GLTFLoader: Failed to load buffer "' + r.uri + '".'
            )
          );
        });
      });
    }),
    (D.prototype.loadBufferView = function (e) {
      var t = this.json.bufferViews[e];
      return this.getDependency("buffer", t.buffer).then(function (e) {
        var r = t.byteLength || 0,
          a = t.byteOffset || 0;
        return e.slice(a, a + r);
      });
    }),
    (D.prototype.loadAccessor = function (e) {
      var t = this,
        r = this.json,
        a = this.json.accessors[e];
      if (void 0 === a.bufferView && void 0 === a.sparse)
        return Promise.resolve(null);
      var s = [];
      return (
        void 0 !== a.bufferView
          ? s.push(this.getDependency("bufferView", a.bufferView))
          : s.push(null),
        void 0 !== a.sparse &&
          (s.push(
            this.getDependency("bufferView", a.sparse.indices.bufferView)
          ),
          s.push(this.getDependency("bufferView", a.sparse.values.bufferView))),
        Promise.all(s).then(function (e) {
          var s,
            n,
            o = e[0],
            i = L[a.type],
            l = y[a.componentType],
            c = l.BYTES_PER_ELEMENT,
            u = c * i,
            p = a.byteOffset || 0,
            h =
              void 0 !== a.bufferView
                ? r.bufferViews[a.bufferView].byteStride
                : void 0,
            d = !0 === a.normalized;
          if (h && h !== u) {
            var m = Math.floor(p / h),
              f =
                "InterleavedBuffer:" +
                a.bufferView +
                ":" +
                a.componentType +
                ":" +
                m +
                ":" +
                a.count,
              E = t.cache.get(f);
            E ||
              ((s = new l(o, m * h, (a.count * h) / c)),
              (E = new THREE.InterleavedBuffer(s, h / c)),
              t.cache.add(f, E)),
              (n = new THREE.InterleavedBufferAttribute(E, i, (p % h) / c, d));
          } else (s = null === o ? new l(a.count * i) : new l(o, p, a.count * i)), (n = new THREE.BufferAttribute(s, i, d));
          if (void 0 !== a.sparse) {
            var T = L.SCALAR,
              g = y[a.sparse.indices.componentType],
              v = a.sparse.indices.byteOffset || 0,
              R = a.sparse.values.byteOffset || 0,
              M = new g(e[1], v, a.sparse.count * T),
              S = new l(e[2], R, a.sparse.count * i);
            null !== o &&
              (n = new THREE.BufferAttribute(
                n.array.slice(),
                n.itemSize,
                n.normalized
              ));
            for (var H = 0, x = M.length; H < x; H++) {
              var A = M[H];
              if (
                (n.setX(A, S[H * i]),
                i >= 2 && n.setY(A, S[H * i + 1]),
                i >= 3 && n.setZ(A, S[H * i + 2]),
                i >= 4 && n.setW(A, S[H * i + 3]),
                i >= 5)
              )
                throw new Error(
                  "THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute."
                );
            }
          }
          return n;
        })
      );
    }),
    (D.prototype.loadTexture = function (e) {
      var r,
        a = this,
        s = this.json,
        n = this.options,
        o = this.textureLoader,
        i = self.URL || self.webkitURL,
        l = s.textures[e],
        c = l.extensions || {},
        u = (r = c[t.MSFT_TEXTURE_DDS]
          ? s.images[c[t.MSFT_TEXTURE_DDS].source]
          : s.images[l.source]).uri,
        p = !1;
      return (
        void 0 !== r.bufferView &&
          (u = a.getDependency("bufferView", r.bufferView).then(function (e) {
            p = !0;
            var t = new Blob([e], { type: r.mimeType });
            return (u = i.createObjectURL(t));
          })),
        Promise.resolve(u)
          .then(function (e) {
            var r = n.manager.getHandler(e);
            return (
              r ||
                (r = c[t.MSFT_TEXTURE_DDS]
                  ? a.extensions[t.MSFT_TEXTURE_DDS].ddsLoader
                  : o),
              new Promise(function (t, a) {
                r.load(C(e, n.path), t, void 0, a);
              })
            );
          })
          .then(function (e) {
            !0 === p && i.revokeObjectURL(u),
              (e.flipY = !1),
              l.name && (e.name = l.name),
              r.mimeType in P && (e.format = P[r.mimeType]);
            var t = (s.samplers || {})[l.sampler] || {};
            return (
              (e.magFilter = S[t.magFilter] || THREE.LinearFilter),
              (e.minFilter = S[t.minFilter] || THREE.LinearMipmapLinearFilter),
              (e.wrapS = H[t.wrapS] || THREE.RepeatWrapping),
              (e.wrapT = H[t.wrapT] || THREE.RepeatWrapping),
              e
            );
          })
      );
    }),
    (D.prototype.assignTexture = function (e, r, a) {
      var s = this;
      return this.getDependency("texture", a.index).then(function (n) {
        if (!n.isCompressedTexture)
          switch (r) {
            case "aoMap":
            case "emissiveMap":
            case "metalnessMap":
            case "normalMap":
            case "roughnessMap":
              n.format = THREE.RGBFormat;
          }
        if (
          (void 0 === a.texCoord ||
            0 == a.texCoord ||
            ("aoMap" === r && 1 == a.texCoord) ||
            console.warn(
              "THREE.GLTFLoader: Custom UV set " +
                a.texCoord +
                " for texture " +
                r +
                " not yet supported."
            ),
          s.extensions[t.KHR_TEXTURE_TRANSFORM])
        ) {
          var o =
            void 0 !== a.extensions
              ? a.extensions[t.KHR_TEXTURE_TRANSFORM]
              : void 0;
          o && (n = s.extensions[t.KHR_TEXTURE_TRANSFORM].extendTexture(n, o));
        }
        e[r] = n;
      });
    }),
    (D.prototype.assignFinalMaterial = function (e) {
      var t = e.geometry,
        r = e.material,
        a = void 0 !== t.attributes.tangent,
        s = void 0 !== t.attributes.color,
        n = void 0 === t.attributes.normal,
        o = !0 === e.isSkinnedMesh,
        i = Object.keys(t.morphAttributes).length > 0,
        l = i && void 0 !== t.morphAttributes.normal;
      if (e.isPoints) {
        var c = "PointsMaterial:" + r.uuid,
          u = this.cache.get(c);
        u ||
          ((u = new THREE.PointsMaterial()),
          THREE.Material.prototype.copy.call(u, r),
          u.color.copy(r.color),
          (u.map = r.map),
          (u.sizeAttenuation = !1),
          this.cache.add(c, u)),
          (r = u);
      } else if (e.isLine) {
        c = "LineBasicMaterial:" + r.uuid;
        var p = this.cache.get(c);
        p ||
          ((p = new THREE.LineBasicMaterial()),
          THREE.Material.prototype.copy.call(p, r),
          p.color.copy(r.color),
          this.cache.add(c, p)),
          (r = p);
      }
      if (a || s || n || o || i) {
        c = "ClonedMaterial:" + r.uuid + ":";
        r.isGLTFSpecularGlossinessMaterial && (c += "specular-glossiness:"),
          o && (c += "skinning:"),
          a && (c += "vertex-tangents:"),
          s && (c += "vertex-colors:"),
          n && (c += "flat-shading:"),
          i && (c += "morph-targets:"),
          l && (c += "morph-normals:");
        var h = this.cache.get(c);
        h ||
          ((h = r.clone()),
          o && (h.skinning = !0),
          a && (h.vertexTangents = !0),
          s && (h.vertexColors = !0),
          n && (h.flatShading = !0),
          i && (h.morphTargets = !0),
          l && (h.morphNormals = !0),
          this.cache.add(c, h)),
          (r = h);
      }
      r.aoMap &&
        void 0 === t.attributes.uv2 &&
        void 0 !== t.attributes.uv &&
        t.setAttribute(
          "uv2",
          new THREE.BufferAttribute(t.attributes.uv.array, 2)
        ),
        r.normalScale && !a && (r.normalScale.y = -r.normalScale.y),
        r.clearcoatNormalScale &&
          !a &&
          (r.clearcoatNormalScale.y = -r.clearcoatNormalScale.y),
        (e.material = r);
    }),
    (D.prototype.loadMaterial = function (e) {
      var r,
        a = this.json,
        s = this.extensions,
        n = a.materials[e],
        o = {},
        i = n.extensions || {},
        l = [];
      if (i[t.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
        var c = s[t.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
        (r = c.getMaterialType()), l.push(c.extendParams(o, n, this));
      } else if (i[t.KHR_MATERIALS_UNLIT]) {
        var u = s[t.KHR_MATERIALS_UNLIT];
        (r = u.getMaterialType()), l.push(u.extendParams(o, n, this));
      } else {
        r = THREE.MeshStandardMaterial;
        var h = n.pbrMetallicRoughness || {};
        if (
          ((o.color = new THREE.Color(1, 1, 1)),
          (o.opacity = 1),
          Array.isArray(h.baseColorFactor))
        ) {
          var d = h.baseColorFactor;
          o.color.fromArray(d), (o.opacity = d[3]);
        }
        void 0 !== h.baseColorTexture &&
          l.push(this.assignTexture(o, "map", h.baseColorTexture)),
          (o.metalness = void 0 !== h.metallicFactor ? h.metallicFactor : 1),
          (o.roughness = void 0 !== h.roughnessFactor ? h.roughnessFactor : 1),
          void 0 !== h.metallicRoughnessTexture &&
            (l.push(
              this.assignTexture(o, "metalnessMap", h.metallicRoughnessTexture)
            ),
            l.push(
              this.assignTexture(o, "roughnessMap", h.metallicRoughnessTexture)
            ));
      }
      !0 === n.doubleSided && (o.side = THREE.DoubleSide);
      var m = n.alphaMode || w;
      if (
        (m === I
          ? ((o.transparent = !0), (o.depthWrite = !1))
          : ((o.transparent = !1),
            m === b &&
              (o.alphaTest = void 0 !== n.alphaCutoff ? n.alphaCutoff : 0.5)),
        void 0 !== n.normalTexture &&
          r !== THREE.MeshBasicMaterial &&
          (l.push(this.assignTexture(o, "normalMap", n.normalTexture)),
          (o.normalScale = new THREE.Vector2(1, 1)),
          void 0 !== n.normalTexture.scale &&
            o.normalScale.set(n.normalTexture.scale, n.normalTexture.scale)),
        void 0 !== n.occlusionTexture &&
          r !== THREE.MeshBasicMaterial &&
          (l.push(this.assignTexture(o, "aoMap", n.occlusionTexture)),
          void 0 !== n.occlusionTexture.strength &&
            (o.aoMapIntensity = n.occlusionTexture.strength)),
        void 0 !== n.emissiveFactor &&
          r !== THREE.MeshBasicMaterial &&
          (o.emissive = new THREE.Color().fromArray(n.emissiveFactor)),
        void 0 !== n.emissiveTexture &&
          r !== THREE.MeshBasicMaterial &&
          l.push(this.assignTexture(o, "emissiveMap", n.emissiveTexture)),
        i[t.KHR_MATERIALS_CLEARCOAT])
      ) {
        var f = s[t.KHR_MATERIALS_CLEARCOAT];
        (r = f.getMaterialType()),
          l.push(f.extendParams(o, { extensions: i }, this));
      }
      return Promise.all(l).then(function () {
        var e;
        return (
          (e =
            r === p
              ? s[t.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(o)
              : new r(o)),
          n.name && (e.name = n.name),
          e.map && (e.map.encoding = THREE.sRGBEncoding),
          e.emissiveMap && (e.emissiveMap.encoding = THREE.sRGBEncoding),
          O(e, n),
          n.extensions && F(s, e, n),
          e
        );
      });
    }),
    (D.prototype.loadGeometries = function (e) {
      var r = this,
        a = this.extensions,
        s = this.primitiveCache;
      function n(e) {
        return a[t.KHR_DRACO_MESH_COMPRESSION]
          .decodePrimitive(e, r)
          .then(function (t) {
            return G(t, e, r);
          });
      }
      for (var o, i, l = [], c = 0, u = e.length; c < u; c++) {
        var p,
          h = e[c],
          d =
            (void 0,
            (i =
              (o = h).extensions && o.extensions[t.KHR_DRACO_MESH_COMPRESSION])
              ? "draco:" +
                i.bufferView +
                ":" +
                i.indices +
                ":" +
                U(i.attributes)
              : o.indices + ":" + U(o.attributes) + ":" + o.mode),
          m = s[d];
        if (m) l.push(m.promise);
        else
          (p =
            h.extensions && h.extensions[t.KHR_DRACO_MESH_COMPRESSION]
              ? n(h)
              : G(new THREE.BufferGeometry(), h, r)),
            (s[d] = { primitive: h, promise: p }),
            l.push(p);
      }
      return Promise.all(l);
    }),
    (D.prototype.loadMesh = function (e) {
      for (
        var t,
          r = this,
          a = this.json.meshes[e],
          s = a.primitives,
          n = [],
          o = 0,
          i = s.length;
        o < i;
        o++
      ) {
        var l =
          void 0 === s[o].material
            ? (void 0 === (t = this.cache).DefaultMaterial &&
                (t.DefaultMaterial = new THREE.MeshStandardMaterial({
                  color: 16777215,
                  emissive: 0,
                  metalness: 1,
                  roughness: 1,
                  transparent: !1,
                  depthTest: !0,
                  side: THREE.FrontSide,
                })),
              t.DefaultMaterial)
            : this.getDependency("material", s[o].material);
        n.push(l);
      }
      return (
        n.push(r.loadGeometries(s)),
        Promise.all(n).then(function (t) {
          for (
            var n = t.slice(0, t.length - 1),
              o = t[t.length - 1],
              i = [],
              l = 0,
              c = o.length;
            l < c;
            l++
          ) {
            var u,
              p = o[l],
              h = s[l],
              d = n[l];
            if (
              h.mode === v ||
              h.mode === R ||
              h.mode === M ||
              void 0 === h.mode
            )
              !0 !==
                (u =
                  !0 === a.isSkinnedMesh
                    ? new THREE.SkinnedMesh(p, d)
                    : new THREE.Mesh(p, d)).isSkinnedMesh ||
                u.geometry.attributes.skinWeight.normalized ||
                u.normalizeSkinWeights(),
                h.mode === R
                  ? (u.geometry = B(u.geometry, THREE.TriangleStripDrawMode))
                  : h.mode === M &&
                    (u.geometry = B(u.geometry, THREE.TriangleFanDrawMode));
            else if (h.mode === E) u = new THREE.LineSegments(p, d);
            else if (h.mode === g) u = new THREE.Line(p, d);
            else if (h.mode === T) u = new THREE.LineLoop(p, d);
            else {
              if (h.mode !== f)
                throw new Error(
                  "THREE.GLTFLoader: Primitive mode unsupported: " + h.mode
                );
              u = new THREE.Points(p, d);
            }
            Object.keys(u.geometry.morphAttributes).length > 0 && N(u, a),
              (u.name = a.name || "mesh_" + e),
              o.length > 1 && (u.name += "_" + l),
              O(u, a),
              r.assignFinalMaterial(u),
              i.push(u);
          }
          if (1 === i.length) return i[0];
          var m = new THREE.Group();
          for (l = 0, c = i.length; l < c; l++) m.add(i[l]);
          return m;
        })
      );
    }),
    (D.prototype.loadCamera = function (e) {
      var t,
        r = this.json.cameras[e],
        a = r[r.type];
      if (a)
        return (
          "perspective" === r.type
            ? (t = new THREE.PerspectiveCamera(
                THREE.MathUtils.radToDeg(a.yfov),
                a.aspectRatio || 1,
                a.znear || 1,
                a.zfar || 2e6
              ))
            : "orthographic" === r.type &&
              (t = new THREE.OrthographicCamera(
                a.xmag / -2,
                a.xmag / 2,
                a.ymag / 2,
                a.ymag / -2,
                a.znear,
                a.zfar
              )),
          r.name && (t.name = r.name),
          O(t, r),
          Promise.resolve(t)
        );
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
    }),
    (D.prototype.loadSkin = function (e) {
      var t = this.json.skins[e],
        r = { joints: t.joints };
      return void 0 === t.inverseBindMatrices
        ? Promise.resolve(r)
        : this.getDependency("accessor", t.inverseBindMatrices).then(function (
            e
          ) {
            return (r.inverseBindMatrices = e), r;
          });
    }),
    (D.prototype.loadAnimation = function (e) {
      for (
        var t = this.json.animations[e],
          r = [],
          a = [],
          s = [],
          n = [],
          o = [],
          i = 0,
          l = t.channels.length;
        i < l;
        i++
      ) {
        var c = t.channels[i],
          u = t.samplers[c.sampler],
          p = c.target,
          h = void 0 !== p.node ? p.node : p.id,
          d = void 0 !== t.parameters ? t.parameters[u.input] : u.input,
          f = void 0 !== t.parameters ? t.parameters[u.output] : u.output;
        r.push(this.getDependency("node", h)),
          a.push(this.getDependency("accessor", d)),
          s.push(this.getDependency("accessor", f)),
          n.push(u),
          o.push(p);
      }
      return Promise.all([
        Promise.all(r),
        Promise.all(a),
        Promise.all(s),
        Promise.all(n),
        Promise.all(o),
      ]).then(function (r) {
        for (
          var a = r[0],
            s = r[1],
            n = r[2],
            o = r[3],
            i = r[4],
            l = [],
            c = 0,
            u = a.length;
          c < u;
          c++
        ) {
          var p = a[c],
            h = s[c],
            d = n[c],
            f = o[c],
            E = i[c];
          if (void 0 !== p) {
            var T;
            switch ((p.updateMatrix(), (p.matrixAutoUpdate = !0), A[E.path])) {
              case A.weights:
                T = THREE.NumberKeyframeTrack;
                break;
              case A.rotation:
                T = THREE.QuaternionKeyframeTrack;
                break;
              case A.position:
              case A.scale:
              default:
                T = THREE.VectorKeyframeTrack;
            }
            var g = p.name ? p.name : p.uuid,
              v =
                void 0 !== f.interpolation
                  ? _[f.interpolation]
                  : THREE.InterpolateLinear,
              R = [];
            A[E.path] === A.weights
              ? p.traverse(function (e) {
                  !0 === e.isMesh &&
                    e.morphTargetInfluences &&
                    R.push(e.name ? e.name : e.uuid);
                })
              : R.push(g);
            var M = d.array;
            if (d.normalized) {
              var y;
              if (M.constructor === Int8Array) y = 1 / 127;
              else if (M.constructor === Uint8Array) y = 1 / 255;
              else if (M.constructor == Int16Array) y = 1 / 32767;
              else {
                if (M.constructor !== Uint16Array)
                  throw new Error(
                    "THREE.GLTFLoader: Unsupported output accessor component type."
                  );
                y = 1 / 65535;
              }
              for (
                var S = new Float32Array(M.length), H = 0, L = M.length;
                H < L;
                H++
              )
                S[H] = M[H] * y;
              M = S;
            }
            for (H = 0, L = R.length; H < L; H++) {
              var x = new T(R[H] + "." + A[E.path], h.array, M, v);
              "CUBICSPLINE" === f.interpolation &&
                ((x.createInterpolant = function (e) {
                  return new m(
                    this.times,
                    this.values,
                    this.getValueSize() / 3,
                    e
                  );
                }),
                (x.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0)),
                l.push(x);
            }
          }
        }
        var w = t.name ? t.name : "animation_" + e;
        return new THREE.AnimationClip(w, void 0, l);
      });
    }),
    (D.prototype.loadNode = function (e) {
      var r,
        a = this.json,
        s = this.extensions,
        n = this,
        o = a.meshReferences,
        i = a.meshUses,
        l = a.nodes[e];
      return ((r = []),
      void 0 !== l.mesh &&
        r.push(
          n.getDependency("mesh", l.mesh).then(function (e) {
            var t;
            if (o[l.mesh] > 1) {
              var r = i[l.mesh]++;
              (t = e.clone()).name += "_instance_" + r;
            } else t = e;
            return (
              void 0 !== l.weights &&
                t.traverse(function (e) {
                  if (e.isMesh)
                    for (var t = 0, r = l.weights.length; t < r; t++)
                      e.morphTargetInfluences[t] = l.weights[t];
                }),
              t
            );
          })
        ),
      void 0 !== l.camera && r.push(n.getDependency("camera", l.camera)),
      l.extensions &&
        l.extensions[t.KHR_LIGHTS_PUNCTUAL] &&
        void 0 !== l.extensions[t.KHR_LIGHTS_PUNCTUAL].light &&
        r.push(
          n.getDependency("light", l.extensions[t.KHR_LIGHTS_PUNCTUAL].light)
        ),
      Promise.all(r)).then(function (e) {
        var t;
        if (
          (t =
            !0 === l.isBone
              ? new THREE.Bone()
              : e.length > 1
              ? new THREE.Group()
              : 1 === e.length
              ? e[0]
              : new THREE.Object3D()) !== e[0]
        )
          for (var r = 0, a = e.length; r < a; r++) t.add(e[r]);
        if (
          (l.name &&
            ((t.userData.name = l.name),
            (t.name = THREE.PropertyBinding.sanitizeNodeName(l.name))),
          O(t, l),
          l.extensions && F(s, t, l),
          void 0 !== l.matrix)
        ) {
          var n = new THREE.Matrix4();
          n.fromArray(l.matrix), t.applyMatrix4(n);
        } else void 0 !== l.translation && t.position.fromArray(l.translation), void 0 !== l.rotation && t.quaternion.fromArray(l.rotation), void 0 !== l.scale && t.scale.fromArray(l.scale);
        return t;
      });
    }),
    (D.prototype.loadScene = (function () {
      function e(t, r, a, s) {
        var n = a.nodes[t];
        return s
          .getDependency("node", t)
          .then(function (e) {
            return void 0 === n.skin
              ? e
              : s
                  .getDependency("skin", n.skin)
                  .then(function (e) {
                    for (
                      var r = [], a = 0, n = (t = e).joints.length;
                      a < n;
                      a++
                    )
                      r.push(s.getDependency("node", t.joints[a]));
                    return Promise.all(r);
                  })
                  .then(function (r) {
                    return (
                      e.traverse(function (e) {
                        if (e.isMesh) {
                          for (
                            var a = [], s = [], n = 0, o = r.length;
                            n < o;
                            n++
                          ) {
                            var i = r[n];
                            if (i) {
                              a.push(i);
                              var l = new THREE.Matrix4();
                              void 0 !== t.inverseBindMatrices &&
                                l.fromArray(
                                  t.inverseBindMatrices.array,
                                  16 * n
                                ),
                                s.push(l);
                            } else
                              console.warn(
                                'THREE.GLTFLoader: Joint "%s" could not be found.',
                                t.joints[n]
                              );
                          }
                          e.bind(new THREE.Skeleton(a, s), e.matrixWorld);
                        }
                      }),
                      e
                    );
                  });
            var t;
          })
          .then(function (t) {
            r.add(t);
            var o = [];
            if (n.children)
              for (var i = n.children, l = 0, c = i.length; l < c; l++) {
                var u = i[l];
                o.push(e(u, t, a, s));
              }
            return Promise.all(o);
          });
      }
      return function (t) {
        var r = this.json,
          a = this.extensions,
          s = this.json.scenes[t],
          n = new THREE.Group();
        s.name && (n.name = s.name), O(n, s), s.extensions && F(a, n, s);
        for (var o = s.nodes || [], i = [], l = 0, c = o.length; l < c; l++)
          i.push(e(o[l], n, r, this));
        return Promise.all(i).then(function () {
          return n;
        });
      };
    })()),
    e
  );
})());
