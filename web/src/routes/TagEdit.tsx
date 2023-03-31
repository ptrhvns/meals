import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/TagEdit.module.scss";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipesForTagList from "../components/RecipesForTagList";
import RequireAuthn from "../components/RequireAuthn";
import TagEditForm from "../components/TagEditForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { TagData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TagEdit() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [tag, setTag] = useState<TagData>();
  const { tagGet } = useApi();
  const { tagId } = useParams() as { tagId: string };

  useEffectOnce(async () => {
    const response = await tagGet({ tagId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTag(response.data.tag);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Tag")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection className={classes.pageSection} variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/tags">Dashboard</Anchor>
            Edit Tag
          </Breadcrumbs>

          <Heading>Edit Tag</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <TagEditForm tag={tag} />
          )}
        </PageSection>

        <PageSection className={classes.pageSection} variant="narrow">
          {!loading && !error && (
            <>
              <Heading size={2}>Linked Recipes</Heading>
              <RecipesForTagList tag={tag} />
            </>
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
