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

  // 기본 시점 프리셋 적용
  public setStandardPreset(preset: CameraPreset): void {
    const target = new THREE.Vector3(0, 0.95, 0);
    this.camera.fov = 45;

    switch (preset) {
      case 'front':
        this.camera.position.set(0, 1.0, 3.2);
        break;
      case 'side':
        this.camera.position.set(3.2, 1.0, 0);
        break;
      case 'top':
        this.camera.position.set(0, 4.0, 0.05);
        break;
      case 'closeup':
        target.set(0, 1.45, 0);
        this.camera.position.set(0, 1.45, 1.2);
        break;
      case 'fullbody':
        this.camera.position.set(0, 0.95, 3.8);
        break;
    }

    this.applyView(target);
  }

  // themes_solo 85mm 망원 렌즈 및 정밀 거리/타겟 샷 적용 (0.5m ~ 0.6m)
  public setSoloThemeShot(targetHeight: number, distance: number, fov = 28): void {
    const target = new THREE.Vector3(0, targetHeight, 0);
    this.camera.fov = fov;
    this.camera.position.set(0, targetHeight + 0.05, distance);
    this.applyView(target);
  }

  private applyView(target: THREE.Vector3): void {
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(target);
    this.camera.lookAt(target);
    this.controls.update();
  }
}
