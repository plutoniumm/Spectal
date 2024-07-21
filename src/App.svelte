<script>
  import Person from "./person.svelte";
  import data from "./data.json";

  String.prototype.l = function () {
    return this.toLowerCase();
  };

  $: demo = { n: "", r: "", nu: "" };
  $: filter = "";

  function valid(person) {
    if (
      person.n.length > 3 &&
      person.n.length > 22 &&
      person.r.length > 3 &&
      person.r.length < 38 &&
      person.nu.length > 8 &&
      person.nu.length < 15
    ) {
      return true;
    }
  }

  function SelectText(element) {
    let text = document.getElementById(element),
      range,
      selection;
    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function addPerson() {
    if (!valid(demo)) {
      return;
    }
    const person = { ...demo };
    data.push(person);
    document.getElementById("form").reset();
  }
</script>

<link rel="stylesheet" href="./mail.css" />
<link rel="preconnect" href="https://i.imgur.com/" />

<body>
  <div>
    You can select and then <kbd>ctrl</kbd> + <kbd>C</kbd> and <kbd>ctrl</kbd> +
    <kbd>V</kbd> to copy-paste
  </div>

  <details>
    <summary>Create New</summary>
    <div class="create">
      <form on:submit|preventDefault={addPerson}>
        <input type="text" placeholder="Name" bind:value={demo.n} />
        <input type="text" placeholder="Role" bind:value={demo.r} />
        <input type="number" placeholder="Number" bind:value={demo.nu} />
        <button type="submit">Add</button>
      </form>

      <div id="demo">
        <Person person={demo} />
        <button on:click={() => SelectText(demo.n)}>Select</button>
      </div>
    </div>
  </details>

  <div id="filter" style="width: 100%;text-align:center;">
    <input
      style="border-radius: 5px;padding:5px;font-size:18px;border:0;min-width:330px;"
      type="text"
      placeholder="Search"
      bind:value={filter}
    />
  </div>

  <div id="cordis">
    {#each data as person}
      {#if (filter.length && person.n
          .l()
          .includes(filter.l())) || !filter.length}
        <div class="article">
          <Person {person} />
          <button on:click={() => SelectText(person.n)}>Select</button>
        </div>
      {/if}
    {/each}
  </div>
</body>

<style>
  details {
    margin: 10px;
    padding: 10px;
    background: #fff;
    border-radius: 5px;
  }

  .create,
  form {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  form {
    text-align: center;
    flex-direction: column;
  }
  input {
    margin: 5px;
  }
</style>
