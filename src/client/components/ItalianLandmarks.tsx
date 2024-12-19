import * as THREE from 'three';

export class ItalianLandmarks {
  group: THREE.Group;
  private decorations: THREE.Sprite[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.createColosseum();
    this.createLeaningTower();
    this.createFloatingDecorations();
  }

  private async createFloatingDecorations() {
    const svgLoader = new THREE.TextureLoader();
    const decorationPaths = [
      '/icons/pizza.svg',
      '/icons/pasta.svg',
      '/icons/wine.svg',
      '/icons/coffee.svg',
      '/icons/vespa.svg',
      '/icons/flag.svg',
      '/icons/gondola.svg'
    ];

    for (let i = 0; i < decorationPaths.length; i++) {
      const texture = await svgLoader.loadAsync(decorationPaths[i]);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
      const sprite = new THREE.Sprite(spriteMaterial);
      
      // Random position in a circle around the scene
      const angle = (i / decorationPaths.length) * Math.PI * 2;
      const radius = 12;
      sprite.position.set(
        Math.cos(angle) * radius,
        3 + Math.random() * 2, // Random height between 3-5 units
        Math.sin(angle) * radius
      );
      
      sprite.scale.set(2, 2, 2);
      this.decorations.push(sprite);
      this.group.add(sprite);
    }
  }

  private createColosseum() {
    const colosseumGroup = new THREE.Group();
    
    // Base structure
    const baseGeometry = new THREE.CylinderGeometry(3, 3, 2, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd2b48c,
      roughness: 0.8,
      metalness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    colosseumGroup.add(base);

    // Arches
    const archCount = 16;
    for (let i = 0; i < archCount; i++) {
      const angle = (i / archCount) * Math.PI * 2;
      const archGeometry = new THREE.TorusGeometry(0.3, 0.1, 8, 8, Math.PI);
      const arch = new THREE.Mesh(archGeometry, baseMaterial);
      
      arch.position.set(
        Math.cos(angle) * 2.8,
        0.5,
        Math.sin(angle) * 2.8
      );
      arch.rotation.y = -angle;
      colosseumGroup.add(arch);
    }

    // Upper level
    const upperGeometry = new THREE.CylinderGeometry(2.8, 2.8, 0.5, 32);
    const upper = new THREE.Mesh(upperGeometry, baseMaterial);
    upper.position.y = 1;
    colosseumGroup.add(upper);

    colosseumGroup.position.set(-8, 0, -8);
    this.group.add(colosseumGroup);
  }

  private createLeaningTower() {
    const towerGroup = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 0.5, 8);
    const stoneMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5f5f5,
      roughness: 0.6,
      metalness: 0.1
    });
    const base = new THREE.Mesh(baseGeometry, stoneMaterial);
    towerGroup.add(base);

    // Tower sections
    const sectionCount = 8;
    for (let i = 0; i < sectionCount; i++) {
      const sectionGeometry = new THREE.CylinderGeometry(
        0.7 - (i * 0.05),
        0.7 - (i * 0.05),
        0.5,
        8
      );
      const section = new THREE.Mesh(sectionGeometry, stoneMaterial);
      section.position.y = 0.5 + (i * 0.5);
      towerGroup.add(section);

      // Add decorative columns to each section
      const columnCount = 8;
      for (let j = 0; j < columnCount; j++) {
        const angle = (j / columnCount) * Math.PI * 2;
        const columnGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 4);
        const column = new THREE.Mesh(columnGeometry, stoneMaterial);
        
        const radius = 0.7 - (i * 0.05);
        column.position.set(
          Math.cos(angle) * radius,
          0.5 + (i * 0.5),
          Math.sin(angle) * radius
        );
        towerGroup.add(column);
      }
    }

    // Top dome
    const domeGeometry = new THREE.SphereGeometry(0.4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeometry, stoneMaterial);
    dome.position.y = 0.5 + (sectionCount * 0.5);
    towerGroup.add(dome);

    // Apply the famous lean
    towerGroup.rotation.z = Math.PI * 0.03; // About 5.4 degrees
    towerGroup.position.set(8, 0, -8);
    this.group.add(towerGroup);
  }

  update() {
    const time = Date.now() * 0.0001;
    
    // Update landmarks
    this.group.children.forEach((landmark, i) => {
      if (landmark instanceof THREE.Sprite) return; // Skip sprites
      landmark.rotation.y = Math.sin(time + i) * 0.02;
    });

    // Update floating decorations
    this.decorations.forEach((sprite, i) => {
      // Gentle floating motion
      sprite.position.y = 3 + Math.sin(time * 2 + i) * 0.5;
      // Slow rotation
      sprite.material.rotation += 0.01;
      // Gentle size pulsing
      const scale = 2 + Math.sin(time * 3 + i) * 0.2;
      sprite.scale.set(scale, scale, scale);
    });
  }
}

export default ItalianLandmarks; 