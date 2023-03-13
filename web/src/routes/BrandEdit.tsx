import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import BrandEditForm from "../components/BrandEditForm";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/BrandEdit.module.scss";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { BrandData } from "../lib/types";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function BrandEdit() {
  const [brand, setBrand] = useState<BrandData>();
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { brandGet, brandsGet } = useApi();
  const { brandId } = useParams() as { brandId: string };

  useEffectOnce(async () => {
    const responses = await Promise.all([brandGet({ brandId }), brandsGet()]);
    setLoading(false);

    for (let i = 0; i < responses.length; i++) {
      if (responses[i].isError) {
        handleApiError(responses[i], { setError });
        return;
      }
    }

    setBrand(responses[0].data.brand);
    setBrands(responses[1].data.brands.map((b: { name: string }) => b.name));
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Brand")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection className={classes.pageSection} variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/brands">Dashboard</Anchor>
            Edit Brand
          </Breadcrumbs>

          <Heading>Edit Brand</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <BrandEditForm brand={brand} brands={brands} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
