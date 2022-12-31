import * as TabsPrimitive from "@radix-ui/react-tabs";
import Anchor from "../components/Anchor";
import classes from "../styles/routes/Dashboard.module.scss";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import PageLayoutHeading from "../components/PageLayoutHeading";
import RecipeList from "../components/RecipeList";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

        <TabsPrimitive.Root
          className={classes.tabsRoot}
          defaultValue="recipeTab"
        >
          <TabsPrimitive.List className={classes.tabsList}>
            <TabsPrimitive.Trigger
              className={classes.tabsTrigger}
              value="recipeTab"
            >
              Recipes
            </TabsPrimitive.Trigger>
          </TabsPrimitive.List>

          <TabsPrimitive.Content
            className={classes.tabsContent}
            value="recipeTab"
          >
            <Anchor to="/recipe/new" variant="filled">
              <FontAwesomeIcon icon={faCirclePlus} /> Create recipe
            </Anchor>

            <RecipeList />
          </TabsPrimitive.Content>
        </TabsPrimitive.Root>
      </PageLayout>
    </RequireAuthn>
  );
}
