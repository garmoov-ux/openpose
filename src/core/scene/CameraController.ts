import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraPreset } from '@/types';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  constructor(camera: THREE.PerspectiveCamera, controls: OrbitControls) {
    this.camera = camera;
    this.controls = controls;
  }

  // 기본 시점 프리셋 적용 (전신이 모두 보이도록 거리 및 타겟 보정)
  public setStandardPreset(preset: CameraPreset): void {
    const target = new THREE.Vector3(0, 0.86, 0);
    this.camera.fov = 42;

    switch (preset) {
      case 'front':
        this.camera.position.set(0, 0.92, 3.75);
        break;
      case 'side':
        this.camera.position.set(3.75, 0.92, 0);
        break;
      case 'top':
        this.camera.position.set(0, 4.2, 0.05);
        break;
      case 'closeup':
        target.set(0, 1.42, 0);
        this.camera.position.set(0, 1.44, 1.35);
        break;
      case 'fullbody':
        this.camera.position.set(0, 0.9, 4.0);
        break;
    }

    this.applyView(target);
  }

  // 마네킹 실제 신장(heightMeters)에 맞춰 상하단 툴바와 겹치지 않도록 머리부터 발끝까지 한 화면에 담는 풀샷 정렬
  public frameFullBody(heightMeters = 1.72, minY = 0): void {
    const h = Math.max(0.9, heightMeters);
    const centerY = minY + h * 0.5;
    const target = new THREE.Vector3(0, centerY, 0);
    this.camera.fov = 42;
    const fovRad = THREE.MathUtils.degToRad(this.camera.fov);
    const dist = Math.max(2.2, (h * 0.68) / Math.tan(fovRad / 2));
    this.camera.position.set(0, centerY + 0.06, dist);
    this.applyView(target);
  }

  // themes_solo 85mm 망원 렌즈 및 정밀 거리/타겟 샷 적용
  public setSoloThemeShot(targetHeight: number, distance: number, fov = 35): void {
    const target = new THREE.Vector3(0, targetHeight, 0);
    this.camera.fov = fov;
    this.camera.position.set(0, targetHeight + 0.05, Math.max(2.5, distance));
    this.applyView(target);
  }

  private applyView(target: THREE.Vector3): void {
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(target);
    this.camera.lookAt(target);
    this.controls.update();
  }
}
