import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { VERT_QUAD } from "./glsl";
import type { ScrollState } from "../lib/useScroll";

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * The film look + Looking-Glass Teleport Veil & Daylight Calibration.
 */
export function Post({
  focusRef,
  reduced,
  scroll,
}: {
  focusRef: React.RefObject<number>;
  reduced: boolean;
  scroll: React.RefObject<ScrollState>;
}) {
  const { gl, scene, camera, size, viewport } = useThree();
  const dpr = viewport.dpr;

  const hasDepth = useMemo(
    () => !!gl.extensions.get("WEBGL_depth_texture"),
    [gl]
  );

  const { rtScene, rtA, rtB, blurMat, postMat, quadScene, quadCam, quad } = useMemo(() => {
    const opts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, stencilBuffer: false };
    const w = Math.max(2, Math.floor(size.width * dpr));
    const h = Math.max(2, Math.floor(size.height * dpr));

    const rtScene = new THREE.WebGLRenderTarget(w, h, opts);
    if (hasDepth) {
      const dt = new THREE.DepthTexture(w, h);
      dt.type = THREE.UnsignedShortType;
      dt.minFilter = THREE.NearestFilter;
      dt.magFilter = THREE.NearestFilter;
      rtScene.depthTexture = dt;
    }
    const bw = Math.max(2, Math.floor(w / 4));
    const bh = Math.max(2, Math.floor(h / 4));
    const rtA = new THREE.WebGLRenderTarget(bw, bh, opts);
    const rtB = new THREE.WebGLRenderTarget(bw, bh, opts);

    const dummy = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    dummy.needsUpdate = true;

    const blurMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiff: { value: null as THREE.Texture | null },
        uDir: { value: new THREE.Vector2(1, 0) },
        uTexel: { value: new THREE.Vector2(1 / bw, 1 / bh) },
      },
      vertexShader: VERT_QUAD,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDiff; uniform vec2 uDir, uTexel; varying vec2 vUv;
        void main(){
          vec2 s = uDir*uTexel;
          vec4 c  = texture2D(tDiff, vUv)*0.1964;
          c += (texture2D(tDiff, vUv+s*1.4117) + texture2D(tDiff, vUv-s*1.4117))*0.2969;
          c += (texture2D(tDiff, vUv+s*3.2941) + texture2D(tDiff, vUv-s*3.2941))*0.0944;
          c += (texture2D(tDiff, vUv+s*5.1764) + texture2D(tDiff, vUv-s*5.1764))*0.0103;
          gl_FragColor = c;
        }`,
    });

    const postMat = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: null as THREE.Texture | null },
        tBlur: { value: null as THREE.Texture | null },
        tDepth: { value: dummy as THREE.Texture },
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(size.width, size.height) },
        uFocus: { value: 16 },
        uRange: { value: 11 },
        uNear: { value: (camera as THREE.PerspectiveCamera).near },
        uFar: { value: (camera as THREE.PerspectiveCamera).far },
        uHasDepth: { value: hasDepth ? 1 : 0 },
        uExposure: { value: 1.38 },
        uDaylight: { value: 0 },
        uPortalVeil: { value: 0 },
        uWeave: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: VERT_QUAD,
      fragmentShader: /* glsl */ `
        uniform sampler2D tScene, tBlur, tDepth;
        uniform float uTime, uFocus, uRange, uNear, uFar, uHasDepth, uExposure, uDaylight, uPortalVeil;
        uniform vec2 uRes, uWeave;
        varying vec2 vUv;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float linDepth(vec2 uv){
          float d = texture2D(tDepth, uv).x;
          float z = d*2.0 - 1.0;
          return (2.0*uNear*uFar)/(uFar + uNear - z*(uFar - uNear));
        }

        void main(){
          // the negative never sat perfectly still in the gate
          vec2 uv = vUv + uWeave;

          // barrel + chromatic aberration + Looking-Glass radial liquid ripple during teleport
          vec2 c = uv - 0.5;
          float r2 = dot(c, c);
          float r = sqrt(r2);
          float ripple = sin(r * 28.0 - uTime * 8.0) * 0.016 * uPortalVeil;
          uv = 0.5 + c * (1.0 + r2 * 0.030 - ripple);
          float ca = 0.0016 + r2 * 0.0090 + uPortalVeil * 0.010;
          vec3 col;
          col.r = texture2D(tScene, 0.5 + (uv - 0.5) * (1.0 + ca)).r;
          col.g = texture2D(tScene, uv).g;
          col.b = texture2D(tScene, 0.5 + (uv - 0.5) * (1.0 - ca)).b;

          // subtle depth of field
          vec3 blurred = texture2D(tBlur, uv).rgb;
          if(uHasDepth > 0.5){
            float ld  = linDepth(uv);
            float coc = clamp(abs(ld - uFocus)/uRange, 0.0, 1.0);
            coc = pow(coc, 1.35);
            col = mix(col, blurred, coc * mix(0.22, 0.12, uDaylight));
          }

          // Adaptive bloom: strong warm streaks in dark barbershop, restrained highlights in daylight marble
          float bloomThresh = mix(0.42, 0.92, uDaylight);
          vec3 bl = vec3(0.0);
          for(int i=-4; i<=4; i++){
            float o = float(i)*0.011;
            vec3 s = texture2D(tBlur, vec2(uv.x + o, uv.y)).rgb;
            bl += max(s - bloomThresh, 0.0) * (1.0 - abs(float(i))*0.16);
          }
          bl /= 6.0;
          col += bl * vec3(1.10,0.92,0.62) * mix(1.1, 0.25, uDaylight);

          vec3 hot = max(texture2D(tBlur, uv).rgb - mix(0.56, 0.95, uDaylight), 0.0);
          col += hot * vec3(1.15,0.88,0.48) * mix(0.65, 0.14, uDaylight);

          col *= uExposure;

          // Adaptive grade: salon obsidian-champagne vs sunlit Mediterranean marble
          float l = dot(col, vec3(0.2126,0.7152,0.0722));
          vec3 salonCol = col*vec3(1.04,1.00,0.95) + vec3(0.025,0.024,0.028)*(1.0 - smoothstep(0.0,0.55,l));
          vec3 dayCol = col*vec3(1.01,0.99,0.96);
          col = mix(salonCol, dayCol, uDaylight);
          col = mix(vec3(l), col, mix(0.94, 1.0, uDaylight));
          col = mix((col*(2.51*col + 0.03))/(col*(2.43*col + 0.59) + 0.14), col / (1.0 + col * 0.22), uDaylight);

          // soft edge vignette (brighter edges in Classical Atelier)
          vec2 v = (vUv - 0.5) * vec2(0.95, 1.10);
          col *= mix(mix(0.72, 0.92, uDaylight), 1.0, smoothstep(0.92, 0.25, length(v)));

          // Looking-Glass alabaster-gold veil during mirror crossing
          vec3 veilCol = vec3(0.98, 0.95, 0.89);
          col = mix(col, veilCol, uPortalVeil * 0.88);

          // grain lives in midtones and softens in daylight
          float lg = dot(col, vec3(0.2126,0.7152,0.0722));
          float g = hash(vUv*uRes + uTime*141.0) - 0.5;
          col += g * mix(0.055, 0.022, uDaylight) * smoothstep(0.0,0.32,lg) * (1.0 - smoothstep(0.55,1.0,lg));

          gl_FragColor = vec4(max(col, 0.0), 1.0);
        }`,
    });

    const quadScene = new THREE.Scene();
    const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat);
    quad.frustumCulled = false;
    quadScene.add(quad);

    return { rtScene, rtA, rtB, blurMat, postMat, quadScene, quadCam, quad };
  }, [hasDepth]);

  // keep the targets matched to the canvas
  useEffect(() => {
    const w = Math.max(2, Math.floor(size.width * dpr));
    const h = Math.max(2, Math.floor(size.height * dpr));
    rtScene.setSize(w, h);
    const bw = Math.max(2, Math.floor(w / 4));
    const bh = Math.max(2, Math.floor(h / 4));
    rtA.setSize(bw, bh);
    rtB.setSize(bw, bh);
    blurMat.uniforms.uTexel.value.set(1 / bw, 1 / bh);
    postMat.uniforms.uRes.value.set(size.width, size.height);
  }, [size.width, size.height, dpr, rtScene, rtA, rtB, blurMat, postMat]);

  useEffect(() => () => {
    rtScene.dispose(); rtA.dispose(); rtB.dispose();
    blurMat.dispose(); postMat.dispose();
  }, [rtScene, rtA, rtB, blurMat, postMat]);

  const last = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current?.smooth ?? 0;
    const daylight = smoothstep(0.35, 0.39, p);
    const veilIn = smoothstep(0.32, 0.365, p);
    const veilOut = 1.0 - smoothstep(0.365, 0.41, p);
    const portalVeil = reduced ? 0 : Math.min(veilIn, veilOut);

    // gate weave and exposure flicker, quantised to 24fps so they read as film
    const ft = Math.floor(t * 24) / 24;
    postMat.uniforms.uTime.value = ft;
    postMat.uniforms.uFocus.value = focusRef.current ?? 16;
    postMat.uniforms.uDaylight.value = daylight;
    postMat.uniforms.uPortalVeil.value = portalVeil;
    postMat.uniforms.uWeave.value.set(
      reduced ? 0 : (Math.sin(ft * 13.1) + Math.sin(ft * 7.7)) * 0.00035 * (1 - daylight * 0.6),
      reduced ? 0 : (Math.sin(ft * 11.3) + Math.sin(ft * 5.9)) * 0.00028 * (1 - daylight * 0.6)
    );
    const baseExp = 1.38 + (1.02 - 1.38) * daylight;
    postMat.uniforms.uExposure.value = reduced
      ? baseExp
      : baseExp + Math.sin(ft * 17.0) * 0.010 + Math.sin(ft * 3.1) * 0.006;

    // 1 — scene, with depth
    gl.setRenderTarget(rtScene);
    gl.clear();
    gl.render(scene, camera);

    // 2 — horizontal, anamorphically wide
    quad.material = blurMat;
    blurMat.uniforms.tDiff.value = rtScene.texture;
    blurMat.uniforms.uDir.value.set(2.6, 0);
    gl.setRenderTarget(rtA);
    gl.render(quadScene, quadCam);

    // 3 — vertical, tighter
    blurMat.uniforms.tDiff.value = rtA.texture;
    blurMat.uniforms.uDir.value.set(0, 1.0);
    gl.setRenderTarget(rtB);
    gl.render(quadScene, quadCam);

    // 4 — composite to the screen
    quad.material = postMat;
    postMat.uniforms.tScene.value = rtScene.texture;
    postMat.uniforms.tBlur.value = rtB.texture;
    if (hasDepth && rtScene.depthTexture) postMat.uniforms.tDepth.value = rtScene.depthTexture;
    gl.setRenderTarget(null);
    gl.render(quadScene, quadCam);

    last.current = t;
  }, 1);

  return null;
}
