import * as TabsPrimitive from "@radix-ui/react-tabs";
import Anchor from "../components/Anchor";
import classes from "../styles/routes/Dashboard.module.scss";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipeList from "../components/RecipeList";
import RequireAuthn from "../components/RequireAuthn";
import TagList from "../components/TagList";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useNavigate, useParams } from "react-router-dom";

// Used as an "enum" of possible names of the tabs in Dashboard.
const tabs = {
  equipment: "equipment",
  recipes: "recipes",
  tags: "tags",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeTab } = useParams();

  useEffectOnce(() => {
    if (!activeTab || !Object.keys(tabs).includes(activeTab))
      navigate("/dashboard/recipes");
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Dashboard")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection>
          <Heading>Dashboard</Heading>

          <TabsPrimitive.Root
            className={classes.tabsRoot}
            onValueChange={(value) => navigate(`/dashboard/${value}`)}
            value={activeTab}
          >
            <TabsPrimitive.List className={classes.tabsList}>
              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.recipes}
              >
                <div className={classes.tabsTriggerContent}>
                  <div className={classes.tabsTriggerContentInner}>Recipes</div>
                </div>
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.tags}
              >
                <div className={classes.tabsTriggerContent}>
                  <div className={classes.tabsTriggerContentInner}>Tags</div>
                </div>
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.equipment}
              >
                <div className={classes.tabsTriggerContent}>
                  <div className={classes.tabsTriggerContentInner}>
                    Equipment
                  </div>
                </div>
              </TabsPrimitive.Trigger>
            </TabsPrimitive.List>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.recipes}
            >
              <Anchor to="/recipe/new" variant="filled">
                Create recipe
              </Anchor>

              <RecipeList />
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.tags}
            >
              <Anchor to="/tag/new" variant="filled">
                Create tag
              </Anchor>

              <TagList />
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.equipment}
            >
              <Anchor to="/equipment/new" variant="filled">
                Create equipment
              </Anchor>
            </TabsPrimitive.Content>
          </TabsPrimitive.Root>
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
