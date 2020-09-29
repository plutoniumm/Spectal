<script>
  export let data;
</script>

<style>
  section {
    background: url("../assets/bg/about.jpg");
    background-size: cover;
    background-position: center center;
    background-repeat: repeat;
    z-index: 1;
    padding: 1em 1em;
    text-align: center;
  }
  @media screen and (min-width: 768px) {
    section {
      padding: 2em 10%;
      padding-top: 15em;
    }
  }
  @media screen and (min-width: 1200px) {
    section {
      padding: 2em 20%;
      padding-top: 15em;
    }
  }
</style>

<section>
  <h1 style="font-size:4em;line-height:0.25em">This is Us.</h1>
  <p style="font-size:1.5em;line-height:1.5em;font-weight:600">{data.big}</p>
  <p style="font-size:1.25em;line-height:1.5em;font-weight:300">{data.small}</p>
</section>
