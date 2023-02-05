import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RequireAuthn from "../components/RequireAuthn";
import TimeNewForm from "../components/TimeNewForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
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

      <PageLayout variant="narrow">
        <Breadcrumbs>
          <Anchor to="/dashboard">Dashboard</Anchor>
          <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
          Create Time
        </Breadcrumbs>

        <Heading>Create Time</Heading>

        {!loading && error && (
          <Alert onDismiss={() => setError(undefined)} variant="error">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <TimeNewForm recipeId={recipeId} timeCategories={timeCategories} />
        )}
      </PageLayout>
    </RequireAuthn>
  );
}
