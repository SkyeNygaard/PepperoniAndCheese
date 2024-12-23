import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ItalianChef from './ItalianChef';
import PastaSystem from './PastaSystem';
import ItalianLandmarks from './ItalianLandmarks';

const SpaghettiAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const handleFirstInteraction = useCallback((e: MouseEvent) => {
    console.log('Interaction detected', { audioLoaded, audioRef: !!audioRef.current });
    if (audioRef.current && audioLoaded) {
      console.log('Attempting to play audio');
      audioRef.current.play().then(() => {
        console.log('Audio playing successfully');
        window.removeEventListener('click', handleFirstInteraction);
      }).catch(error => {
        console.warn('Audio playback failed:', error);
      });
    }
  }, [audioLoaded]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Italian sky blue
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 10);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced lighting for dramatic effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffa95c, 1);
    spotLight.position.set(-5, 8, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Add directional light for landmarks
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add chef
    const chef = new ItalianChef();
    chef.group.position.set(0, 0, 0);
    scene.add(chef.group);

    // Add pasta system
    const pastaSystem = new PastaSystem(new THREE.Vector3(0.8, 1.8, 0));
    scene.add(pastaSystem.group);

    // Add landmarks
    const landmarks = new ItalianLandmarks();
    scene.add(landmarks.group);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update components
      chef.update();
      pastaSystem.update();
      landmarks.update();

      // Update pasta spawn point based on bowl position
      const bowlWorldPosition = new THREE.Vector3();
      chef.group.children[6].getWorldPosition(bowlWorldPosition); // Bowl is the 7th child
      pastaSystem.setSpawnPoint(bowlWorldPosition);

      controls.update();
      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    // Update audio loading logic
    audioRef.current = new Audio('/audio/tarantella.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    console.log('Setting up audio');

    const handleCanPlayThrough = () => {
      console.log('Audio can play through');
      setAudioLoaded(true);
      window.addEventListener('click', handleFirstInteraction);
    };

    // Add event listeners for audio loading
    audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);

    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio loading failed:', e);
      const audio = audioRef.current;
      if (audio) {
        console.error('Audio error details:', {
          error: audio.error,
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src
        });
      }
      console.log('Note: Please add a tarantella.mp3 file to public/audio/ for the full experience');
    });

    // Verify file exists before loading
    fetch('/audio/tarantella.mp3')
      .then(response => {
        if (!response.ok) throw new Error('Audio file not found');
        console.log('Audio file exists');
        audioRef.current?.load();
      })
      .catch(error => console.error('Failed to verify audio file:', error));

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('click', handleFirstInteraction);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [handleFirstInteraction]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SpaghettiAnimation;