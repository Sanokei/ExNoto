$(document).ready(function(){
  $(this).scrollTop(0);
});

const nav = document.querySelector("nav");
const supportPageOffset = window.pageXOffset !== undefined;
const isCSS1Compat = (document.compatMode || "") === "CSS1Compat";

let previousScrollPosition = 0;

const isScrollingDown = () => {
  let scrolledPosition = supportPageOffset
    ? window.pageYOffset
    : isCSS1Compat
    ? document.documentElement.scrollTop
    : document.body.scrollTop;
  let isScrollDown;

  if (scrolledPosition > previousScrollPosition) {
    isScrollDown = true;
  } else {
    isScrollDown = false;
  }
  previousScrollPosition = scrolledPosition;
  return isScrollDown;
};

const handleNavScroll = () => {
  if (isScrollingDown() && !nav.contains(document.activeElement)) {
    nav.classList.add("scroll-down");
    nav.classList.remove("scroll-up");
  } else {
    nav.classList.add("scroll-up");
    nav.classList.remove("scroll-down");
  }
};

var throttleTimer;

const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("scroll", () => {
  if (mediaQuery && !mediaQuery.matches) {
    throttle(handleNavScroll, 125);
  }
});

// 

const container = document.getElementById("container");
const body = document.querySelector("body");

const earthContainer = document.querySelector(".earth-container");
const planetsContainer = document.querySelector(".planets-container");
const planetModel = document.querySelector(".planet-model");
const planetText = document.querySelector(".planet-text");

const moonContainer = document.querySelector(".moon-container");
const moonModel = document.querySelector(".moon-model");
const moonText = document.querySelector(".moon-text");
const duneImage = document.querySelector(".wavy-dunes");
const duneMoonContainer = document.querySelector(".dune-moon-container");
const starbackCanvas = document.querySelector('.starback-canvas');

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true) // TODO: breaks w/o it cuz zoom on model viwer for planet

ScrollTrigger.defaults({
  //restart onEnter, complete onLeave, resume onEnterBack, reverse onLeaveBack
 toggleActions: "restart complete resume reverse"
});

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
  }
  else
  {
    console.error("One or more models are missing");
  }
}

// Call the initAnimations function to start the animations when the models are loaded
initAnimations();


/*             Background                */

/* */
const backgroundAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: planetsContainer,
    // endTrigger: '.wavy-dunes',
    start: () => "top top",
    end: () => "bottom bottom",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: function (self) {
      // Calculate the new background color based on the scroll progress
      const newColor = `rgba(30, 41, 59, ${self.progress})`;
      // Update the container's background color
      body.style.backgroundColor = newColor;
    },
  },
});


// add the stars to the animation with gsap's .to() method
backgroundAnimation.to(planetsContainer, {
  easing: "linear",
})
.to('.star-container .sb-star', {
  duration: 1, // change this number to control the speed of animation
  opacity: 1,
  repeat: -1, // repeat the animation indefinitely
  yoyo: true // animate back and forth between opacity 0 and 1
});

/*             Section 1                */

const planetTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".earth-container",
    start: "top top-=80vh",
    end: "center-=100 top",
    scrub: true,
    onUpdate: (self) => {
      const opacity = 1 - self.progress;
      gsap.set(planetText, { opacity: opacity });
    },
  },
});



planetTimeline.to(planetText, { y: "30vh" });


/*             Section 2                */


// Pin the dune image
duneImage.style.position = "fixed";
duneImage.style.top = 0;
duneImage.style.left = 0;
moonModel.style.position = "fixed";
moonModel.style.bottom = "-20%"; // Adjust the position as needed
moonModel.style.left = "50%"; // Adjust the position as needed
moonModel.style.transform = "translate(-50%, 0) scale(.25)"; // Center and scale the moon model
moonModel.style.zIndex = "-1"; // Set a negative z-index to place it behind the dune image

const moonTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: moonContainer,
    start: () => "top center-=30%", // Start the animation when the top of the trigger element reaches the vertical center of the viewport
    end: () => "bottom+=180% bottom", // Animation ends when the bottom of the trigger element reaches the vertical center of the viewport
    scrub: 0.5,
    pin: [duneMoonContainer, starbackCanvas],
    onUpdate: (self) => {
      const progress = self.progress;
      const xPos = Math.sin(progress * Math.PI * 2) * (moonContainer.offsetWidth * 0.5);
      const yPos = -(Math.cos(progress * Math.PI * 2) * (moonContainer.offsetHeight * 0.3)); // 
      gsap.set(moonModel, { x: xPos, y: yPos }); // Update the moon model position
    },
  },
});

// Add animations to the moonTimeline
moonTimeline.to(moonModel, {})

/*             Section 3                */
const demoContainer = document.querySelector(".demo-container");
const pinDemo = document.querySelector(".pin-demo");
const demoText = document.querySelector(".demo-text");

const demoTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: demoContainer,
    // start: () => "top center",
    start: "50% 50%",
    end: () => "bottom+=2000vh top",
    scrub: 0.5,
    pin: pinDemo,
    markers:true,
    // toggleActions: 'play reverse play reverse',
  },
});

// Set the initial size and position of the highlight
gsap.set(".highlight", {
  position: "absolute",
  left: 0,
  width: 0,
  height: "33%",
  backgroundColor: "#3a8fff",
  transform: "translate(50%,50%)",
  opacity: 0.5,
});

demoTimeline
  .to(demoText, {
    opacity: 1,
  },">")
  .to(".highlight", {
      width: "60%",
      ease: "power2.inOut",
  },">")
  .to(pinDemo, {
    
  })
;