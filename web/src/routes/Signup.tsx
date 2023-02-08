import Anchor from "../components/Anchor";
import classes from "../styles/routes/Signup.module.scss";
import Heading from "../components/Heading";
import HorizontalRule from "../components/HorizontalRule";
import PageCenteredSection from "../components/PageCenteredSection";
import Paragraph from "../components/Paragraph";
import RequireGuest from "../components/RequireGuest";
import SignupForm from "../components/SignupForm";
import Subheading from "../components/Subheading";
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

        <Subheading>Create an account to save time.</Subheading>

        <SignupForm />

        <HorizontalRule className={classes.horizontalRule} />

        <Paragraph>
          Already have an account? <Anchor to="/login">Log in</Anchor>
        </Paragraph>
      </PageCenteredSection>
    </RequireGuest>
  );
}
