import Anchor from "../components/Anchor";
import classes from "../styles/routes/Login.module.scss";
import Heading from "../components/Heading";
import HorizontalRule from "../components/HorizontalRule";
import LoginForm from "../components/LoginForm";
import PageCenteredCard from "../components/PageCenteredCard";
import Paragraph from "../components/Paragraph";
import RequireGuest from "../components/RequireGuest";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Login() {
  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle("Log In")}</title>
      </Helmet>

      <PageCenteredCard>
        <Heading>Log In</Heading>
        <LoginForm />

        <HorizontalRule className={classes.hrelement} />

        <Paragraph>
          Don&apos;t have an account? <Anchor to="/signup">Sign up</Anchor>
        </Paragraph>
      </PageCenteredCard>
    </RequireGuest>
  );
}
