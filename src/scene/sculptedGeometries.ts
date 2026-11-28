import * as THREE from "three";

/**
 * Rounded bevelled cube occupying [-0.5, 0.5]^3 so instanced salon counters,
 * lintels, and millwork read with tactile chamfered edges instead of sharp boxes.
 */
export function makeSoftSculptedBoxGeo(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const hw = 0.43;
  const hd = 0.43;
  const r = 0.14;

  s.moveTo(-hw + r, -hd);
  s.lineTo(hw - r, -hd);
  s.quadraticCurveTo(hw, -hd, hw, -hd + r);
  s.lineTo(hw, hd - r);
  s.quadraticCurveTo(hw, hd, hw - r, hd);
  s.lineTo(-hw + r, hd);
  s.quadraticCurveTo(-hw, hd, -hw, hd - r);
  s.lineTo(-hw, -hd + r);
  s.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.86,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.07,
    bevelSegments: 3,
    curveSegments: 6,
  });

  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bb.getSize(size);
  bb.getCenter(center);

  geo.translate(-center.x, -center.y, -center.z);
  geo.scale(
    size.x > 0 ? 1 / size.x : 1,
    size.y > 0 ? 1 / size.y : 1,
    size.z > 0 ? 1 / size.z : 1
  );
  geo.computeVertexNormals();
  return geo;
}

/**
 * Arched classical doorway / mirror surface with dense subdivided vertex grid
 * so vertex shaders can displace liquid-mercury ripples smoothly across the glass.
 */
export function makeArchedPortalGeo(
  width: number,
  height: number,
  segX = 32,
  segY = 44
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const rw = width * 0.5;
  const rh = height * 0.5;
  const springY = height * 0.08;
  const archH = Math.max(0.1, rh - springY);
  const archU = springY / height + 0.5;

  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i);
    const v = uv.getY(i);
    if (v > archU) {
      const s = (v - archU) / Math.max(1e-4, 1 - archU);
      const nx = (u - 0.5) * 2;
      const theta = nx * (Math.PI * 0.5);
      const xLin = nx * rw;
      const xArc = Math.sin(theta) * rw;
      const x = xLin + (xArc - xLin) * s;
      const y = springY + Math.cos(theta) * archH * s;
      pos.setXY(i, x, y);
      uv.setXY(i, x / width + 0.5, y / height + 0.5);
    }
  }

  pos.needsUpdate = true;
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Tubular architectural surround tracing an open-bottom Roman arch frame.
 */
export function makeArchedFrameGeo(
  width: number,
  height: number,
  tubeRadius = 0.18
): THREE.BufferGeometry {
  const rw = width * 0.5;
  const rh = height * 0.5;
  const springY = height * 0.08;
  const archH = Math.max(0.1, rh - springY);
  const pts: THREE.Vector3[] = [];

  pts.push(new THREE.Vector3(-rw, -rh, 0));
  pts.push(new THREE.Vector3(-rw, springY, 0));

  const arcSteps = 24;
  for (let i = 1; i < arcSteps; i++) {
    const theta = -Math.PI * 0.5 + (i / arcSteps) * Math.PI;
    pts.push(new THREE.Vector3(Math.sin(theta) * rw, springY + Math.cos(theta) * archH, 0));
  }

  pts.push(new THREE.Vector3(rw, springY, 0));
  pts.push(new THREE.Vector3(rw, -rh, 0));

  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.15);
  return new THREE.TubeGeometry(curve, 64, tubeRadius, 12, false);
}

/**
 * Turned Classical Roman baluster plinth normalized to y in [0, 1], outer radius ~0.5.
 */
export function makeClassicalBalusterPlinthGeo(radialSegments = 36): THREE.BufferGeometry {
  const profile: Array<[number, number]> = [
    [0.0, 0.0],
    [0.52, 0.0],
    [0.52, 0.05],
    [0.48, 0.09],
    [0.42, 0.12],
    [0.37, 0.17],
    [0.39, 0.21],
    [0.37, 0.42],
    [0.35, 0.65],
    [0.33, 0.78],
    [0.36, 0.82],
    [0.34, 0.85],
    [0.43, 0.92],
    [0.49, 0.96],
    [0.49, 1.0],
    [0.0, 1.0],
  ];

  const pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pts, radialSegments);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Stadium / pill-shaped architectural plaque with clean [0, 1] UV bounds.
 */
export function makeOvalCartoucheGeo(w = 1, h = 1): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const hw = w * 0.5;
  const hh = h * 0.5;
  const r = Math.min(hw, hh) * 0.88;

  s.moveTo(-hw + r, -hh);
  s.lineTo(hw - r, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + r);
  s.lineTo(hw, hh - r);
  s.quadraticCurveTo(hw, hh, hw - r, hh);
  s.lineTo(-hw + r, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - r);
  s.lineTo(-hw, -hh + r);
  s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  const geo = new THREE.ShapeGeometry(s, 18);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }

  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Parametric (u, v) grid geometry for the GPU-morphed Pantheon Astrolabe Halo.
 */
export function makeAstrolabeTubeGridGeo(uSegs = 160, vSegs = 12): THREE.BufferGeometry {
  const cols = uSegs + 1;
  const rows = vSegs + 1;
  const positions = new Float32Array(cols * rows * 3);
  const indices: number[] = [];

  let ptr = 0;
  for (let i = 0; i < cols; i++) {
    const u = i / uSegs;
    for (let j = 0; j < rows; j++) {
      const v = j / vSegs;
      positions[ptr++] = u;
      positions[ptr++] = v;
      positions[ptr++] = 0;
    }
  }

  for (let i = 0; i < uSegs; i++) {
    for (let j = 0; j < vSegs; j++) {
      const a = i * rows + j;
      const b = (i + 1) * rows + j;
      const c = (i + 1) * rows + (j + 1);
      const d = i * rows + (j + 1);
      indices.push(a, b, d, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(indices);
  return geo;
}
