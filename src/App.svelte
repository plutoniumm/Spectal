<script>
  import Navbar from './navbar.svelte'
  import Video from './landing/video.svelte'
  import Contact from './landing/contact.svelte'
  import data from './data.json'
</script>

<style>
</style>

<main>
  <!-- <Navbar socials={data.socials} /> -->
  <!-- <Video /> -->
  <Contact details={data.contact} />
</main>
