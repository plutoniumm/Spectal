<script>
  export let tmons = []
  import Carousel from '@beyonk/svelte-carousel'
  import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons'
</script>

<style>
  main {
    z-index: 1;
    padding: 1em 0;
  }
  .control :global(svg) {
    width: 100%;
    height: 100%;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  :global(.tmonCar) {
    margin: 1em 0;
    height: 15em;
    background: linear-gradient(
      90deg,
      magenta -10%,
      purple 15%,
      red 90%,
      yellow 105%
    );
  }
  :global(.tmonDots) {
    position: absolute;
    bottom: 0.5em;
  }
  .slide-content {
    text-align: center;
    padding: 0 1em;
  }
  .tmonText {
    font-size: 1.75em;
  }
  @media screen and (min-width: 505) {
    .tmonText {
      font-size: 2em;
    }
  }
</style>

<main>
  Testimonials
  <Carousel localizer="tmonCar" perPage="1" dotStyle="tmonDots">
    <span class="control" slot="left-control">
      <ChevronLeftIcon />
    </span>
    {#each tmons as tmn}
      <div class="slide-content">
        <h1 class="tmonText">{tmn.text}</h1>
        <span style="font-size:1.25em;">
          {tmn.name}
          <span style="font-weight:600;font-size:0.9em;">, {tmn.via} </span>
        </span>
      </div>
    {/each}
    <span class="control" slot="right-control">
      <ChevronRightIcon />
    </span>
  </Carousel>
</main>
