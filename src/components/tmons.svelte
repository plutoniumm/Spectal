<script>
  export let tmons = [];
  import Carousel from "@beyonk/svelte-carousel";
  import { ChevronLeftIcon, ChevronRightIcon } from "svelte-feather-icons";
</script>

<style type="text/scss">
  section {
    z-index: 1;
    padding: 1em 0;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 2.25em;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: +6px;
    transform: scaleY(0.75);
  }
  .control :global(svg) {
    width: 32px;
    height: 32px;
    color: #bbb;
    border: 1px solid #bbb;
    border-radius: 50%;
    &:hover {
      border: 1px solid #fff;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
    }
  }
  .tmonCar {
    margin: 0.5em 0;
    height: auto;
    padding: 0.25em 0;
    background: linear-gradient(
      90deg,
      magenta -10%,
      purple 15%,
      red 90%,
      yellow 105%
    );
  }
  .slide-content {
    position: relative;
    padding: 0 1em;
    padding-bottom: 2em;
  }
  .tmonText {
    text-align: center;
    font-size: 1em;
  }
  .tmnBy {
    padding: 0.5em;
    font-size: 1em;
    text-align: center;
  }
  @media screen and (min-width: 505px) {
    .tmonText {
      font-size: 1.5em;
    }
  }
  @media screen and (min-width: 768px) {
    .slide-content {
      padding: 0 2em;
      padding-bottom: 3em;
    }
    .title {
      letter-spacing: +10px;
    }
  }
</style>

<section class="tmonCar">
  <h1 class="title">Testimonials</h1>
  <Carousel perPage="1" dotStyle="tmonDots">
    <span class="control" slot="left-control">
      <ChevronLeftIcon />
    </span>
    {#each tmons as tmn}
      <div class="slide-content">
        <h2 class="tmonText">{tmn.text.slice(0, 180)}</h2>
        <p class="tmnBy">
          {tmn.name}
          <span style="font-weight:600;font-size:0.9em;">, {tmn.via} </span>
        </p>
      </div>
    {/each}
    <span class="control" slot="right-control">
      <ChevronRightIcon />
    </span>
  </Carousel>
</section>
