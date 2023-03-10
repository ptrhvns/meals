import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import EquipmentNewForm from "../components/EquipmentNewForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function EquipmentNew() {
  const [equipment, setEquipment] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { equipmentGet } = useApi();

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

      <Navbar/>

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/equipment">Dashboard</Anchor>
            Create Equipment
          </Breadcrumbs>

          <Heading>Create Equipment</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <EquipmentNewForm equipment={equipment} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
