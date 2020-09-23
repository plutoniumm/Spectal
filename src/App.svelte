<script>
  import Navbar from './navbar.svelte'
  import Video from './landing/video.svelte'
  import About from './landing/about.svelte'
  import Team from './landing/team.svelte'
  import Tmons from './landing/tmons.svelte'
  import Contact from './landing/contact.svelte'
  import data from './data.json'
</script>

<style>
</style>

<main>
  <Navbar socials={data.socials} />
  <Video />
  <About data={data.about} />
  <Tmons tmons={data.tmons} />
  <Team team={data.team} />
  <Contact details={data.contact} />
</main>
