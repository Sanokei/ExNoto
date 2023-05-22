$(document).ready(function(){
  $(this).scrollTop(0);
});

const container = document.getElementById("container");
const planetModel = document.querySelector(".planet-model");
const planetText = document.querySelector(".planet-text");
const wavyDune = document.querySelector(".wavy-dunes");
const moonContainer = document.querySelector(".moon-container");
const moonModel = document.querySelector(".moon-model");
const moonText = document.querySelector(".moon-text");
const backgroundOverlay = document.querySelector(".background-overlay");

gsap.registerPlugin(ScrollTrigger);

function waitForModelLoad(modelElement) {
  return new Promise((resolve, reject) => {
    // Check if the model is already loaded
    if (modelElement.modelIsVisible) return resolve();

    // Listen to the "model-visibility" event
    modelElement.addEventListener("model-visibility", (event) => {
      if (event.detail.visible) {
        resolve();
      }
    });
    modelElement.addEventListener("error", reject);
  });
}

// Wrap your existing GSAP animations in an async function and call it
async function initAnimations() {
  const planetModel = document.querySelector(".planet-model");
  const moonModel = document.querySelector(".moon-model");

  // Wait for both models to load before starting the animations
  if (planetModel && moonModel) {
    await Promise.all([
      waitForModelLoad(planetModel),
      waitForModelLoad(moonModel),
    ]);

    gsap.to(planetText, {
      yPercent: -200,
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    gsap.to(planetModel, {
      yPercent: -100,
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    gsap.to(wavyDune, {
      scrollTrigger: {
        trigger: wavyDune.parentElement, // target the parent .pin-container element
        start: "top 100%",
        end: "bottom 100%",
        pin: true,
        scrub: true,
      },
    });
    
    gsap.to(moonModel, {
      yPercent: 0,
      scrollTrigger: {
        trigger: moonModel.parentElement, // target the parent .pin-container element
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(moonContainer, {
      scrollTrigger: {
        trigger: moonContainer.parentElement, // target the parent .pin-container element
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const newColor = `rgba(30, 41, 59, ${self.progress})`;
          container.style.backgroundColor = newColor;
        },
      },
      motionPath: {
        path: [{ x: 0, y: 0 }, { x: "50%", y: "-150%" }],
      },
    });
    
    gsap.to(moonText, {
      opacity: 1,
      scrollTrigger: {
        trigger: moonModel,
        start: "bottom top",
        end: "bottom center",
        scrub: true,
      },
    });
    
    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.top = `${Math.random() * 100}vh`;
      star.style.left = `${Math.random() * 100}vw`;
      container.appendChild(star);
    
      gsap.fromTo(
        star,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: moonModel,
            start: "center top",
            end: "bottom center",
            scrub: true,
          },
        }
      );
    }
  }
  else
  {
    console.error("One or more models are missing");
  }
}

// Call the initAnimations function to start the animations when the models are loaded
initAnimations();