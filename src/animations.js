const animations = () => ({
  active(id) {
    document.getElementById(id).className = "cell";
    window.requestAnimationFrame(function(time) {
      window.requestAnimationFrame(function(time) {
        document.getElementById(id).className = "cell active";
      });
    });
  },

  reset(id) {
    document.getElementById(id).className = "cell";
    window.requestAnimationFrame(function(time) {
      window.requestAnimationFrame(function(time) {
        document.getElementById(id).className = "cell reset";
      });
    });
  }
});

export {animations};
