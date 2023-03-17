import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/UnitEdit.module.scss";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
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
  const [unit, setUnit] = useState<UnitData>();
  const [units, setUnits] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { unitGet, unitsGet } = useApi();
  const { unitId } = useParams() as { unitId: string };

  useEffectOnce(async () => {
    const responses = await Promise.all([unitGet({ unitId }), unitsGet()]);
    setLoading(false);

    for (let i = 0; i < responses.length; i++) {
      if (responses[i].isError) {
        handleApiError(responses[i], { setError });
        return;
      }
    }

    setUnit(responses[0].data.unit);
    setUnits(responses[1].data.units.map((b: { name: string }) => b.name));
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
            <UnitEditForm unit={unit} units={units} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
