// pages/onboarding.tsx
import { GetServerSideProps } from "next";
import { withNoOnboardingCheck } from "../utils/withNoOnboardingCheck";
import { Field } from "react-final-form";
import Wizard from "@/components/Wizard";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Country } from "country-state-city";
import Select from "react-select";
import AsyncSelect from "react-select/async";

interface FormValues {
  name: string;
}

const StyledField = (props: any) => {
  return <Field {...props} className="rounded-md p-2" />;
};

const required = (value: any) => (value ? undefined : "Required");

const Error = ({ name }: { name: string }) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? (
        <span className="text-red-600 text-sm mt-1">{error}</span>
      ) : null
    }
  />
);

// Custom validation function to ensure the user is at least 18 years old
const minAgeValidator = (value: string): string | undefined => {
  const currentDate = new Date();
  const inputDate = new Date(value);
  const diff = currentDate.getTime() - inputDate.getTime();
  const age = diff / (1000 * 60 * 60 * 24 * 365.25);
  return age >= 18 ? undefined : "You must be at least 18 years old";
};

const minAge = () => {
  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear() - 18,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  return minDate.toISOString().split("T")[0];
};

const composeValidators = (
  ...validators: ((value: any) => string | undefined)[]
): ((value: any) => string | undefined) => {
  return (value: any): string | undefined => {
    return validators.reduce(
      (
        error: string | undefined,
        validator: (value: any) => string | undefined
      ) => error || validator(value),
      undefined
    );
  };
};

const countries = Country.getAllCountries().map((country) => {
  return {
    value: country.name,
    label: `${country.flag} ${country.name}`,
    flag: country.flag,
  };
});

export default function OnboardingPage() {
  const { push } = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Submitting onboarding form");
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.sub,
          name: values.name,
        }),
      });
      if (res.ok) {
        console.log("Onboarding form submitted successfully");
        push("/");
      } else {
        const errorData = await res.json();
        console.error("Error during onboarding:", errorData);
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  return (
    <Wizard initialValues={{ name: "" }} onSubmit={onSubmit}>
      <Wizard.Page>
        <div className="flex flex-col mind-h-[80px] w-full">
          <label className="text-zinc-900">Name</label>
          <StyledField
            name="name"
            component="input"
            type="text"
            placeholder="Name"
            validate={required}
          />
          <Error name="name" />
        </div>
        <div className="flex flex-col min-h-[80px] w-full">
          <label className="text-zinc-900">DOB</label>
          <StyledField
            type="date"
            name="dob"
            component="input"
            max={minAge()}
            validate={composeValidators(minAgeValidator, required)} // add custom validation function
          />
          <Error name="dob" />
        </div>

        <div className="flex flex-col min-h-[80px] w-full">
          <label className="text-zinc-900">Gender</label>
          <StyledField
            name="gender"
            component="select"
            validate={required} // add custom validation function
          >
            <option></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Nonbinary</option>
            <option value="other">Other</option>
          </StyledField>

          <Error name="gender" />
        </div>

        <div className="flex flex-col min-h-[80px]">
          <label className="text-zinc-900">Ethnic Background</label>
          <StyledField
            name="ethnicBackground"
            validate={required} // add custom validation function
          >
            {(props: any) => (
              <Select
                styles={{
                  valueContainer: (baseStyles, state) => ({
                    ...baseStyles,
                    flexWrap: "nowrap",
                    overflowX: "scroll",
                  }),
                  multiValue: (baseStyles, state) => ({
                    ...baseStyles,
                    minWidth: "100px",
                    justifyContent: "space-between",
                  }),
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderRadius: "6px",
                    border: "none",
                  }),
                }}
                isMulti
                options={countries}
                name={props.input.name}
                value={props.input.value}
                onChange={props.input.onChange}
              />
            )}
          </StyledField>

          <Error name="ethnicBackground" />
        </div>
      </Wizard.Page>
      <Wizard.Page>
        <div className="flex flex-col mind-h-[80px] w-full">
          <label className="text-zinc-900">Name</label>
        </div>
      </Wizard.Page>
    </Wizard>
  );
}

export const getServerSideProps: GetServerSideProps = withNoOnboardingCheck();
