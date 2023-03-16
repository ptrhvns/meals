import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import UnitNewForm from "../components/UnitNewForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function UnitNew() {
  const [units, setUnits] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { unitsGet } = useApi();

  useEffectOnce(async () => {
    const response = await unitsGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setUnits(response.data.units.map((e: { name: string }) => e.name));
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Unit")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/units">Dashboard</Anchor>
            Create Unit
          </Breadcrumbs>

          <Heading>Create Unit</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <UnitNewForm units={units} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
