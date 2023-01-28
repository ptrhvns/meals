import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RequireAuthn from "../components/RequireAuthn";
import TagNewForm from "../components/TagNewForm";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function TagNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Recipe")}</title>
      </Helmet>

      <Navbar />

      <PageLayout variant="narrow">
        <Breadcrumbs>
          <Anchor to="/dashboard">Dashboard</Anchor>
          Create Tag
        </Breadcrumbs>

        <Heading>Create Tag</Heading>

        <TagNewForm />
      </PageLayout>
    </RequireAuthn>
  );
}
