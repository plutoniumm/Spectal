<script>
  export let person;
</script>

<table
  cellspacing="0"
  id={person.n}
  style="border-collapse:separate;font-family:sans-serif;font-size:14px;"
>
  <tr>
    <td id="spectalLogo" rowspan="6" style="padding-right:1.5em;">
      <a href="https://www.spectalmanagement.com">
        <img
          height="auto"
          width="95px"
          src="https://i.imgur.com/reiboGk.png"
          alt="Logo"
        />
      </a>
    </td>
  </tr>
  <tr>
    <td
      id="person"
      style="color:rgb(201,70,60);font-weight:700;font-size:1.25em;min-width: 275px;padding-top:0.25em;line-height:0.8em;"
      >{person.n}</td
    >
  </tr>
  <!-- TITLE -->
  <tr style="font-size: 1.1em;line-height:1em;">
    <td id="number" style="padding-top: 0.2em;">{person.r}</td>
  </tr>
  <!-- NUMBER -->
  <tr style="font-size: 0.8em;font-weight:400;">
    <td id="number" style="padding-top: 0.2em;padding-bottom: 0.25em;">
      <a style="text-decoration:none;color: #444;" href="tel:{person.nu}"
        >{person.nu}</a
      >
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://linkedin.com/company/spectal-talent-management">
        <img
          height="22px"
          width="22px"
          src="https://i.imgur.com/cJuTJAf.png"
          alt="LinkedIn"
        />
      </a>
      <a href="https://instagr.am/spectal.management/">
        <img
          height="22px"
          width="22px"
          src="https://i.imgur.com/T3XWzex.png"
          alt="Instagram"
        />
      </a>
    </td>
  </tr>
</table>
