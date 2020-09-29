<script>
  setTimeout(() => {
    video.play();
  }, 0);
</script>

<style>
  .videoBg {
    z-index: 0;
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
  }
  video {
    object-fit: cover;
  }
</style>

<div class="videoBgWrapper">
  <video loop autoplay class="videoBg">
    <track kind="captions" />
    <source src="./assets/video.mp4" type="video/mp4" />
  </video>
</div>
