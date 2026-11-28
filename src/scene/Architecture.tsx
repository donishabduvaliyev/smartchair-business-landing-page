import { useMemo } from "react";
import * as THREE from "three";
import { FLOOR_Y, FOG_COLOR, FOG_DENSITY, ZONES } from "./constants";
import { FOG_FN, VERT_WORLD } from "./glsl";

const fogUniforms = () => ({
  uFogCol: { value: FOG_COLOR },
  uFogDen: { value: FOG_DENSITY },
});

/** Four floor treatments: wood, barbershop check, small wet tile, concrete. */
function makeFloorMat(kind: number) {
  return new THREE.ShaderMaterial({
    uniforms: { uKind: { value: kind }, ...fogUniforms() },
    vertexShader: VERT_WORLD,
    fragmentShader: /* glsl */ `
      ${FOG_FN}
      uniform float uKind; varying vec3 vP; varying float vZ;
      float grid(vec2 uv, float s){ vec2 f = fract(uv/s); return min(min(f.x,1.0-f.x), min(f.y,1.0-f.y)); }
      void main(){
        vec3 col;
        if(uKind < 0.5){                                  // warm walnut boards
          float b = fract(vP.x*0.28);
          float seam = smoothstep(0.045, 0.0, min(b, 1.0-b));
          float grain = 0.5 + 0.5*sin(vP.y*3.1 + floor(vP.x*0.28)*11.0);
          col = mix(vec3(0.14,0.10,0.07), vec3(0.20,0.14,0.09), grain);
          col *= 1.0 - seam*0.45;
        } else if(uKind < 1.5){                           // luxury charcoal & warm travertine check
          vec2 g = floor(vec2(vP.x, vP.y)/3.2);
          float chk = mod(g.x + g.y, 2.0);
          col = mix(vec3(0.08,0.09,0.11), vec3(0.22,0.21,0.19), chk);
          col *= smoothstep(0.0, 0.035, grid(vec2(vP.x,vP.y), 3.2))*0.45 + 0.55;
        } else if(uKind < 2.5){                           // spa mosaic tile
          col = vec3(0.11,0.13,0.15);
          col *= smoothstep(0.0, 0.06, grid(vec2(vP.x,vP.y), 1.1))*0.4 + 0.6;
          col += vec3(0.24,0.20,0.12) * pow(max(1.0-abs(vP.x)/4.0, 0.0), 2.0) * 0.5;
        } else {                                          // polished architectural concrete
          float n = fract(sin(dot(floor(vec2(vP.x,vP.y)*1.4), vec2(12.99,78.23)))*43758.5);
          col = vec3(0.10,0.11,0.13) + n*0.020;
        }
        // every ceiling lamp pools warmly on the floor beneath it
        float lz = mod(-vP.y + 20.0, 50.0);
        float pool = pow(max(1.0-abs(lz-25.0)/9.0, 0.0), 2.2) * pow(max(1.0-abs(vP.x)/5.5, 0.0), 1.6);
        col += vec3(0.95,0.78,0.45) * pool * 0.42;
        gl_FragColor = vec4(applyFog(col, vZ), 1.0);
      }`,
  });
}

/** Papered wall with wainscot, white subway tile, or bare block. */
function makeWallMat(kind: number) {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: { uKind: { value: kind }, ...fogUniforms() },
    vertexShader: VERT_WORLD,
    fragmentShader: /* glsl */ `
      ${FOG_FN}
      uniform float uKind; varying vec3 vP; varying float vZ;
      void main(){
        float y = vP.y; vec3 col;
        if(uKind < 1.5){
          float stripe = step(0.5, fract(vP.x*0.42));
          vec3 up = mix(vec3(0.09,0.09,0.10), vec3(0.13,0.12,0.11), stripe);
          col = mix(vec3(0.045,0.048,0.055), up, step(-1.2, y));
          col += vec3(0.83,0.68,0.35) * smoothstep(0.10, 0.0, abs(y+1.2)) * 0.45;
        } else if(uKind < 2.5){
          float row = floor(y*1.5);
          float ox = mod(row, 2.0)*0.5;
          vec2 f = fract(vec2(vP.x*0.75 + ox, y*1.5));
          float gt = min(min(f.x,1.0-f.x), min(f.y,1.0-f.y));
          col = vec3(0.20,0.22,0.24) * (smoothstep(0.0,0.07,gt)*0.45 + 0.55);
        } else {
          float n = fract(sin(dot(floor(vec2(vP.x,y)*0.8), vec2(41.3,289.1)))*43758.5);
          col = vec3(0.075,0.080,0.088) + n*0.022;
          col *= smoothstep(0.0, 0.05, min(fract(y*0.35), 1.0-fract(y*0.35)))*0.35 + 0.65;
        }
        gl_FragColor = vec4(applyFog(col, vZ), 1.0);
      }`,
  });
}

export function Architecture() {
  const { floorMats, wallMats, ceilMat, planeGeo } = useMemo(() => {
    const f: Record<number, THREE.Material> = {};
    const w: Record<number, THREE.Material> = {};
    [0, 1, 2, 3].forEach((k) => { f[k] = makeFloorMat(k); w[k] = makeWallMat(k); });
    return {
      floorMats: f,
      wallMats: w,
      ceilMat: new THREE.MeshBasicMaterial({ color: 0x090a0c, fog: true }),
      planeGeo: new THREE.PlaneGeometry(1, 1),
    };
  }, []);

  return (
    <group>
      {/* World 1 Physical Barbershop Corridor (Zones 0 & 1: z +14 -> -102) */}
      {ZONES.slice(0, 2).map(([name, z0, z1, hw, cy, fk, wk]) => {
        const len = Math.abs(z1 - z0), mid = (z0 + z1) / 2;
        return (
          <group key={name}>
            <mesh geometry={planeGeo} material={floorMats[fk]}
                  position={[0, FLOOR_Y, mid]} rotation={[-Math.PI / 2, 0, 0]}
                  scale={[hw * 2, len, 1]} />
            <mesh geometry={planeGeo} material={ceilMat}
                  position={[0, cy, mid]} rotation={[Math.PI / 2, 0, 0]}
                  scale={[hw * 2, len, 1]} />
            {[-1, 1].map((s) => (
              <mesh key={s} geometry={planeGeo} material={wallMats[wk]}
                    position={[s * hw, (cy + FLOOR_Y) / 2, mid]}
                    rotation={[0, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
                    scale={[len, cy - FLOOR_Y, 1]} />
            ))}
          </group>
        );
      })}
    </group>
  );
}
