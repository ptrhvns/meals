import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import DirectionEditForm from "../components/DirectionEditForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { DirectionData } from "../lib/types";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function DirectionEdit() {
  const [direction, setDirection] = useState<DirectionData>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { directionGet } = useApi();

  const { directionId, recipeId } = useParams() as {
    directionId: string;
    recipeId: string;
  };

  useEffectOnce(async () => {
    const response = await directionGet({ directionId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setDirection(response.data.direction);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Direction")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Edit direction
          </Breadcrumbs>

          <Heading>Edit Direction</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <DirectionEditForm direction={direction} recipeId={recipeId} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
