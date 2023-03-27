import Alert from "../components/Alert";
import classes from "../styles/routes/ErrorElementPage.module.scss";
import Heading from "../components/Heading";
import PageCenteredSection from "../components/PageCenteredSection";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorElementPage() {
  const error = useRouteError();

  if (import.meta.env.DEV) {
    console.error("A route error occurred:", error);
  }

  return (
    <>
      <Helmet>
        <title>{buildTitle("Error")}</title>
      </Helmet>

      <PageCenteredSection>
        <div className={classes.content}>
          <Heading className={classes.title}>Error</Heading>

          <Alert variant="error">
            An unexpected error occurred.
            {isRouteErrorResponse(error) && (
              <>
                <div className={classes.extraErrorSection}>
                  <i>
                    {error.statusText} ({error.status})
                  </i>
                </div>

                {error.data?.message && (
                  <div className={classes.extraErrorSection}>
                    <i>{error.data.message}</i>
                  </div>
                )}
              </>
            )}
          </Alert>
        </div>
      </PageCenteredSection>
    </>
  );
}
