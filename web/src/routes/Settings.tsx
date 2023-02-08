import AccountDeleteForm from "../components/AccountDeleteForm";
import Alert from "../components/Alert";
import classes from "../styles/routes/Settings.module.scss";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Settings() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Settings")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection>
          <Heading>Settings</Heading>

          <Heading size={2}>Account</Heading>

          <Heading className={classes.deleteAccountHeading} size={3}>
            Delete Account
          </Heading>

          <Alert
            alertClassName={classes.deleteAccountWarning}
            variant="warning"
          >
            Submitting this form will permanently delete your account.
          </Alert>

          <AccountDeleteForm />
        </PageSection>
      </FullPageViewport>
    </>
  );
}
