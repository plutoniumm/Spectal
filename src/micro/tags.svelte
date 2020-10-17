<script>
      export let tags;
      import options from "./options.json";
</script>

<style>
      svg {
            fill: #fff;
            height: 22px;
            width: 22px;
      }
</style>

<div style="display:flex;justify-content:space-around">
      {#each options as opt}
            {#if tags[opt.name]}
                  <a href={tags[opt.name]}><svg viewBox="0 0 512 512"><path
                                    d={opt.path} />
                        </svg></a>
            {/if}
      {/each}
</div>
