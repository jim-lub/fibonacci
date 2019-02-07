export const activateAnimationDirectlyOnTheDom = (id) => {
  document.getElementById(id).className = "cell";
  window.requestAnimationFrame(function(time) {
    window.requestAnimationFrame(function(time) {
      document.getElementById(id).className = "cell active";
    });
  });
}

export const resetAnimationDirectlyOnTheDom = (id) => {
  document.getElementById(id).className = "cell";
  window.requestAnimationFrame(function(time) {
    window.requestAnimationFrame(function(time) {
      document.getElementById(id).className = "cell reset";
    });
  });
}