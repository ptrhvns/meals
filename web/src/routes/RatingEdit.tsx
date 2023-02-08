import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RatingEditForm from "../components/RatingEditForm";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function RatingEdit() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number>();
  const { recipeId } = useParams() as { recipeId: string };
  const { ratingGet } = useApi();

  useEffectOnce(async () => {
    const response = await ratingGet({ recipeId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setRating(response.data.rating);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Rating")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Edit Rating
          </Breadcrumbs>

          <Heading>Edit Rating</Heading>

          {!loading && error && (
            <Alert onDismiss={() => setError(undefined)} variant="error">
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <RatingEditForm rating={rating} recipeId={recipeId} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
