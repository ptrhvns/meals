import Heading from "../components/Heading";
import PageCenteredSection from "../components/PageCenteredSection";
import Paragraph from "../components/Paragraph";
import SignupForm from "../components/SignupForm";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

import classes from "../styles/routes/Signup.module.scss";

export default function Signup() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Sign Up")}</title>
      </Helmet>

      <PageCenteredSection contentClassName={classes.content}>
        <Heading className={classes.heading}>Sign Up</Heading>

        <Paragraph className={classes.subheading}>
          Create an account to save time.
        </Paragraph>

        <SignupForm />
      </PageCenteredSection>
    </>
  );
}
