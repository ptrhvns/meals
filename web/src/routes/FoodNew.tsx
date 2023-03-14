import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FoodNewForm from "../components/FoodNewForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function FoodNew() {
  const [error, setError] = useState<string>();
  const [food, setFood] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { foodManyGet } = useApi();

  useEffectOnce(async () => {
    const response = await foodManyGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setFood(response.data.food.map((e: { name: string }) => e.name));
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Food")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/food">Dashboard</Anchor>
            Create Food
          </Breadcrumbs>

          <Heading>Create Food</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <FoodNewForm food={food} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
