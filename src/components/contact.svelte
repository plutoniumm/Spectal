<script>
  export let details
</script>

<style>
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
  svg {
    position: relative;
    fill: white;
    padding: 0.5em;
    width: 2em;
    height: 2em;
  }
  .details {
    display: flex;
    flex-wrap: wrap;
    padding: 0.75em 0;
    font-size: 1.25em;
  }
  .deet {
    padding: 0.75em 0;
    word-wrap: break-word;
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    .details {
      padding: 3em 0;
    }
    .deet {
      width: 33%;
    }
  }
</style>

<section>
  <h1><span class="level1">Get in Touch.</span></h1>
  <p style="font-size:1.5em;font-weight:400;padding:0.25em;">
    We're always on the lookout for exceptional talent. Please write to us to
    get started!
  </p>
  <div class="details">
    <!-- EMAIL -->
    <div
      class="deet"
      style="align-items:center;margin:0 auto;text-align:center;">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path
            d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z" /></svg>
      </div>
      <div>
        <span style="font-weight:700;line-height:2em;">{details.email}</span>
        <br />
        <span>Email</span>
      </div>
    </div>
    <br />
    <!-- ADDRESS -->
    <div
      class="deet"
      style="align-items:center;margin:0 auto;text-align:center;">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path
            xmlns="http://www.w3.org/2000/svg"
            d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" /></svg>
      </div>
      <div>
        <span style="font-weight:700;line-height:2em;">{details.address}</span>
        <br />
        <span>Address</span>
      </div>
    </div><br />
    <!-- MOBILE -->
    <div
      class="deet"
      style="align-items:center;margin:0 auto;text-align:center;">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path
            d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" /></svg>
      </div>
      <div>
        <span style="font-weight:700;line-height:2em;">{details.phone}</span>
        <br />
        <span>Phone</span>
      </div>
    </div>
  </div>
</section>
