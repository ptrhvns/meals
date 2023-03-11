import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import BrandNewForm from "../components/BrandNewForm";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function BrandNew() {
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { brandsGet } = useApi();

  useEffectOnce(async () => {
    const response = await brandsGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setBrands(response.data.brands.map((e: { name: string }) => e.name));
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Brand")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/brands">Dashboard</Anchor>
            Create Brand
          </Breadcrumbs>

          <Heading>Create Brand</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <BrandNewForm brands={brands} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
