import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/IngredientNew.module.scss";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import HorizontalRule from "../components/HorizontalRule";
import IngredientNewForm from "../components/IngredientNewForm";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import Paragraph from "../components/Paragraph";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function IngredientNew() {
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [food, setFood] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [units, setUnits] = useState<string[]>([]);
  const { brandsGet, foodManyGet, unitsGet } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffectOnce(async () => {
    const responses = await Promise.all([
      brandsGet(),
      foodManyGet(),
      unitsGet(),
    ]);

    for (let i = 0; i < responses.length; i++) {
      if (responses[i].isError) {
        setLoading(false);
        handleApiError(responses[i], { setError });
        return;
      }
    }

    setBrands(responses[0].data.brands.map((b: { name: string }) => b.name));
    setFood(responses[1].data.foodMany.map((f: { name: string }) => f.name));
    setUnits(responses[2].data.units.map((b: { name: string }) => b.name));
    setLoading(false);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Ingredient")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Create Ingredient
          </Breadcrumbs>

          <Heading>Create Ingredient</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <IngredientNewForm
              brands={brands}
              food={food}
              recipeId={recipeId}
              units={units}
            />
          )}

          <HorizontalRule className={classes.horizontalRule} />

          <Paragraph>
            <Anchor to="/dashboard/brands">Manage all brands</Anchor>
            <br />
            <Anchor to="/dashboard/food">Manage all food</Anchor>
            <br />
            <Anchor to="/dashboard/units">Manage all units</Anchor>
          </Paragraph>
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
