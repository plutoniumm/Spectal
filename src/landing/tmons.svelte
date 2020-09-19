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
    background-color: green;
  }
  .slide-content {
    text-align: center;
  }
</style>

<main>
  <Carousel localizer="tmonCar" perPage="1">
    <span class="control" slot="left-control">
      <ChevronLeftIcon />
    </span>
    {#each tmons as tmn}
      <div class="slide-content">{tmn.name}</div>
    {/each}
    <span class="control" slot="right-control">
      <ChevronRightIcon />
    </span>
  </Carousel>
</main>
