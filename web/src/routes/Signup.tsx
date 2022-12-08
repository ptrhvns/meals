import Anchor from "../components/Anchor";
import classes from "../styles/routes/Signup.module.scss";
import Heading from "../components/Heading";
import HRElement from "../components/HRElement";
import PageCenteredSection from "../components/PageCenteredSection";
import Paragraph from "../components/Paragraph";
import RequireGuest from "../components/RequireGuest";
import SignupForm from "../components/SignupForm";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Signup() {
  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle("Sign Up")}</title>
      </Helmet>

      <PageCenteredSection contentClassName={classes.content}>
        <Heading className={classes.heading}>Sign Up</Heading>

        <Paragraph className={classes.subheading}>
          Create an account to save time.
        </Paragraph>

        <SignupForm />

        <HRElement className={classes.hrelement} />

        <Paragraph>
          Already have an account? <Anchor to="/login">Log in</Anchor>
        </Paragraph>
      </PageCenteredSection>
    </RequireGuest>
  );
}
