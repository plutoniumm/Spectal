<script>
  export let person;
</script>

<table
  cellspacing="0"
  id={person.n}
  style="border-collapse:separate;font-family:sans-serif;text-transform:uppercase;font-size:16px;"
>
  <tr>
    <td id="spectalLogo" rowspan="6" style="padding-right:1.5em;">
      <a href="https://www.spectalmanagement.com">
        <img
          height="auto"
          width="150px"
          src="https://i.imgur.com/reiboGk.png"
          alt="Logo"
        />
      </a>
    </td>
  </tr>
  <tr>
    <td
      id="person"
      style="color:rgb(201,70,60);font-weight:700;font-size:1.25em;min-width: 400px;padding-top:0.5em;line-height:0.8em;"
      >{person.n}</td
    >
  </tr>
  <tr style="font-size: 1em;line-height:0.8em;">
    <td id="number">{person.r}</td>
  </tr>
  <tr style="font-size: 0.95em;font-weight:400;">
    <td id="number" style="padding-top: 0.2em;padding-bottom: 0.25em;">
      <a style="text-decoration:none;color: #888;" href="tel:{person.nu}"
        >{person.nu}</a
      >
    </td>
  </tr>
  <tr>
    <td style="padding-bottom:0.5em;">
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
          src="https://i.imgur.com/8G8uVuC.png"
          alt="Instagram"
        />
      </a>
    </td>
  </tr>
</table>
