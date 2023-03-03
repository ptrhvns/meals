import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/EquipmentEdit.module.scss";
import EquipmentEditForm from "../components/EquipmentEditForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { EquipmentData } from "../lib/types";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function EquipmentEdit() {
  const [equipment, setEquipment] = useState<EquipmentData>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { equipmentId } = useParams() as { equipmentId: string };
  const { equipmentPieceGet } = useApi();

  useEffectOnce(async () => {
    const response = await equipmentPieceGet({ equipmentId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setEquipment(response.data);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Equipment")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection className={classes.pageSection} variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/equipment">Dashboard</Anchor>
            Edit Equipment
          </Breadcrumbs>

          <Heading>Edit Equipment</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <EquipmentEditForm equipment={equipment} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
