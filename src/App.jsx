import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import "./App.css";

function Panda() {
  return (
    <div className="panda">
      <div className="panda-ear left-ear" />
      <div className="panda-ear right-ear" />
      <div className="panda-face">
        <div className="eye-patch left-patch"><div className="eye" /></div>
        <div className="eye-patch right-patch"><div className="eye" /></div>
        <div className="panda-nose" />
      </div>
      <div className="panda-foot left-foot" />
      <div className="panda-foot right-foot" />
    </div>
  );
}

function App() {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const contentRef = useRef(null);
  const introTopRef = useRef(null);
  const introBottomRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Three.js particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.z = 5;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (error) {
      console.error("Three.js could not initialize:", error);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const particleCount = 160;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.035, transparent: true, opacity: 0.75, depthWrite: false
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const clock = new THREE.Clock();
    let animationFrame;
    const animate = () => {
      const time = clock.getElapsedTime();
      particles.rotation.y = time * 0.012;
      particles.rotation.x = Math.sin(time * 0.15) * 0.025;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // FIRST SCREEN: green clouds cover the top and bottom. They open to reveal
  // the SECOND/FINAL SCREEN: the permanent white cloud-shaped center.
  useEffect(() => {
    const top = introTopRef.current;
    const bottom = introBottomRef.current;
    const content = contentRef.current;
    if (!top || !bottom || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(content, { autoAlpha: 0, y: 12 });
      gsap.set([top, bottom], { y: 0 });

      const timeline = gsap.timeline({ delay: 0.8 });
      timeline
        .to(top, { yPercent: -115, duration: 1.9, ease: "power3.inOut" }, 0)
        .to(bottom, { yPercent: 115, duration: 1.9, ease: "power3.inOut" }, 0)
        .to(content, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" }, "-=0.25");
    });

    return () => ctx.revert();
  }, []);

  // Welcome typewriter
  useEffect(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      const message =
        "Secure access to your digital workspace. Sign in to manage your account, monitor activities, and stay in control.";
      const typeObject = { progress: 0 };
      textRef.current.textContent = "";

      gsap.to(typeObject, {
        progress: message.length,
        duration: 5.5,
        delay: 3.2,
        ease: "none",
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = message.substring(0, Math.floor(typeObject.progress));
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = () => {
    // Keep the login screen in place until the success popup has been visible.
    setShowPopup(true);

    window.setTimeout(() => {
      const topCloud = introTopRef.current;
      const bottomCloud = introBottomRef.current;
      const content = contentRef.current;

      gsap.timeline({
        onComplete: () => setShowPopup(false)
      })
        .to(content, {
          autoAlpha: 0,
          y: 12,
          duration: 0.65,
          ease: "power2.in"
        }, 0)
        .to(topCloud, {
          yPercent: 0,
          duration: 1.7,
          ease: "power3.inOut"
        }, 0.15)
        .to(bottomCloud, {
          yPercent: 0,
          duration: 1.7,
          ease: "power3.inOut"
        }, 0.15);
    }, 2200);
  };

  return (
    <main className="login-page">
      <div className="green-bg" />
      <canvas ref={canvasRef} className="three-background" />

      {/* WHITE CLOUD-SHAPED CENTER WITH GREEN VISIBLE ABOVE AND BELOW */}
      <svg
        className="cloud-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#ffffff"
          d="
            M0 118
            C35 118 45 88 82 88 C118 88 128 118 165 118
            C205 118 215 76 255 76 C295 76 305 108 345 108
            C385 108 395 67 435 67 C475 67 485 105 525 105
            C565 105 575 77 615 77 C655 77 665 112 705 112
            C745 112 755 76 795 76 C835 76 845 108 885 108
            C925 108 935 73 975 73 C1015 73 1025 110 1065 110
            C1105 110 1115 78 1155 78 C1195 78 1205 112 1245 112
            C1285 112 1295 75 1335 75 C1375 75 1385 118 1440 118
            L1440 748
            C1400 748 1390 788 1350 788 C1310 788 1300 750 1260 750
            C1220 750 1210 790 1170 790 C1130 790 1120 750 1080 750
            C1040 750 1030 790 990 790 C950 790 940 750 900 750
            C860 750 850 790 810 790 C770 790 760 750 720 750
            C680 750 670 790 630 790 C590 790 580 750 540 750
            C500 750 490 790 450 790 C410 790 400 750 360 750
            C320 750 310 790 270 790 C230 790 220 750 180 750
            C140 750 130 790 90 790 C50 790 40 750 0 750 Z
          "
        />
      </svg>

      {/* FIRST-SCREEN INTRO OVERLAY: green clouds + white center gap.
          These two green panels slide away, while the white final cloud stays. */}
      <svg
        className="intro-cloud-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g ref={introTopRef}>
          <path fill="#42a88f" d="M0 0H1440V310 C1400 310 1390 280 1350 280 C1310 280 1300 315 1260 315 C1220 315 1210 280 1170 280 C1130 280 1120 315 1080 315 C1040 315 1030 280 990 280 C950 280 940 315 900 315 C860 315 850 280 810 280 C770 280 760 315 720 315 C680 315 670 280 630 280 C590 280 580 315 540 315 C500 315 490 280 450 280 C410 280 400 315 360 315 C320 315 310 280 270 280 C230 280 220 315 180 315 C140 315 130 280 90 280 C50 280 40 310 0 310Z" />
        </g>
        <g ref={introBottomRef}>
          <path fill="#42a88f" d="M0 590 C40 590 50 620 90 620 C130 620 140 585 180 585 C220 585 230 620 270 620 C310 620 320 585 360 585 C400 585 410 620 450 620 C490 620 500 585 540 585 C580 585 590 620 630 620 C670 620 680 585 720 585 C760 585 770 620 810 620 C850 620 860 585 900 585 C940 585 950 620 990 620 C1030 620 1040 585 1080 585 C1120 585 1130 620 1170 620 C1210 620 1220 585 1260 585 C1300 585 1310 620 1350 620 C1390 620 1400 590 1440 590V900H0Z" />
        </g>
      </svg>

      <section className="content" ref={contentRef}>
        <div className="login-card">
          {showPopup && (
            <div className="login-popup">
              <span className="popup-check">✓</span>
              <div className="popup-content">
                <strong>Login Successful!</strong>
                <small>Welcome back</small>
              </div>
            </div>
          )}

          <h1>Hello!</h1>
          <p className="subtitle">Sign in to your account</p>
          <Panda />

          <div className="input-row">
            <span className="input-icon">✉</span>
            <input type="email" placeholder="Email Address" />
          </div>

          <div className="input-row">
            <span className="input-icon">♧</span>
            <input type={showPassword ? "text" : "password"} placeholder="Password" />
            <button type="button" className="eye-btn"
              onClick={() => setShowPassword(value => !value)}
              aria-label="Show or hide password">◉</button>
          </div>

          <div className="options">
            <label><input type="checkbox" defaultChecked /><span>Remember me</span></label>
            <button type="button" className="forgot">Forgot password?</button>
          </div>

          <button type="button" className="signin" onClick={handleLogin}>SIGN IN</button>

          <div className="create-account">
            Don't have an account?
            <button type="button">Create</button>
          </div>
        </div>

        <div className="welcome">
          <h2>Welcome Back!</h2>
          <div className="green-line" />
          <p ref={textRef} className="welcome-text" />
        </div>
      </section>
    </main>
  );
}

export default App;
