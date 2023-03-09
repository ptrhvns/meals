import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import IngredientEditForm from "../components/IngredientEditForm";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { IngredientData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function IngredientEdit() {
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [food, setFood] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState<IngredientData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [units, setUnits] = useState<string[]>([]);
  const { brandsGet, foodGet, ingredientGet, unitsGet } = useApi();
  const { recipeId, ingredientId } = useParams() as {
    ingredientId: string;
    recipeId: string;
  };

  useEffectOnce(async () => {
    const responses = await Promise.all([
      brandsGet(),
      foodGet(),
      ingredientGet({ ingredientId }),
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
    setFood(responses[1].data.food.map((f: { name: string }) => f.name));
    setIngredient(responses[2].data.ingredient);
    setUnits(responses[3].data.units.map((b: { name: string }) => b.name));
    setLoading(false);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Ingredient")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Edit Ingredient
          </Breadcrumbs>

          <Heading>Edit Ingredient</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <IngredientEditForm
              brands={brands}
              food={food}
              ingredient={ingredient}
              recipeId={recipeId}
              units={units}
            />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
