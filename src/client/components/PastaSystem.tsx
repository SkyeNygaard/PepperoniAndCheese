import * as THREE from 'three';

export class PastaSystem {
  group: THREE.Group;
  private pastaStrands: THREE.Mesh[] = [];
  private spawnPoint: THREE.Vector3;
  private readonly STRAND_COUNT = 200;
  private readonly SPAWN_RATE = 5;
  private readonly PASTA_TYPES = [
    { geometry: new THREE.TorusGeometry(0.1, 0.02, 8, 20), scale: 1 },
    { geometry: new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), scale: 1 },
    { geometry: new THREE.TorusGeometry(0.05, 0.02, 8, 12, Math.PI), scale: 0.8 },
    { geometry: new THREE.BoxGeometry(0.15, 0.15, 0.02), scale: 0.7 }
  ];

  constructor(spawnPoint: THREE.Vector3) {
    this.group = new THREE.Group();
    this.spawnPoint = spawnPoint;
    this.initializePastaPool();
  }

  private initializePastaPool() {
    const strandMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf4d03f,
      shininess: 30
    });

    for (let i = 0; i < this.STRAND_COUNT; i++) {
      const pastaType = this.PASTA_TYPES[Math.floor(Math.random() * this.PASTA_TYPES.length)];
      const strand = new THREE.Mesh(pastaType.geometry, strandMaterial);
      
      strand.visible = false;
      strand.userData = {
        velocity: new THREE.Vector3(),
        rotationVelocity: new THREE.Vector3(),
        active: false,
        baseScale: pastaType.scale
      };
      this.pastaStrands.push(strand);
      this.group.add(strand);
    }
  }

  private spawnStrand() {
    const strand = this.pastaStrands.find(s => !s.userData.active);
    if (!strand) return;

    const spawnOffset = new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.3
    );

    strand.position.copy(this.spawnPoint).add(spawnOffset);
    strand.visible = true;
    strand.userData.active = true;

    strand.userData.velocity.set(
      (Math.random() - 0.5) * 0.3,
      Math.random() * 0.1,
      (Math.random() - 0.5) * 0.3
    );

    strand.userData.rotationVelocity.set(
      Math.random() * 0.2,
      Math.random() * 0.2,
      Math.random() * 0.2
    );

    const scale = (0.5 + Math.random() * 0.5) * strand.userData.baseScale;
    strand.scale.set(scale, scale, scale);
  }

  update() {
    for (let i = 0; i < this.SPAWN_RATE; i++) {
      this.spawnStrand();
    }

    this.pastaStrands.forEach(strand => {
      if (!strand.userData.active) return;

      strand.userData.velocity.y -= 0.015;
      
      strand.userData.velocity.x += (Math.random() - 0.5) * 0.001;
      strand.userData.velocity.z += (Math.random() - 0.5) * 0.001;

      strand.userData.velocity.multiplyScalar(0.99);
      
      strand.position.add(strand.userData.velocity);

      strand.rotation.x += strand.userData.rotationVelocity.x;
      strand.rotation.y += strand.userData.rotationVelocity.y;
      strand.rotation.z += strand.userData.rotationVelocity.z;

      if (strand.position.y < 0.1) {
        strand.position.y = 0.1;
        strand.userData.velocity.y *= -0.5;
        
        if (Math.abs(strand.userData.velocity.y) < 0.01) {
          strand.visible = false;
          strand.userData.active = false;
        }
      }
    });
  }

  setSpawnPoint(point: THREE.Vector3) {
    this.spawnPoint = point;
  }
}

export default PastaSystem; 