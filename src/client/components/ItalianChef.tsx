import * as THREE from 'three';

export class ItalianChef {
  group: THREE.Group;
  private walkDirection: number = 1;
  private walkSpeed: number = 0.05;
  private walkRange: number = 5;
  private initialPosition: THREE.Vector3;

  constructor() {
    this.group = new THREE.Group();
    this.createChef();
    this.initialPosition = new THREE.Vector3(0, 0, 0);
  }

  private createChef() {
    // Body (Green, white, and red for Italian flag colors)
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.3, 1.5, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x009246 }); // Italian green
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    this.group.add(body);

    // White shirt part
    const shirtGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.5, 8);
    const shirtMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
    shirt.position.y = 1.25;
    this.group.add(shirt);

    // Red scarf
    const scarfGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.3);
    const scarfMaterial = new THREE.MeshPhongMaterial({ color: 0xcd212a });
    const scarf = new THREE.Mesh(scarfGeometry, scarfMaterial);
    scarf.position.y = 1.4;
    this.group.add(scarf);

    // Chef's Hat
    const hatGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 8);
    const hatMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 2;
    this.group.add(hat);

    // Mustache
    const mustacheGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.1);
    const mustacheMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2803 });
    const mustache = new THREE.Mesh(mustacheGeometry, mustacheMaterial);
    mustache.position.set(0, 1.6, 0.25);
    this.group.add(mustache);

    // Bowl for pasta
    const bowlGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.3, 32);
    const bowlMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
    const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
    bowl.position.set(0.8, 1.8, 0);
    this.group.add(bowl);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x009246 });
    
    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.2, 0);
    this.group.add(rightLeg);

    // Left leg
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.2, 0);
    this.group.add(leftLeg);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x009246 });
    
    // Right arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 1.2, 0);
    rightArm.rotation.z = -Math.PI / 4;
    this.group.add(rightArm);

    // Left arm (holding bowl)
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 1.2, 0);
    leftArm.rotation.z = Math.PI / 4;
    this.group.add(leftArm);

    // Feet
    const footGeometry = new THREE.BoxGeometry(0.25, 0.1, 0.4);
    const footMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2803 });
    
    // Right foot
    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.2, -0.2, 0.1);
    this.group.add(rightFoot);

    // Left foot
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.2, -0.2, 0.1);
    this.group.add(leftFoot);
  }

  update() {
    const time = Date.now() * 0.001;
    
    // Walking motion
    this.group.position.x += this.walkSpeed * this.walkDirection;
    
    // Change direction when reaching bounds
    if (Math.abs(this.group.position.x - this.initialPosition.x) > this.walkRange) {
      this.walkDirection *= -1;
      this.group.rotation.y = Math.PI * (this.walkDirection < 0 ? 1 : 0);
    }

    // Leg animation
    const rightLeg = this.group.children[6];
    const leftLeg = this.group.children[7];
    const rightFoot = this.group.children[10];
    const leftFoot = this.group.children[11];
    
    // Swing legs
    const legSwing = Math.sin(time * 5) * 0.3;
    rightLeg.rotation.x = legSwing;
    leftLeg.rotation.x = -legSwing;
    rightFoot.rotation.x = legSwing;
    leftFoot.rotation.x = -legSwing;

    // Body bounce
    this.group.position.y = Math.abs(Math.sin(time * 5)) * 0.1;

    // Dramatic bowl tipping
    const bowl = this.group.children[5]; // The bowl
    bowl.rotation.z = Math.sin(time * 2) * 0.8 + 0.5; // More extreme tipping

    // Arms follow bowl movement
    const leftArm = this.group.children[9]; // Left arm holding bowl
    leftArm.rotation.z = Math.PI / 4 + Math.sin(time * 2) * 0.3;

    // Hat bobble
    const hat = this.group.children[3];
    hat.rotation.z = Math.sin(time * 3) * 0.1;

    // Scarf flutter
    const scarf = this.group.children[2];
    scarf.rotation.z = Math.sin(time * 4) * 0.15;
  }

  setPosition(position: THREE.Vector3) {
    this.initialPosition.copy(position);
    this.group.position.copy(position);
  }
}

export default ItalianChef; 