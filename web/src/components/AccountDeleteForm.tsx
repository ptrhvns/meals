// import Alert from "./Alert";
// import FieldError from "./FieldError";
// import Spinner from "./Spinner";
// import useApi from "../hooks/useApi";
// import useAuthn from "../hooks/useAuthn";
// import useIsMounted from "../hooks/useIsMounted";
// import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { handleResponseErrors } from "../lib/utils";
// import { pick } from "lodash";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
//
// function AccountDeleteForm() {
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const authn = useAuthn();
//   const navigate = useNavigate();
//   const { isUnmounted } = useIsMounted();
//   const { post } = useApi();
//
//   const {
//     formState: { errors },
//     handleSubmit,
//     register,
//     reset,
//     setError,
//   } = useForm();
//
//   const handleHideForm = () => {
//     setShowForm(false);
//     reset();
//     setAlertMessage(null);
//   };
//
//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//
//     const response = await post({
//       data: pick(data, ["password"]),
//       route: "accountDestroy",
//     });
//
//     // istanbul ignore next
//     if (isUnmounted()) {
//       return;
//     }
//
//     setIsSubmitting(false);
//
//     if (response.isError) {
//       handleResponseErrors({ response, setAlertMessage, setError });
//       return;
//     }
//
//     authn.logout(() => navigate("/"));
//   };
//
//   return (
//     <div className="account-delete-form">
//       {showForm ? (
//         <form
//           data-testid="account-delete-form-form"
//           onSubmit={handleSubmit(onSubmit)}
//         >
//           {alertMessage && (
//             <Alert
//               className="account-delete-form-alert"
//               onDismiss={() => setAlertMessage(null)}
//               variant="error"
//             >
//               {alertMessage}
//             </Alert>
//           )}
//
//           <div className="account-delete-form-field">
//             <div>
//               <label htmlFor="password">Password</label>
//             </div>
//
//             <div className="account-delete-form-input-wrapper">
//               <input
//                 className={`${errors.password ? "error" : ""}`}
//                 id="password"
//                 type="password"
//                 {...register("password", {
//                   required: "Password is required.",
//                 })}
//               />
//             </div>
//
//             <FieldError
//               className="account-delete-form__field-error"
//               error={errors?.password?.message}
//             />
//           </div>
//
//           <div className="account-delete-form-actions">
//             <button className="button-danger" type="submit">
//               <Spinner spin={isSubmitting}>
//                 <FontAwesomeIcon icon={faTrashCan} />
//               </Spinner>{" "}
//               Delete my account
//             </button>
//
//             <button onClick={handleHideForm} type="button">
//               Dismiss
//             </button>
//           </div>
//         </form>
//       ) : (
//         <>
//           <button
//             className="button-danger"
//             onClick={() => setShowForm(true)}
//             type="button"
//           >
//             Delete my account
//           </button>
//         </>
//       )}
//     </div>
//   );
// }
//
// export default AccountDeleteForm;

import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/AccountDeleteForm.module.scss";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
import useApi from "../hooks/useApi";
import useAuthn from "../hooks/useAuthn";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface FormData {
  password: string;
}

export default function AccountDeleteForm() {
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { accountsDestroy } = useApi();
  const { logout } = useAuthn();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data: FormData) => {
    setSubmitting(true);

    if (
      !window.confirm(
        "Are you sure you want to delete your account, and permanently delete all of your data?"
      )
    ) {
      setSubmitting(false);
      return;
    }

    const response = await accountsDestroy(data);
    setSubmitting(false);

    if (response.isError) {
      return handleApiError<FormData>(response, {
        setFieldError,
        setFormError,
      });
    }

    logout(() => navigate("/", { replace: true }));
  });

  const onAlertDismiss = () => setFormError(undefined);

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      {formError && (
        <Alert onDismiss={onAlertDismiss} variant="error">
          {formError}
        </Alert>
      )}

      <Field>
        <Label htmlFor="password">Password</Label>
        <Input
          disabled={submitting}
          error={!!fieldErrors?.password?.message}
          id="password"
          type="password"
          {...register("password", { required: "Password is required." })}
        />
        <InputError error={fieldErrors?.password?.message} />
      </Field>

      <FormActions>
        <Button
          color="red"
          disabled={submitting}
          type="submit"
          variant="filled"
        >
          Delete account
        </Button>
      </FormActions>
    </form>
  );
}
