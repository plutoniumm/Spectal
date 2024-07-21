<script>
  import Person from "./person.svelte";
  import { onMount } from "svelte";
  import data from "./data.json";

  onMount(() => {
    const saved = localStorage.getItem("spec-data") || "[]";
    const sdata = JSON.parse(saved);
    sdata.forEach((person) => data.push(person));
  });

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
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const number = document.getElementById("number").value;
    const person = { n: name, r: role, nu: number };
    data.push(person);
    localStorage.setItem("spec-data", JSON.stringify(data));
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
    <div class="f">
      <form id="form" on:submit|preventDefault={addPerson}>
        <input type="text" id="name" placeholder="Name" required />
        <input type="text" id="role" placeholder="Role" required />
        <input type="tel" id="number" placeholder="Number" required />
        <button type="submit">Add</button>
      </form>

      <div id="demo"></div>
    </div>
  </details>

  <div id="cordis">
    {#each data as person}
      <div class="article">
        <Person {person} />
        <button on:click={() => SelectText(person.n)}>Select</button>
      </div>
    {/each}
  </div>
</body>

<style>
  /* Add your CSS here or import your stylesheet */
</style>
