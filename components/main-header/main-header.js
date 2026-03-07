import Link from "next/link";
import ImgLogo from "@/assets/Images/logoImage.png";
import classes from "./main-header.module.css";
import Image from "next/image";
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";

export default function MainHeader() {
  return (
    <>
      <header className={classes.header}>
        <MainHeaderBackground />
        <Link className={classes.logo} href="/">
          <Image src={ImgLogo} alt="This is logo" loading="eager" />
          Arti
        </Link>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/workspace">My Workspace</NavLink>
            </li>
            <li>
              <NavLink href="/collection">My Collection</NavLink>
            </li>
            <li>
              <NavLink href="/about">About Me</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
