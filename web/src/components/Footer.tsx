import classes from "../styles/components/Footer.module.scss";
import Content from "./Content";
import Viewport from "./Viewport";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Viewport className={classes.viewport}>
      <Content>
        <footer className={classes.footer}>
          &copy; {currentYear} Bower Cat
        </footer>
      </Content>
    </Viewport>
  );
}
