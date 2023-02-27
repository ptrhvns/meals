import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import EquipmentNewForm from "../components/EquipmentNewForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function EquipmentNew() {
  const [equipment, setEquipment] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { equipmentGet } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffectOnce(async () => {
    const response = await equipmentGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setEquipment(
      response.data.equipment.map((e: { description: string }) => e.description)
    );
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Equipment")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Create Time
          </Breadcrumbs>

          <Heading>Create Equipment</Heading>

          {!loading && error && <Alert variant="error">{error}</Alert>}

          {!loading && !error && (
            <EquipmentNewForm equipment={equipment} recipeId={recipeId} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
