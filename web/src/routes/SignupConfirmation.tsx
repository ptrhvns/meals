import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import classes from "../styles/routes/SignupConfirmation.module.scss";
import Heading from "../components/Heading";
import PageCenteredSection from "../components/PageCenteredSection";
import RequireGuest from "../components/RequireGuest";
import useApi from "../hooks/useApi";
import { buildTitle } from "../lib/utils";
import { compact, head, join } from "lodash";
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router";
import { useState } from "react";

export default function SignupConfirmation() {
  const [confirming, setConfirming] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const { token } = useParams() as { token: string };
  const { updateSignupConfirmation } = useApi();

  useEffectOnce(async () => {
    const response = await updateSignupConfirmation({ token });

    if (response.isError) {
      setError(
        join(compact([response.message, head(response.errors?.token)]), " ")
      );
    } else {
      setSuccess(response.message);
    }

    setConfirming(false);
  });

  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle("Sign Up Confirmation")}</title>
      </Helmet>

      <PageCenteredSection contentClassName={classes.content}>
        <Heading className={classes.heading}>Sign Up Confirmation</Heading>

        {confirming && (
          <Alert variant="info">
            <FontAwesomeIcon icon={faArrowsSpin} spin />
            <span className={classes.alertText}>
              Please wait while we confirm your signup ...
            </span>
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            {success} You may now use the username and password you previously
            created to{" "}
            <Anchor color="grass" to="/login">
              log in
            </Anchor>
            .
          </Alert>
        )}

        {error && <Alert variant="error">{error}</Alert>}
      </PageCenteredSection>
    </RequireGuest>
  );
}
