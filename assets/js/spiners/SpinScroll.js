/**
 * Created by mr_nili on 10/15/2017.
 */

let spinScrollCounter = 0;

function SpinScroll(elementId, imageCount, path) {
  this.el = document.getElementById(elementId);
  this.imageCount = imageCount;
  this.path = path;
  this.images = [];
  this.ready = false;

  if (!this.el) {
    console.error("❌ SpinScroll: element not found:", elementId);
    return;
  }

  const colors = ["#003635", "#dae8cc"];
  const color = colors[spinScrollCounter % 2];
  spinScrollCounter++;

  this.el.style.backgroundColor = color;
  this.el.style.backgroundImage = "none";

  this.preloadImages();

  window.addEventListener("scroll", () => this.updateBackground());
  window.addEventListener("resize", () => this.updateBackground());
}
  
  SpinScroll.prototype = {
    preloadImages: function () {
      let loaded = 0;
      const self = this;
  
      for (let i = 0; i < this.imageCount; i++) {
        const img = new Image();
        img.src = `${this.path}${i}.png`;
        img.onload = function () {
          loaded++;
          self.images[i] = img.src;
  
          if (loaded === self.imageCount) {
            self.ready = true;
            self.updateBackground();
            console.log("✅ All images loaded for", self.el.id);
          }
        };
        img.onerror = function () {
          console.warn("⚠️ Image failed:", img.src);
        };
      }
    },
  
    getProgress: function () {
      const rect = this.el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = this.el.offsetHeight;
      const range = windowHeight + elementHeight;
  
      let progress = (windowHeight - rect.top) / range;
      progress = Math.max(0, Math.min(1, progress));
  
      return progress;
    },
  
    updateBackground: function () {
      if (!this.ready) return;
  
      const progress = this.getProgress();
      const index = Math.round(progress * (this.imageCount - 1));
  
      const currentImage = this.images[index];
      if (currentImage) {
        this.el.style.backgroundImage = `url("${currentImage}")`;
      }
    },
  };  