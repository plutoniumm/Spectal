<script>
      export let value, name;
</script>

<style>
      .counter {
            display: flex;
            flex-direction: column;
            font-size: 1em;
            font-weight: 600;
            padding: 0.25em 1em;
      }
</style>

<div class="counter">
      <div style="font-size:2.5em;">{value}+</div>
      <div>{name.toUpperCase()}</div>
</div>
