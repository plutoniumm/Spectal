<script>
  import Navbar from "./navbar.svelte";
  import Video from "./components/video.svelte";
  import About from "./components/about.svelte";
  import Events from "./components/events.svelte";
  import Artists from "./components/artists.svelte";
  import Brands from "./components/brands.svelte";
  import Team from "./components/team.svelte";
  import Tmons from "./components/tmons.svelte";
  import Contact from "./components/contact.svelte";
  import data from "./data.json";
</script>

<style>
</style>

<main>
  <Navbar socials={data.socials} />
  <Video />
  <About data={data.about} />
  <Events data={data.events} />
  <Artists data={data.artists} />
  <Brands data={data.brands} />
  <Tmons tmons={data.tmons} />
  <Team team={data.team} />
  <Contact details={data.contact} />
</main>
