import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/FoodEdit.module.scss";
import FoodEditForm from "../components/FoodEditForm";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipesForFoodList from "../components/RecipesForFoodList";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FoodData } from "../lib/types";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function FoodEdit() {
  const [error, setError] = useState<string>();
  const [food, setFood] = useState<FoodData>();
  const [loading, setLoading] = useState<boolean>(true);
  const { foodId } = useParams() as { foodId: string };
  const { foodOneGet } = useApi();

  useEffectOnce(async () => {
    const response = await foodOneGet({ foodId });

    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setFood(response.data.foodOne);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Food")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection className={classes.pageSection} variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/food">Dashboard</Anchor>
            Edit Food
          </Breadcrumbs>

          <Heading>Edit Food</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <FoodEditForm foodOne={food} />
          )}
        </PageSection>

        <PageSection className={classes.pageSection} variant="narrow">
          {!loading && !error && (
            <>
              <Heading size={2}>Linked Recipes</Heading>
              <RecipesForFoodList food={food} />
            </>
          )}
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
