import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import TimeForRecipeEditForm from "../components/TimeForRecipeEditForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { TimeCategoryData, TimeData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TimeEdit() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [time, setTime] = useState<TimeData>();
  const [timeCategories, setTimeCategories] = useState<TimeCategoryData[]>();
  const { recipeId, timeId } = useParams() as {
    recipeId: string;
    timeId: string;
  };
  const { timeCategoriesGet, timeGet } = useApi();

  useEffectOnce(async () => {
    let response = await timeGet({ recipeId, timeId });

    if (response.isError) {
      setLoading(false);
      handleApiError(response, { setError });
      return;
    }

    setTime(response.data.time);
    response = await timeCategoriesGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTimeCategories(response.data.timeCategories);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Time")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Edit Time
          </Breadcrumbs>

          <Heading>Edit Time</Heading>

          {!loading && error && <Alert variant="error">{error}</Alert>}

          {!loading && !error && (
            <TimeForRecipeEditForm
              recipeId={recipeId}
              time={time}
              timeCategories={timeCategories}
            />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
