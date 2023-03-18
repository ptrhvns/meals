import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import TimeCategoryNewForm from "../components/TimeCategoryNewForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function TimeCategoryNew() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [timeCategories, setTimeCategories] = useState<string[]>([]);
  const { timeCategoriesGet } = useApi();

  useEffectOnce(async () => {
    const response = await timeCategoriesGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTimeCategories(
      response.data.timeCategories.map((e: { name: string }) => e.name)
    );
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Time Category")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/times">Dashboard</Anchor>
            Create Time Category
          </Breadcrumbs>

          <Heading>Create Time Category</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <TimeCategoryNewForm timeCategories={timeCategories} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
