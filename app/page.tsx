import Link from "next/link";

import classes from "./page.module.css";
import ImageSlideshow from "@/components/images/image-slideshow";

export default function Home() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>This is my Homepage</h1>
            <p>Place to stored my cerecmories and lifeway.</p>
          </div>
          <div className={classes.cta}>
            <Link href="/about">About Me</Link>
            <Link href="/collection">My Collection</Link>
          </div>
        </div>
      </header>
      <main></main>
    </>
  );
}
