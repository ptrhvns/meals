import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import BrandEditForm from "../components/BrandEditForm";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/BrandEdit.module.scss";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipesForBrandList from "../components/RecipesForBrandList";
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
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { brandGet } = useApi();
  const { brandId } = useParams() as { brandId: string };

  useEffectOnce(async () => {
    const response = await brandGet({ brandId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setBrand(response.data.brand);
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
            <BrandEditForm brand={brand} />
          )}
        </PageSection>

        <PageSection className={classes.pageSection} variant="narrow">
          {!loading && !error && (
            <>
              <Heading size={2}>Linked Recipes</Heading>
              <RecipesForBrandList brand={brand} />
            </>
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
