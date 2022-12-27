import AccountDeleteForm from "../components/AccountDeleteForm";
import classes from "../styles/routes/Settings.module.scss";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import PageLayoutHeading from "../components/PageLayoutHeading";
import Paragraph from "../components/Paragraph";
import { buildTitle } from "../lib/utils";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";

export default function Settings() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Settings")}</title>
      </Helmet>

      <Navbar />

      <PageLayout>
        <PageLayoutHeading>Settings</PageLayoutHeading>

        <Heading size={2}>Account</Heading>

        <Heading className={classes.deleteAccountHeading} size={3}>
          Delete Account
        </Heading>

        <Paragraph className={classes.deleteAccountWarning}>
          <FontAwesomeIcon icon={faCircleExclamation} /> Submitting this form
          will permanently delete your account.
        </Paragraph>

        <AccountDeleteForm />
      </PageLayout>
    </>
  );
}
