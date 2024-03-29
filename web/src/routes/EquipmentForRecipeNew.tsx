import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/EquipmentForRecipeNew.module.scss";
import EquipmentForRecipeNewForm from "../components/EquipmentForRecipeNewForm";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import HorizontalRule from "../components/HorizontalRule";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import Paragraph from "../components/Paragraph";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function EquipmentForRecipeNew() {
  const [equipment, setEquipment] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { equipmentManyGet } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffectOnce(async () => {
    const response = await equipmentManyGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setEquipment(
      response.data.equipmentMany.map(
        (e: { description: string }) => e.description
      )
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

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <EquipmentForRecipeNewForm
              equipment={equipment}
              recipeId={recipeId}
            />
          )}

          <HorizontalRule className={classes.horizontalRule} />

          <Paragraph>
            <Anchor to="/dashboard/equipment">Manage all equipment</Anchor>
          </Paragraph>
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
