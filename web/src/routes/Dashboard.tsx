import Anchor from "../components/Anchor";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import PageLayoutHeading from "../components/PageLayoutHeading";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Dashboard")}</title>
      </Helmet>

      <Navbar />

      <PageLayout>
        <PageLayoutHeading>Dashboard</PageLayoutHeading>
        <Heading size={2}>Recipes</Heading>
        <Anchor to="/recipe/new" variant="filled">
          Create recipe
        </Anchor>
      </PageLayout>
    </RequireAuthn>
  );
}
