import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/TimeCategoryEdit.module.scss";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipesForTimeCategoryList from "../components/RecipesForTimeCategoryList";
import RequireAuthn from "../components/RequireAuthn";
import TimeCategoryEditForm from "../components/TimeCategoryEditForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { TimeCategoryData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TimeCategoryEdit() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [timeCategory, setTimeCategory] = useState<TimeCategoryData>();
  const { timeCategoryGet } = useApi();
  const { timeCategoryId } = useParams() as { timeCategoryId: string };

  useEffectOnce(async () => {
    const response = await timeCategoryGet({ timeCategoryId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTimeCategory(response.data.timeCategory);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Time Category")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection className={classes.pageSection} variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/times">Dashboard</Anchor>
            Edit Time Category
          </Breadcrumbs>

          <Heading>Edit Time Category</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <TimeCategoryEditForm timeCategory={timeCategory} />
          )}
        </PageSection>

        <PageSection className={classes.pageSection} variant="narrow">
          {!loading && !error && (
            <>
              <Heading size={2}>Linked Recipes</Heading>
              <RecipesForTimeCategoryList timeCategory={timeCategory} />
            </>
          )}
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
