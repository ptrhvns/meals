import AccountDeleteForm from "../components/AccountDeleteForm";
import classes from "../styles/routes/Settings.module.scss";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import PageLayoutHeading from "../components/PageLayoutHeading";
import Paragraph from "../components/Paragraph";
import { buildTitle } from "../lib/utils";
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

        <Heading className={classes.deleteAccountHeader} size={3}>
          Delete Account
        </Heading>

        <Paragraph>
          Warning: this will permanently delete your account.
        </Paragraph>

        <AccountDeleteForm />
      </PageLayout>
    </>
  );
}
