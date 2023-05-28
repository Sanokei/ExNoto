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
    throttle(handleNavScroll, 225);
  }
});

// 

const container = document.querySelector(".page-container");
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

const laptopModel = document.querySelector(".laptop-model");

gsap.registerPlugin(ScrollTrigger, TextPlugin);
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
  const laptopModel = document.querySelector(".laptop-model");

  // Wait for both models to load before starting the animations
  if (planetModel && moonModel && laptopModel) {
    await Promise.all([
      waitForModelLoad(planetModel),
      waitForModelLoad(moonModel),
      waitForModelLoad(laptopModel),
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
.to('.star-container', {
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
moonModel.style.bottom = "-40%"; // Adjust the position as needed
moonModel.style.left = "50%"; // Adjust the position as needed
moonModel.style.transform = "translate(-50%, 0) scale(.25)"; // Center and scale the moon model
moonModel.style.zIndex = "-1"; // Set a negative z-index to place it behind the dune image

const moonTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: duneMoonContainer,
    start: () => "top center-=40%", // Start the animation when the top of the trigger element reaches the vertical center of the viewport
    end: () => "bottom+=180% bottom", // Animation ends when the bottom of the trigger element reaches the vertical center of the viewport
    // scrub: 0.5,
    pin: moonContainer,
    onUpdate: (self) => {
      const progress = self.progress - .50;
      const xPos = Math.sin((progress + (progress * .10)) * Math.PI) * (moonContainer.offsetWidth * 0.4);
      const yPos = -(Math.cos(progress * Math.PI) * (moonContainer.offsetHeight * .6)); // 
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
const mousePointer = document.querySelector(".mouse-pointer");

const demoWrapper = document.querySelector(".demo-wrapper");

const clickHandler = e => {
}

const contextMenu = new ContextMenu(document.body, [
  {text: 'Back', hotkey: 'Alt+Left arrow', disabled: true, onclick: clickHandler},
  {text: 'Forward', hotkey: 'Alt+Right arrow', disabled: true, onclick: clickHandler},
  {text: 'Reload', hotkey: 'Ctrl+R', onclick: clickHandler},
  null,
  {text: 'Save as...', hotkey: 'Ctrl+S', onclick: clickHandler},
  {text: 'Print...', hotkey: 'Ctrl+P', onclick: clickHandler},
  {text: 'Cast...', onclick: clickHandler},
  {text: 'Translate to Latin', hotkey:"Last choose language",onclick: clickHandler, class:"translator"},
  null,
  {text: 'View page source', hotkey: 'Ctrl+U', onclick: clickHandler},
  {text: 'Inspect', hotkey: 'Ctrl+Shift+I', onclick: clickHandler},
]);

// pinDemo.appendChild(contextMenu);

const demoTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: demoContainer,
    endTrigger:".pricing-container",
    start:() => "top top",
    end: () => "bottom+=100% bottom",
    pin: demoContainer,
    scrub: true,
    onUpdate: (self) => {
      demoContainer.style.backgroundPosition = `${self.progress * 100}% center`;
    }
  },
});

const luminator = lumin(demoText);
contextMenu.show(demoText.offsetLeft * 1.5, demoText.offsetTop + 100); //TODO: not responsive

demoTimeline
  .to(demoText, {
    opacity: 1,
  }, '<')
  .to(luminator, {
    progress: 100, // highlight fully from 0 to 100 percentease: "none"
  },">")
  .fromTo(mousePointer, {
    x:"-25vw",
  }, {
    x:"25vw",
    y:100,
  },"<")
  .set(".context", {
    opacity: 1,
  },">")
  .to(mousePointer, {
    x:"27vw",
    y:280,
  },">")
  .set(luminator, {
    progress: 0,
  },">")
  .to('.texting-text', {
    text: {
      value: "Ex noto",
    },
  },">")
  .set(".translator", {
    backgroundColor: "#2777FF",
  },">")
  .set(".context", {
    opacity: 0,
    delay: 1
  },">")
;
