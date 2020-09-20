<script>
  export let team = []
</script>

<style type="text/scss">
  section {
    z-index: 1;
    padding: 1em 1.5em;
  }
  h1 {
    color: #fff;
    font-size: 4em;
    line-height: 0.5em;
    font-weight: 600;
  }
  .meContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 1em;
  }

  .flip-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 1em;
    height: 350px;
    border: 0.25em solid transparent;
    &:hover {
      border: 0.25em solid white;
      border-radius: 0.25em;
      transition: border 0.3s ease;
    }
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .flip-card-inner {
    flex: 7;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .flip-card-front,
  .flip-card-back {
    font-size: 1.25em;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  @media screen and (min-width: 768px) {
    .flip-card {
      width: 40%;
      height: 400px;
    }
    .flip-card-back {
      font-size: 1.25em;
    }
  }
  @media screen and (min-width: 1200px) {
    .flip-card {
      width: 30%;
      height: 450px;
    }
    .flip-card-back {
      font-size: 1.75em;
    }
  }
  .flip-card-back {
    display: flex;
    text-align: center;
    justify-content: left;
    background: linear-gradient(45deg, purple, red);
    color: white;
    word-wrap: break-word;
    opacity: 0;
  }
  .meDeets {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: #111;
    text-align: center;
    font-size: 1.33em;
  }

  .flip-card:hover {
    .flip-card-back {
      opacity: 1;
      transition: all 0.3s ease;
    }
    .meDeets {
      background: white;
      color: black;
      transition: all 0.3s ease;
    }
  }
</style>

<section>
  <h1><span class="level1">Bomb Squad.</span></h1>
  <p style="font-size:1.5em;font-weight:400;padding:0.25em">
    Meet the people behind spectal who put the world's toughest machines to
    shame
  </p>
  <div class="meContainer">
    {#each team as me}
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front"><img src={me.img} alt={me.name} /></div>
          <div class="flip-card-back">
            <span
              style="padding:1.5em;text-align:left;font-weight:500;line-height:1.5em">
              {me.text.slice(0, 180)}
            </span>
          </div>
        </div>
        <div class="meDeets">
          <span style="font-weight:600;font-size:0.9em;"> {me.name} |</span>
          {me.pos}
        </div>
      </div>
    {/each}
  </div>
</section>
