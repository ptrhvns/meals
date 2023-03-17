import * as TabsPrimitive from "@radix-ui/react-tabs";
import Anchor from "../components/Anchor";
import BrandList from "../components/BrandList";
import classes from "../styles/routes/Dashboard.module.scss";
import EquipmentList from "../components/EquipmentList";
import FoodList from "../components/FoodList";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipeList from "../components/RecipeList";
import RequireAuthn from "../components/RequireAuthn";
import TagList from "../components/TagList";
import UnitList from "../components/UnitList";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useNavigate, useParams } from "react-router-dom";

// Used as an "enum" of possible names of the tabs in Dashboard.
const tabs = {
  brands: "brands",
  equipment: "equipment",
  food: "food",
  recipes: "recipes",
  tags: "tags",
  times: "times",
  units: "units",
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
                Recipes
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.brands}
              >
                Brands
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.equipment}
              >
                Equipment
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.food}
              >
                Food
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.tags}
              >
                Tags
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.times}
              >
                Times
              </TabsPrimitive.Trigger>

              <TabsPrimitive.Trigger
                className={classes.tabsTrigger}
                value={tabs.units}
              >
                Units
              </TabsPrimitive.Trigger>
            </TabsPrimitive.List>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.recipes}
            >
              <Anchor to="/recipe/new" variant="filled">
                Create
              </Anchor>

              <RecipeList />
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.brands}
            >
              <Anchor to="/brand/new" variant="filled">
                Create
              </Anchor>

              <BrandList />
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.equipment}
            >
              <Anchor to="/equipment/new" variant="filled">
                Create
              </Anchor>

              <EquipmentList />
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.food}
            >
              <Anchor to="/food/new" variant="filled">
                Create
              </Anchor>

              <FoodList />
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.tags}
            >
              <Anchor to="/tag/new" variant="filled">
                Create
              </Anchor>

              <TagList />
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.times}
            >
              Times
            </TabsPrimitive.Content>

            <TabsPrimitive.Content
              className={classes.tabsContent}
              value={tabs.units}
            >
              <Anchor to="/unit/new" variant="filled">
                Create
              </Anchor>

              <UnitList />
            </TabsPrimitive.Content>
          </TabsPrimitive.Root>
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
