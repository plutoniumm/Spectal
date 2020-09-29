<script>
  import { slide, fade } from "svelte/transition";

  let i = 0;
  setInterval(() => {
    i = (i + 1) % data.length;
  }, 3000);
  export let data;
</script>

<style type="text/scss">
  section {
    z-index: 1;
    padding: 1em;
  }
  h1 {
    color: #fff;
    font-size: 4em;
    line-height: 0.5em;
  }
  .carousel {
    margin: 1em;
    padding: 1em;
    min-height: 17em;
    border-radius: 0.5em;
    box-shadow: inset 0 -0.5em 1.5rem 4px #88888888,
      1.5rem 3rem 4.5rem 0.75rem rgba(0, 0, 0, 1);
    overflow: hidden;
  }
  .slide-content {
    display: flex;
    padding: 1em;
    align-items: center;
    justify-content: space-around;
  }
  .bar {
    background-image: url(../assets/deco/grad-redYel.svg);
    background-position: bottom left 0.1em;
    background-repeat: no-repeat;
    background-size: 33% 100%;
    height: 14em;
  }
  ul {
    list-style: none;
    right: 2.25em;
    top: 19em;
    li::before {
      content: "\2022";
      font-size: 2em;
      font-weight: bold;
      width: 1em;
      margin-left: -1em;
    }
  }
  @media screen and (max-width: 768px) {
    .carousel {
      margin: 1em 0.25em;
      padding: 0.25em 1em;
      height: 14em;
    }
    .bar {
      height: 12em;
    }
  }
  @media screen and (max-width: 500px) {
    .carousel {
      font-size: 0.5em;
      margin: 0.25em;
      padding: 0.25em;
      height: 10em;
    }
    .slide-content {
      position: relative;
      top: -1em;
      font-weight: 300;
    }
    .bar {
      height: 8em;
    }
    ul {
      top: 43em;
    }
  }
</style>

<section>
  <h1><span class="level1">Our Brands.</span></h1>
  <p style="font-size:1.5em;font-weight:400;padding:0.25em;">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, qui? Lorem
    ipsum dolor sit amet.
  </p>
  <div class="carousel">
    <!-- <ul style="position: absolute;">
      {#each data as bnd, idx}
        {#if idx == i}
          <li style="color: orange;" />
        {:else}
          <li style="color: #333; " />
        {/if}
      {/each}
    </ul> -->
    {#each data as bnd, idx}
      {#if idx == i}
        <div class="slide-content" transition:slide={{ y: 50, duration: 1000 }}>
          <img
            style="width:20%;max-height:10em;flex:10;padding:1em;object-fit:contain;"
            src={bnd.img}
            alt="brandlogo" />
          <div style="flex:0.25" class="bar">&nbsp;</div>
          <div style="flex:20;padding: 2em 1em;font-weight:500;font-size:1.5em">
            {bnd.desc.slice(0, 180)}
          </div>
        </div>
      {/if}
    {/each}
  </div>
</section>
