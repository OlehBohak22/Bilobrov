import "./App.css";

import { Header } from "./components/Header/Header";
import { HomeHero } from "./components/HomeHero/HomeHero";
import Products from "./components/Products";

function App() {
  return (
    <>
      <Header />
      <HomeHero />
      <Products />
    </>
  );
}

export default App;
