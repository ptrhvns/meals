import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import TimeNewForm from "../components/TimeNewForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TimeNew() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [timeCategories, setTimeCategories] = useState<string[]>([]);
  const { recipeId } = useParams() as { recipeId: string };
  const { timeCategoriesGet } = useApi();

  useEffectOnce(async () => {
    const response = await timeCategoriesGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTimeCategories(
      response.data.timeCategories.map((t: { name: string }) => t.name)
    );
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Time")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Create Time
          </Breadcrumbs>

          <Heading>Create Time</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <TimeNewForm recipeId={recipeId} timeCategories={timeCategories} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
