<script>
  import Counter from "../micro/counter.svelte";

  export let data;
</script>

<style type="text/scss">
  section {
    z-index: 1;
  }
  .counters {
    padding: 1em;
    border-radius: 1.5rem;
    margin: 0 1%;
    display: flex;
    justify-content: space-between;
    background: linear-gradient(to right, red, BlueViolet);
  }

  h1 {
    padding: 0 1em;
    color: #fff;
    font-size: 4em;
    line-height: 0.5em;
  }
  .whatwedo {
    display: flex;
    flex-wrap: wrap;
    font-size: 0.5rem;
    margin: 1em 0;
    div {
      width: 100%;
      h1 {
        text-transform: uppercase;
        padding: 0.5em;
        margin: 20%;
        text-align: center;
        color: white;
        border: 0.5em solid white;
      }
      &:hover {
        h1 {
          background: white;
          color: black;
          transition: all 0.3s ease;
          padding: 0.5em;
        }
      }
    }
  }
  @media screen and (min-width: 768px) {
    .counters {
      margin: 0 10%;
    }
    .whatwedo {
      font-size: 0.5rem;
      margin: 3em 0;
      div {
        width: 50%;
      }
    }
  }
  @media screen and (min-width: 1200px) {
    .counters {
      margin: 0 20%;
    }
  }
</style>

<section>
  <h1><span class="level1">Our Events.</span></h1>
  <div class="counters">
    {#each data as ctr}
      <Counter name={ctr.name} value={ctr.value} />
    {/each}
  </div>
  <div class="whatwedo">
    <div style="background: purple">
      <h1>Bookings</h1>
    </div>
    <div style="background: red">
      <h1>Production</h1>
    </div>
  </div>
</section>
