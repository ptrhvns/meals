import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/RecipeNew.module.scss";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RecipeNewForm from "../components/RecipeNewForm";
import RequireAuthn from "../components/RequireAuthn";
import Subheading from "../components/Subheading";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function RecipeNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Recipe")}</title>
      </Helmet>

      <Navbar />

      <PageLayout containerClassName={classes.pageLayout}>
        <Breadcrumbs>
          <Anchor to="/dashboard">Dashboard</Anchor>
          <Anchor to="/recipe/new">Create Recipe</Anchor>
        </Breadcrumbs>

        <Heading>Create Recipe</Heading>
        <Subheading>Start with a recipe title.</Subheading>

        <RecipeNewForm />
      </PageLayout>
    </RequireAuthn>
  );
}
