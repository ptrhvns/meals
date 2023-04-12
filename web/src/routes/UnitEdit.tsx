import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/UnitEdit.module.scss";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipesForUnitList from "../components/RecipesForUnitList";
import RequireAuthn from "../components/RequireAuthn";
import UnitEditForm from "../components/UnitEditForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { UnitData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function UnitEdit() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [unit, setUnit] = useState<UnitData>();
  const { unitGet } = useApi();
  const { unitId } = useParams() as { unitId: string };

  useEffectOnce(async () => {
    const response = await unitGet({ unitId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setUnit(response.data.unit);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Unit")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection className={classes.pageSection} variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/units">Dashboard</Anchor>
            Edit Unit
          </Breadcrumbs>

          <Heading>Edit Unit</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <UnitEditForm unit={unit} />
          )}
        </PageSection>

        <PageSection className={classes.pageSection} variant="narrow">
          {!loading && !error && (
            <>
              <Heading size={2}>Linked Recipes</Heading>
              <RecipesForUnitList unit={unit} />
            </>
          )}
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
