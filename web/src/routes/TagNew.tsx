import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import TagNewForm from "../components/TagNewForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function TagNew() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<string[]>([]);
  const { tagsGet } = useApi();

  useEffectOnce(async () => {
    const response = await tagsGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTags(response.data.tags.map((t: { name: string }) => t.name));
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Recipe")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/tags">Dashboard</Anchor>
            Create Tag
          </Breadcrumbs>

          <Heading>Create Tag</Heading>

          {!loading && error && <Alert variant="error">{error}</Alert>}

          {!loading && !error && <TagNewForm tags={tags} />}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
