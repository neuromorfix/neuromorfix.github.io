document.addEventListener("DOMContentLoaded", function () {
    const FirstSpin  = new SpinScroll('First-Spin', 13, 'images/spiners/First-Spin/');
    const SecondSpin = new SpinScroll('Second-Spin', 13, 'images/spiners/Second-Spin/');
    const ThirdSpin  = new SpinScroll('Third-Spin', 11, 'images/spiners/Third-Spin/');
    
    function animate() {
        if (FirstSpin.ready)  FirstSpin.updateBackground();
        if (SecondSpin.ready) SecondSpin.updateBackground();
        if (ThirdSpin.ready)  ThirdSpin.updateBackground();
      requestAnimationFrame(animate);
    }
    animate();
  });