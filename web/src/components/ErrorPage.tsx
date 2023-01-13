import Alert from "./Alert";
import classes from "../styles/components/ErrorPage.module.scss";
import Heading from "./Heading";
import PageCenteredCard from "./PageCenteredCard";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  if (import.meta.env.DEV) {
    console.error("A route error occurred:", error);
  }

  return (
    <>
      <Helmet>
        <title>{buildTitle("Error")}</title>
      </Helmet>

      <PageCenteredCard>
        <div className={classes.content}>
          <Heading className={classes.title}>Error</Heading>

          <Alert variant="error">
            <div className={classes.errorSection}>
              An unexpected error occured.
            </div>

            {isRouteErrorResponse(error) && (
              <>
                <div className={classes.errorSection}>
                  <i>
                    {error.statusText} ({error.status})
                  </i>
                </div>

                {error.data?.message && (
                  <div className={classes.errorSection}>
                    <i>{error.data.message}</i>
                  </div>
                )}
              </>
            )}
          </Alert>
        </div>
      </PageCenteredCard>
    </>
  );
}
