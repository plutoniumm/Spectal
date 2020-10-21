<script>
  import { fade } from "svelte/transition";
  import Tags from "../micro/tags.svelte";

  export let data;

  var x = setInterval(() => right(), 3000);

  const artists = data.map((el) => {
    return el.name;
  });
  $: i = 0;
  $: artist = artists[i];

  const left = () => {
    i = (i - 1 + artists.length) % artists.length;
    clearInterval(x);
    x = setInterval(() => right(), 3000);
  };
  const right = () => {
    i = (i + 1 + artists.length) % artists.length;
    clearInterval(x);
    x = setInterval(() => right(), 3000);
  };
</script>

<style type="text/scss">
  section {
    position: relative;
    .left,
    .right {
      outline: none;
      background: #eee;
      padding: 2.5em;
      color: #888;
      border-radius: 5em;
      border: 0;
      cursor: pointer;
      position: absolute;
      top: 40%;
    }
    .right {
      right: -55px;
      svg {
        position: relative;
        right: 25px;
      }
    }
    .left {
      left: -55px;
      height: 400px;
      svg {
        position: relative;
        left: 25px;
      }
    }
    ul {
      padding: 0;
      list-style: none;
      li {
        display: flex;
        max-height: 350px;
        .databox {
          padding: 1em;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          position: relative;
        }
        h1 {
          font-size: 2.5em;
          line-height: 0.25em;
        }
        img {
          width: 50%;
          min-width: 50%;
          position: relative;
          bottom: 0;
          object-fit: scale-down;
          filter: grayscale(100%);
          transition: all 0.3s ease;
          &:hover {
            cursor: pointer;
            transform: scale(1.1);
            filter: grayscale(0);
          }
        }
      }
    }
    .artists {
      height: auto;
      width: 100%;
      background: linear-gradient(to right, BlueViolet, Red);
      svg {
        width: 22px;
        height: 22px;
        fill: none;
        color: #000;
        stroke-width: 2px;
        stroke: currentcolor;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .bottomBox {
        width: 90%;
        padding-top: 0.5em;
        display: flex;
        justify-content: space-between;
        font-size: 1.5em;
        margin: 0 auto;
      }
      .learnMore {
        border: 2px solid #fff;
        background: transparent;
        font-weight: 600;
        color: #fff;
        outline: none;
        margin: 0.5em;
        font-size: 0.66em;
        position: relative;
        top: -0.5em;
        padding: 0.33em;
        border-radius: 0.5em;
        transition: all 0.3s ease;
        &:hover {
          border: 2px solid transparent;
          background: #fff;
          color: #111;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    ul {
      li {
        img {
          width: 100% !important;
          position: relative;
          bottom: 0;
          object-fit: contain !important;
          transition: none;
          filter: unset !important;
          &:hover {
            pointer-events: none;
            transform: none !important;
          }
        }
      }
    }
    .artists {
      height: auto;
      width: 100%;
      background: linear-gradient(to right, BlueViolet, Red);
      .bottomBox {
        position: relative;
        top: -1em;
        width: 95% !important;
        padding-top: 0 !important;
      }
    }
  }
  @media screen and (max-width: 500px) {
  }
</style>

<section>
  <div style="z-index: 1;padding: 1em;">
    <h1><span class="level1">Our Artists.</span></h1>
    <p style="font-size:1.5em;font-weight:400;padding:0.25em;">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, qui? Lorem
      ipsum dolor sit amet.
    </p>
  </div>
  <ul style="position: relative;">
    <div class="artists">
      {#each data as art}
        {#if art.name == artist}
          <li in:fade>
            <img src={art.img} alt="" />
            {#if window.innerWidth > 768}
              <div class="databox">
                <h1>{art.name}</h1>
                <p>{art.desc}</p>
                <Tags tags={art.links} />
              </div>
            {/if}
          </li>
          <div class="bottomBox">
            {art.name}
            <button class="learnMore">Learn More</button>
          </div>
        {/if}
      {/each}
      <button class="left" on:click={left}>
        <svg viewBox="0 0 32 32">
          <path d="M20 30 L8 16 20 2" />
        </svg>
      </button>
      <button class="right" on:click={right}>
        <svg viewBox="0 0 32 32">
          <path d="M12 30 L24 16 12 2" />
        </svg>
      </button>
    </div>
  </ul>
</section>
