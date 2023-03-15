import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/FoodEdit.module.scss";
import FoodEditForm from "../components/FoodEditForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
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
  const [foodMany, setFoodMany] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { foodId } = useParams() as { foodId: string };
  const { foodOneGet, foodManyGet } = useApi();

  useEffectOnce(async () => {
    const responses = await Promise.all([
      foodOneGet({ foodId }),
      foodManyGet(),
    ]);

    setLoading(false);

    for (let i = 0; i < responses.length; i++) {
      if (responses[i].isError) {
        handleApiError(responses[i], { setError });
        return;
      }
    }

    setFood(responses[0].data.foodOne);

    setFoodMany(
      responses[1].data.foodMany.map((b: { name: string }) => b.name)
    );
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
            <FoodEditForm foodOne={food} foodMany={foodMany} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
